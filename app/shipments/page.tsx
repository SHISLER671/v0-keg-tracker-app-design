import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { ShipmentManager } from "@/components/shipment-manager"
import { ProtectedRoute } from "@/components/protected-route"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function ShipmentsPage() {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <TopBar />
            <main className="flex-1 p-6 bg-muted/20">
              <ShipmentManager />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
