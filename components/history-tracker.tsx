"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import {
  History,
  Search,
  Filter,
  Download,
  Package,
  Truck,
  User,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"

const mockHistoryEvents = [
  {
    id: "HE-001",
    timestamp: "2024-01-20T14:30:00Z",
    kegId: "KT-2847",
    event: "Delivered",
    location: "Downtown Brewery",
    user: "Alex Chen",
    details: "Successfully delivered to customer location",
    temperature: "38°F",
    status: "Success",
  },
  {
    id: "HE-002",
    timestamp: "2024-01-20T12:15:00Z",
    kegId: "KT-2847",
    event: "In Transit",
    location: "Highway 101, CA",
    user: "Alex Chen",
    details: "Departed from warehouse, en route to destination",
    temperature: "37°F",
    status: "Success",
  },
  {
    id: "HE-003",
    timestamp: "2024-01-20T09:00:00Z",
    kegId: "KT-2847",
    event: "Loaded",
    location: "Main Warehouse",
    user: "Sarah Miller",
    details: "Keg loaded onto delivery truck",
    temperature: "36°F",
    status: "Success",
  },
  {
    id: "HE-004",
    timestamp: "2024-01-19T16:45:00Z",
    kegId: "KT-1234",
    event: "Quality Check",
    location: "Production Facility",
    user: "Mike Johnson",
    details: "Quality inspection completed successfully",
    temperature: "35°F",
    status: "Success",
  },
  {
    id: "HE-005",
    timestamp: "2024-01-19T14:20:00Z",
    kegId: "KT-5678",
    event: "Temperature Alert",
    location: "Storage Area B",
    user: "System",
    details: "Temperature exceeded safe threshold",
    temperature: "45°F",
    status: "Alert",
  },
  {
    id: "HE-006",
    timestamp: "2024-01-19T11:30:00Z",
    kegId: "KT-3456",
    event: "Refilled",
    location: "Production Line 2",
    user: "Emma Davis",
    details: "Keg refilled with Wheat Beer - Summer Breeze",
    temperature: "34°F",
    status: "Success",
  },
  {
    id: "HE-007",
    timestamp: "2024-01-18T15:10:00Z",
    kegId: "KT-2847",
    event: "NFT Minted",
    location: "Blockchain Network",
    user: "System",
    details: "NFT created for keg authentication",
    temperature: "N/A",
    status: "Success",
  },
  {
    id: "HE-008",
    timestamp: "2024-01-18T13:45:00Z",
    kegId: "KT-2847",
    event: "Created",
    location: "Production Facility",
    user: "John Doe",
    details: "New keg created and registered in system",
    temperature: "35°F",
    status: "Success",
  },
]

export function HistoryTracker() {
  const [searchQuery, setSearchQuery] = useState("")
  const [eventFilter, setEventFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  const filteredEvents = mockHistoryEvents.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.kegId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.user.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesEvent = eventFilter === "all" || event.event.toLowerCase().includes(eventFilter)
    const matchesStatus = statusFilter === "all" || event.status.toLowerCase() === statusFilter

    return matchesSearch && matchesEvent && matchesStatus
  })

  const getEventIcon = (event: string) => {
    switch (event.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "in transit":
        return <Truck className="h-4 w-4 text-blue-500" />
      case "loaded":
        return <Package className="h-4 w-4 text-purple-500" />
      case "quality check":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "temperature alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "refilled":
        return <RefreshCw className="h-4 w-4 text-blue-500" />
      case "nft minted":
        return <Package className="h-4 w-4 text-purple-500" />
      case "created":
        return <Package className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Success":
        return "bg-green-500"
      case "Alert":
        return "bg-red-500"
      case "Warning":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">History Tracker</h1>
          <p className="text-muted-foreground">Complete audit trail of all keg activities and events</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export History
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockHistoryEvents.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockHistoryEvents.filter((e) => e.timestamp.startsWith("2024-01-20")).length}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Events</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockHistoryEvents.filter((e) => e.status === "Success").length}</div>
            <p className="text-xs text-muted-foreground">98.5% success rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockHistoryEvents.filter((e) => e.status === "Alert").length}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by keg ID, event, location, or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="transit">In Transit</SelectItem>
                <SelectItem value="loaded">Loaded</SelectItem>
                <SelectItem value="quality">Quality Check</SelectItem>
                <SelectItem value="refilled">Refilled</SelectItem>
                <SelectItem value="created">Created</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* History Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Event Timeline</CardTitle>
          <CardDescription>{filteredEvents.length} events found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    {getEventIcon(event.event)}
                  </div>
                  {index < filteredEvents.length - 1 && <div className="w-px h-12 bg-border mt-2" />}
                </div>

                <div className="flex-1 pb-8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{event.event}</h3>
                      <Badge variant="outline" className="text-xs">
                        {event.kegId}
                      </Badge>
                      <Badge className={`${getStatusColor(event.status)} text-xs`}>{event.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(event.timestamp), "MMM dd, yyyy HH:mm")}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{event.details}</p>

                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{event.user}</span>
                    </div>
                    {event.temperature !== "N/A" && (
                      <div className="flex items-center gap-1">
                        <span>🌡️</span>
                        <span>{event.temperature}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(event.timestamp), "HH:mm:ss")}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
