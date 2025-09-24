import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { PartnerManager } from "@/components/partner-manager"
import { ProtectedRoute } from "@/components/protected-route"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function PartnersPage() {
  return (
    <ProtectedRoute allowedRoles={["Admin", "Partner"]}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <TopBar />
            <main className="flex-1 p-6 bg-muted/20">
              <PartnerManager />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
