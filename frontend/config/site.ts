export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Bitcoin Portfolio",
  description:
    "Track your sBTC portfolio on Stacks",
  mainNav: [
    {
      title: "Dashboard",
      href: "/portfolio",
    },
    {
      title: "Stacks Positions",
      href: "/positions",
    },
    {
      title: "Invest",
      href: "/invest",
    }
  ],
  links: {
    twitter: "https://twitter.com/kamalbuilds",
    docs: "https://ui.shadcn.com",
  },
}
