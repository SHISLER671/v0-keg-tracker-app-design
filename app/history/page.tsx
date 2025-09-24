import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/top-bar"
import { HistoryTracker } from "@/components/history-tracker"
import { ProtectedRoute } from "@/components/protected-route"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <TopBar />
            <main className="flex-1 p-6 bg-muted/20">
              <HistoryTracker />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
