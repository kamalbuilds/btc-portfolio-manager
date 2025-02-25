import { Transaction } from '@/types/sbtc'

const API_BASE_URL = process.env.NEXT_PUBLIC_SBTC_API_URL || 'http://temp.sbtc-emily-dev.com'
const HIRO_API_URL = 'https://api.hiro.so'

export interface DepositRequest {
  amount: number
  recipient: string
}

export interface WithdrawalRequest {
  amount: number
  btcAddress: string
  maxFee: number
}

export interface PortfolioStats {
  totalBalance: number
  totalDeposits: number
  totalWithdrawals: number
  priceChange24h: number
  btcPrice: number
  sbtcPrice: number
}

export interface HiroBalances {
  stx: {
    balance: string
    total_sent: string
    total_received: string
    total_fees_sent: string
    total_miner_rewards_received: string
    lock_tx_id: string
    locked: string
    lock_height: number
    burnchain_lock_height: number
    burnchain_unlock_height: number
  }
  fungible_tokens: {
    [key: string]: {
      balance: string
      total_sent: string
      total_received: string
    }
  }
  non_fungible_tokens: {
    [key: string]: {
      count: string
      total_sent: string
      total_received: string
    }
  }
}

class SBTCService {
  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  private async fetchHiroApi(endpoint: string): Promise<any> {
    const response = await fetch(`${HIRO_API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Hiro API error! status: ${response.status}`)
    }

    return response.json()
  }

  async getHiroBalances(address: string): Promise<HiroBalances> {
    return this.fetchHiroApi(`/extended/v1/address/${address}/balances`)
  }

  async getPortfolioStats(address: string): Promise<PortfolioStats> {
    try {
      const [portfolioData, hiroBalances] = await Promise.all([
        this.fetchWithAuth(`/portfolio/${address}`),
        this.getHiroBalances(address)
      ])

      // Convert Hiro balances from strings to numbers and merge with portfolio data
      return {
        ...portfolioData,
        // Add any additional balance processing from Hiro API data if needed
        totalBalance: Number(hiroBalances.stx.balance) / 1_000_000, // Convert from microSTX to STX
      }
    } catch (error) {
      console.error('Error fetching portfolio stats:', error)
      throw error
    }
  }

  async getTransactions(address: string): Promise<Transaction[]> {
    return this.fetchWithAuth(`/transactions/${address}`)
  }

  async initiateDeposit(request: DepositRequest): Promise<{ depositAddress: string }> {
    return this.fetchWithAuth('/deposit', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async initiateWithdrawal(request: WithdrawalRequest): Promise<{ requestId: string }> {
    return this.fetchWithAuth('/withdrawal', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async getDepositStatus(txId: string): Promise<{
    status: 'pending' | 'completed' | 'failed'
    confirmations: number
  }> {
    return this.fetchWithAuth(`/deposit/${txId}/status`)
  }

  async getWithdrawalStatus(requestId: string): Promise<{
    status: 'pending' | 'completed' | 'failed'
    txId?: string
  }> {
    return this.fetchWithAuth(`/withdrawal/${requestId}/status`)
  }
}

export const sbtcService = new SBTCService() 