"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserProfile } from "@/components/user-profile"
import { Search, Bell, Wallet } from "lucide-react"
import { useBlockchain } from "@/contexts/blockchain-context"

export function TopBar() {
  const { isConnected, address, connectWallet, disconnectWallet } = useBlockchain()

  return (
    <header className="flex items-center justify-between p-3 sm:p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <SidebarTrigger className="flex-shrink-0" />
        <div className="relative flex-1 max-w-xs sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search kegs, shipments..." className="pl-10 w-full text-sm sm:text-base" />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
        <Button
          variant={isConnected ? "default" : "outline"}
          size="sm"
          className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
          onClick={isConnected ? disconnectWallet : connectWallet}
        >
          <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">
            {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"}
          </span>
          <span className="sm:hidden">{isConnected ? `${address?.slice(0, 4)}...` : "Connect"}</span>
        </Button>

        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-xs">
            3
          </Badge>
        </Button>

        <div className="hidden sm:block">
          <ThemeToggle />
        </div>

        <UserProfile />
      </div>
    </header>
  )
}
