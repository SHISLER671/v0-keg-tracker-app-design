import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { BlockchainProvider } from "@/contexts/blockchain-context"
import { Toaster } from "@/components/ui/toaster"
import { AIChatAssistant } from "@/components/ai-chat-assistant"

export const metadata: Metadata = {
  title: "KegTracker - Beer Keg Supply Chain Management",
  description: "Track and manage beer kegs throughout the supply chain with blockchain technology",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <BlockchainProvider>
              {children}
              <AIChatAssistant />
              <Toaster />
            </BlockchainProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
