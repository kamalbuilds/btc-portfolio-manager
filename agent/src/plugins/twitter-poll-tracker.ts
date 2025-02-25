import { Character, Plugin } from "@elizaos/core";
import { TwitterApi } from "twitter-api-v2";
import { ethers } from "ethers";
import {
  PredictionMarketABI,
  PREDICTION_MARKET_CONTRACT_ADDRESS,
} from "../predictionContract/predictionmarket.contract";

interface TweetData {
  data: {
    id: string;
    text: string;
    author_id: string;
    entities?: {
      mentions?: Array<{ username: string }>;
    };
  };
}

export class TwitterPollTrackerPlugin implements Plugin {
  public name: string = "Twitter Poll Tracker";
  public description: string =
    "Tracks Twitter polls and creates prediction markets";
  public version: string = "1.0.0";
  private twitter: TwitterApi;
  private provider: ethers.providers.JsonRpcProvider;
  private predictionMarket: ethers.Contract;
  private wallet: ethers.Wallet;

  constructor(character: Character) {
    // Validate required environment variables
    const requiredEnvVars = {
      TWITTER_API_KEY: process.env.TWITTER_API_KEY,
      TWITTER_API_SECRET: process.env.TWITTER_API_SECRET,
      TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
      TWITTER_ACCESS_SECRET: process.env.TWITTER_ACCESS_SECRET,
      CHAIN_RPC_URL: process.env.CHAIN_RPC_URL,
      PRIVATE_KEY: process.env.PRIVATE_KEY,
      PREDICTION_MARKET_ADDRESS: process.env.PREDICTION_MARKET_ADDRESS,
    };

    // Check for missing environment variables
    const missingVars = Object.entries(requiredEnvVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}`
      );
    }

    // Initialize Twitter client
    this.twitter = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY!,
      appSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    });

    try {
      // Initialize blockchain connection
      this.provider = new ethers.providers.JsonRpcProvider(
        process.env.CHAIN_RPC_URL
      );

      // Validate private key format
      if (!process.env.PRIVATE_KEY?.startsWith("0x")) {
        this.wallet = new ethers.Wallet(
          "0x" + process.env.PRIVATE_KEY,
          this.provider
        );
      } else {
        this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      }

      this.predictionMarket = new ethers.Contract(
        PREDICTION_MARKET_CONTRACT_ADDRESS,
        PredictionMarketABI,
        this.wallet
      );
    } catch (error) {
      console.error("Error initializing blockchain connection:", error);
      throw new Error("Failed to initialize blockchain connection");
    }
  }

  async start() {
    // Start streaming mentions
    const rules = await this.twitter.v2.streamRules();
    if (rules.data?.length === 0) {
      await this.twitter.v2.updateStreamRules({
        add: [{ value: `@${process.env.AGENT_USERNAME} create market:` }],
      });
    }

    const stream = await this.twitter.v2.searchStream({
      "tweet.fields": ["author_id", "created_at", "entities"],
      expansions: ["referenced_tweets.id"],
    });

    stream.on("data", async (tweet: TweetData) => {
      try {
        if (this.isValidMarketRequest(tweet)) {
          await this.handleMarketRequest(tweet);
        }
      } catch (err) {
        console.error("Error handling tweet:", err);
      }
    });
  }

  private isValidMarketRequest(tweet: TweetData): boolean {
    return tweet.data.text
      .toLowerCase()
      .includes(`@${process.env.AGENT_USERNAME?.toLowerCase()} create market:`);
  }

  private parseMarketRequest(
    text: string
  ): { question: string; options: string[] } | null {
    const regex = /"([^"]+)"\s*Options:\s*([^/]+)\/([^/\n]+)/i;
    const match = text.match(regex);

    if (!match) return null;

    return {
      question: match[1].trim(),
      options: [match[2].trim(), match[3].trim()],
    };
  }

  private async handleMarketRequest(tweet: TweetData) {
    const parsedRequest = this.parseMarketRequest(tweet.data.text);
    if (!parsedRequest) {
      await this.twitter.v2.reply(
        'Sorry, I couldn\'t understand the market format. Please use: "Question" Options: Option1/Option2',
        tweet.data.id
      );
      return;
    }

    try {
      // Create prediction market with 7 days duration
      const tx = await this.predictionMarket.createMarket(
        parsedRequest.question,
        parsedRequest.options[0],
        parsedRequest.options[1],
        7 * 24 * 60 * 60, // 7 days in seconds
        "SOCIAL", // Default category
        [], // No tags for now
        100 // 1% fee
      );
      await tx.wait();

      const marketId = (await this.predictionMarket.marketCount()) - 1;
      const marketUrl = `${process.env.FRONTEND_URL}/markets/${marketId}`;

      // Reply to tweet with market link
      await this.twitter.v2.reply(
        `✨ Market created! Predict now at: ${marketUrl}\n\nQuestion: ${parsedRequest.question}\nOptions: ${parsedRequest.options[0]} vs ${parsedRequest.options[1]}`,
        tweet.data.id
      );
    } catch (err) {
      console.error("Error creating market:", err);
      await this.twitter.v2.reply(
        "Sorry, there was an error creating the market. Please try again later.",
        tweet.data.id
      );
    }
  }

  async stop() {
    // Cleanup
  }
}
