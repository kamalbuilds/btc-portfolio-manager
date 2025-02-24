export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "sBTC Portfolio",
  description:
    "Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.",
  mainNav: [
    {
      title: "Dashboard",
      href: "/portfolio",
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
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}
