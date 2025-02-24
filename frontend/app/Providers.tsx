"use client";

import { bitcoinAdapter, projectId, networks } from "@/config/reownConfig";
import { createAppKit } from "@reown/appkit/react";
import React, { type ReactNode } from "react";

// Set up metadata
const metadata = {
    name: 'sBTC Portfolio',
    description: 'Track and manage your sBTC positions',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    icons: ['/logo.png'],
}

// Create the modal
export const modal = createAppKit({
    adapters: [bitcoinAdapter],
    projectId,
    networks,
    metadata,
    features: {
        analytics: true, // Optional - defaults to your Cloud configuration
        socials: [],
        email: false,
    },
    themeVariables: {
        "--w3m-accent": "#000000",
    },
});

function Providers({ children }: { children: ReactNode }) {
    return <>{children}</>;
}

export default Providers;
