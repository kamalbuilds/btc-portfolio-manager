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
      title: "Positions",
      href: "/positions",
    },
    {
      title: "Transactions",
      href: "/portfolio/transactions",
    },
    {
      title: "Settings",
      href: "/portfolio/settings",
    },
  ],
  links: {
    twitter: "https://twitter.com/kamalbuilds",
    docs: "https://ui.shadcn.com",
  },
}
