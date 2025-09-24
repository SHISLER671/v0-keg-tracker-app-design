"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import {
  Truck,
  Plus,
  Search,
  Filter,
  Clock,
  Package,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Link,
  Eye,
  Phone,
} from "lucide-react"

const mockShipments = [
  {
    id: "SH-1234",
    driver: "Alex Chen",
    vehicle: "Truck-001",
    route: "San Francisco → Oakland → Berkeley",
    kegs: ["KT-2847", "KT-2848", "KT-2849"],
    status: "In Transit",
    currentLocation: "Highway 101, CA",
    destination: "Downtown Brewery",
    departureTime: "2024-01-20T08:00:00Z",
    estimatedArrival: "2024-01-20T14:30:00Z",
    actualArrival: null,
    temperature: "38°F",
    progress: 65,
    alerts: 0,
    distance: "45 miles",
    priority: "High",
  },
  {
    id: "SH-1235",
    driver: "Sarah Miller",
    vehicle: "Truck-002",
    route: "Main Warehouse → Craft Beer Co.",
    kegs: ["KT-1234", "KT-1235"],
    status: "Delivered",
    currentLocation: "Craft Beer Co.",
    destination: "Craft Beer Co.",
    departureTime: "2024-01-19T10:00:00Z",
    estimatedArrival: "2024-01-19T15:00:00Z",
    actualArrival: "2024-01-19T14:45:00Z",
    temperature: "37°F",
    progress: 100,
    alerts: 0,
    distance: "28 miles",
    priority: "Medium",
  },
  {
    id: "SH-1236",
    driver: "Mike Johnson",
    vehicle: "Truck-003",
    route: "Warehouse B → City Brewery → Metro Taphouse",
    kegs: ["KT-5678", "KT-5679", "KT-5680", "KT-5681"],
    status: "Alert",
    currentLocation: "Warehouse B",
    destination: "City Brewery",
    departureTime: "2024-01-20T06:00:00Z",
    estimatedArrival: "2024-01-20T16:00:00Z",
    actualArrival: null,
    temperature: "45°F",
    progress: 25,
    alerts: 2,
    distance: "67 miles",
    priority: "High",
  },
  {
    id: "SH-1237",
    driver: "Emma Davis",
    vehicle: "Truck-004",
    route: "Main Warehouse → Suburban Taphouse",
    kegs: ["KT-3456", "KT-3457"],
    status: "Loading",
    currentLocation: "Main Warehouse",
    destination: "Suburban Taphouse",
    departureTime: "2024-01-20T12:00:00Z",
    estimatedArrival: "2024-01-20T16:15:00Z",
    actualArrival: null,
    temperature: "36°F",
    progress: 0,
    alerts: 0,
    distance: "32 miles",
    priority: "Medium",
  },
  {
    id: "SH-1238",
    driver: "David Wilson",
    vehicle: "Truck-005",
    route: "Production → Cold Storage → Quality Lab",
    kegs: ["KT-7890", "KT-7891", "KT-7892"],
    status: "Scheduled",
    currentLocation: "Production Facility",
    destination: "Quality Lab",
    departureTime: "2024-01-21T09:00:00Z",
    estimatedArrival: "2024-01-21T11:30:00Z",
    actualArrival: null,
    temperature: "35°F",
    progress: 0,
    alerts: 0,
    distance: "15 miles",
    priority: "Low",
  },
]

export function ShipmentManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  const filteredShipments = mockShipments.filter((shipment) => {
    const matchesSearch =
      searchQuery === "" ||
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.vehicle.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || shipment.status.toLowerCase() === statusFilter
    const matchesPriority = priorityFilter === "all" || shipment.priority.toLowerCase() === priorityFilter

    let matchesTab = true
    if (activeTab === "active") {
      matchesTab = ["In Transit", "Loading", "Scheduled"].includes(shipment.status)
    } else if (activeTab === "completed") {
      matchesTab = shipment.status === "Delivered"
    } else if (activeTab === "pending") {
      matchesTab = ["Scheduled", "Loading"].includes(shipment.status)
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesTab
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500"
      case "In Transit":
        return "bg-blue-500"
      case "Alert":
        return "bg-red-500"
      case "Loading":
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
      case "Delivered":
        return <CheckCircle className="h-4 w-4" />
      case "In Transit":
        return <Truck className="h-4 w-4" />
      case "Alert":
        return <AlertTriangle className="h-4 w-4" />
      case "Loading":
        return <Package className="h-4 w-4" />
      case "Scheduled":
        return <Calendar className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const handleShipmentAction = (action: string, shipmentId: string) => {
    toast({
      title: `${action} Action`,
      description: `${action} performed on shipment ${shipmentId}`,
    })
  }

  const handleBlockchainRecord = (shipmentId: string) => {
    toast({
      title: "Blockchain Recording",
      description: `Shipment ${shipmentId} recorded on blockchain successfully`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shipment Management</h1>
          <p className="text-muted-foreground">Track and manage all keg shipments and deliveries</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Shipment
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Navigation className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Currently moving</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Awaiting dispatch</p>
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
                  placeholder="Search by shipment ID, driver, destination, or vehicle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="loading">Loading</SelectItem>
                <SelectItem value="in transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
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

      {/* Tabs for shipment categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipments</CardTitle>
              <CardDescription>
                {activeTab === "all" && "All shipments in the system"}
                {activeTab === "active" && "Currently active shipments (In Transit, Loading, Scheduled)"}
                {activeTab === "completed" && "Successfully delivered shipments"}
                {activeTab === "pending" && "Shipments awaiting dispatch or loading"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment #</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Kegs</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-medium">{shipment.id}</TableCell>
                        <TableCell>
                          <div className="max-w-[200px]">
                            <p className="truncate">{shipment.route}</p>
                            <p className="text-xs text-muted-foreground truncate">{shipment.currentLocation}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(shipment.status)} text-xs`}>{shipment.status}</Badge>
                            {shipment.alerts > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {shipment.alerts} Alert{shipment.alerts > 1 ? "s" : ""}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium">{shipment.kegs.length}</span>
                            <div className="flex gap-1">
                              {shipment.kegs.slice(0, 2).map((keg) => (
                                <Badge key={keg} variant="outline" className="text-xs">
                                  {keg}
                                </Badge>
                              ))}
                              {shipment.kegs.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{shipment.kegs.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{shipment.driver}</p>
                            <p className="text-xs text-muted-foreground">{shipment.vehicle}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {shipment.status === "Delivered" ? (
                              <Badge variant="outline" className="text-green-600">
                                Delivered
                              </Badge>
                            ) : (
                              <div>
                                <p className="font-medium">
                                  {new Date(shipment.estimatedArrival).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(shipment.estimatedArrival).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShipmentAction("Track", shipment.id)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleShipmentAction("Contact", shipment.id)}
                            >
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleBlockchainRecord(shipment.id)}
                              className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                            >
                              <Link className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-4">
                {filteredShipments.map((shipment) => (
                  <Card key={shipment.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(shipment.status)}
                        <span className="font-medium text-sm">{shipment.id}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge className={`${getStatusColor(shipment.status)} text-xs`}>{shipment.status}</Badge>
                        {shipment.alerts > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {shipment.alerts}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Route:</span>
                        <span className="text-right truncate max-w-[200px]">{shipment.route}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Driver:</span>
                        <span>{shipment.driver}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Kegs:</span>
                        <div className="flex gap-1">
                          <span className="font-medium">{shipment.kegs.length}</span>
                          {shipment.kegs.slice(0, 1).map((keg) => (
                            <Badge key={keg} variant="outline" className="text-xs">
                              {keg}
                            </Badge>
                          ))}
                          {shipment.kegs.length > 1 && (
                            <Badge variant="outline" className="text-xs">
                              +{shipment.kegs.length - 1}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">ETA:</span>
                        <span>
                          {shipment.status === "Delivered" ? (
                            <Badge variant="outline" className="text-green-600 text-xs">
                              Delivered
                            </Badge>
                          ) : (
                            <span className="text-xs">
                              {new Date(shipment.estimatedArrival).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3 pt-3 border-t">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShipmentAction("Track", shipment.id)}
                        className="flex-1"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Track
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShipmentAction("Contact", shipment.id)}
                        className="flex-1"
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBlockchainRecord(shipment.id)}
                        className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                      >
                        <Link className="h-3 w-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredShipments.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No shipments found matching your criteria.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
