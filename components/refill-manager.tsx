"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { RefreshCw, Plus, Package, Calendar, User, MapPin, CheckCircle, Clock, AlertTriangle } from "lucide-react"

const mockRefillRequests = [
  {
    id: "RF-001",
    kegId: "KT-2847",
    requestDate: "2024-01-20",
    requester: "Downtown Brewery",
    location: "123 Main St, San Francisco, CA",
    beerType: "IPA - Hoppy Delight",
    priority: "High",
    status: "Pending",
    estimatedCompletion: "2024-01-22",
    notes: "Rush order for weekend event",
  },
  {
    id: "RF-002",
    kegId: "KT-1234",
    requestDate: "2024-01-19",
    requester: "Craft Beer Co.",
    location: "456 Oak Ave, Oakland, CA",
    beerType: "Lager - Golden Brew",
    priority: "Medium",
    status: "In Progress",
    estimatedCompletion: "2024-01-21",
    notes: "Standard refill request",
  },
  {
    id: "RF-003",
    kegId: "KT-5678",
    requestDate: "2024-01-18",
    requester: "City Brewery",
    location: "789 Pine St, Berkeley, CA",
    beerType: "Stout - Dark Roast",
    priority: "Low",
    status: "Completed",
    estimatedCompletion: "2024-01-20",
    notes: "Completed ahead of schedule",
  },
  {
    id: "RF-004",
    kegId: "KT-3456",
    requestDate: "2024-01-21",
    requester: "Suburban Taphouse",
    location: "321 Elm St, San Jose, CA",
    beerType: "Wheat Beer - Summer Breeze",
    priority: "High",
    status: "Scheduled",
    estimatedCompletion: "2024-01-23",
    notes: "Scheduled for tomorrow morning",
  },
]

export function RefillManager() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const { toast } = useToast()

  const filteredRequests = mockRefillRequests.filter((request) => {
    const matchesStatus = statusFilter === "all" || request.status.toLowerCase() === statusFilter
    const matchesPriority = priorityFilter === "all" || request.priority.toLowerCase() === priorityFilter
    return matchesStatus && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500"
      case "In Progress":
        return "bg-blue-500"
      case "Pending":
        return "bg-yellow-500"
      case "Scheduled":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="h-4 w-4" />
      case "In Progress":
        return <RefreshCw className="h-4 w-4" />
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Scheduled":
        return <Calendar className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const handleStatusUpdate = (requestId: string, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Refill request ${requestId} status changed to ${newStatus}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Refill Management</h1>
          <p className="text-muted-foreground">Manage keg refill requests and scheduling</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Refill Request
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRefillRequests.filter((r) => r.status === "Pending").length}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockRefillRequests.filter((r) => r.status === "In Progress").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently being processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockRefillRequests.filter((r) => r.status === "Completed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockRefillRequests.filter((r) => r.priority === "High").length}</div>
            <p className="text-xs text-muted-foreground">Urgent requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Refill Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Refill Requests</CardTitle>
          <CardDescription>{filteredRequests.length} requests found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedRequest === request.id ? "bg-primary/10 border-primary" : "bg-muted/50 hover:bg-muted/70"
                }`}
                onClick={() => setSelectedRequest(request.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <h3 className="font-medium">{request.id}</h3>
                      <p className="text-sm text-muted-foreground">Keg: {request.kegId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getPriorityColor(request.priority)} text-xs`}>{request.priority}</Badge>
                    <Badge className={`${getStatusColor(request.status)} text-xs`}>{request.status}</Badge>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{request.requester}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{request.beerType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Due: {request.estimatedCompletion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{request.location}</span>
                  </div>
                </div>

                {request.notes && (
                  <div className="mt-3 p-2 bg-muted/30 rounded text-sm">
                    <strong>Notes:</strong> {request.notes}
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStatusUpdate(request.id, "In Progress")
                    }}
                  >
                    Start Processing
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStatusUpdate(request.id, "Completed")
                    }}
                  >
                    Mark Complete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
