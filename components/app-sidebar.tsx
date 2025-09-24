import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  BarChart3,
  QrCode,
  MapPin,
  RefreshCw,
  History,
  Coins,
  Shield,
  Search,
  Package,
  Truck,
  Users,
  Beer,
} from "lucide-react"
import Link from "next/link"

const menuItems = [
  { title: "Dashboard", icon: BarChart3, href: "/" },
  { title: "Scan & Track", icon: QrCode, href: "/scan" },
  { title: "Real-time Tracking", icon: MapPin, href: "/tracking" },
  { title: "Refill", icon: RefreshCw, href: "/refill" },
  { title: "History", icon: History, href: "/history" },
  { title: "NFT Manager", icon: Coins, href: "/nft" },
  { title: "Verify", icon: Shield, href: "/verify" },
  { title: "Blockchain Explorer", icon: Search, href: "/explorer" },
  { title: "Kegs", icon: Package, href: "/kegs" },
  { title: "Shipments", icon: Truck, href: "/shipments" },
  { title: "Partners", icon: Users, href: "/partners" },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-3 sm:p-4">
        <div className="flex items-center gap-2">
          <Beer className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold truncate">KegTracker</h1>
            <p className="text-xs text-muted-foreground truncate">Supply Chain Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 sm:px-0">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className="px-3 py-2 sm:px-4 sm:py-3">
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate text-sm sm:text-base">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-3 sm:p-4">
        <div className="text-xs text-muted-foreground truncate">v1.0.0 - Blockchain Enabled</div>
      </SidebarFooter>
    </Sidebar>
  )
}
