"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Truck,
  Package,
  Clock,
  Thermometer,
  Navigation,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Search,
  Link,
  History,
  ArrowRight,
} from "lucide-react"

const mockShipments = [
  {
    id: "SH-1234",
    driver: "Alex Chen",
    vehicle: "Truck-001",
    kegs: [
      { id: "KT-2847", nftId: "NFT-2847", hasNFT: true },
      { id: "KT-2848", nftId: "NFT-2848", hasNFT: true },
      { id: "KT-2849", nftId: "NFT-2849", hasNFT: false },
    ],
    status: "In Transit",
    currentLocation: "Highway 101, CA",
    destination: "Downtown Brewery",
    eta: "2:30 PM",
    temperature: "38°F",
    progress: 65,
    alerts: 0,
    timestamp: "2024-01-15 14:23:00",
    nftTransfers: [
      { from: "Brewery Co.", to: "Transport LLC", timestamp: "2024-01-15 09:15:00", txHash: "0x1a2b3c..." },
      { from: "Transport LLC", to: "Downtown Brewery", timestamp: "2024-01-15 14:20:00", txHash: "0x4d5e6f..." },
    ],
  },
  {
    id: "SH-1235",
    driver: "Sarah Miller",
    vehicle: "Truck-002",
    kegs: [
      { id: "KT-1234", nftId: "NFT-1234", hasNFT: true },
      { id: "KT-1235", nftId: "NFT-1235", hasNFT: true },
    ],
    status: "Delivered",
    currentLocation: "Craft Beer Co.",
    destination: "Craft Beer Co.",
    eta: "Delivered",
    temperature: "37°F",
    progress: 100,
    alerts: 0,
    timestamp: "2024-01-15 13:45:00",
    nftTransfers: [
      { from: "Main Brewery", to: "Logistics Inc.", timestamp: "2024-01-15 08:30:00", txHash: "0x7g8h9i..." },
      { from: "Logistics Inc.", to: "Craft Beer Co.", timestamp: "2024-01-15 13:40:00", txHash: "0xj1k2l3..." },
    ],
  },
  {
    id: "SH-1236",
    driver: "Mike Johnson",
    vehicle: "Truck-003",
    kegs: ["KT-5678", "KT-5679", "KT-5680", "KT-5681"],
    status: "Alert",
    currentLocation: "Warehouse B",
    destination: "City Brewery",
    eta: "Delayed",
    temperature: "45°F",
    progress: 25,
    alerts: 2,
    timestamp: "2024-01-15 12:00:00",
    nftTransfers: [],
  },
  {
    id: "SH-1237",
    driver: "Emma Davis",
    vehicle: "Truck-004",
    kegs: ["KT-3456", "KT-3457"],
    status: "Loading",
    currentLocation: "Main Warehouse",
    destination: "Suburban Taphouse",
    eta: "4:15 PM",
    temperature: "36°F",
    progress: 0,
    alerts: 0,
    timestamp: "2024-01-15 09:00:00",
    nftTransfers: [],
  },
]

const mockNFTTransfers = [
  {
    kegId: "KT-2847",
    nftId: "NFT-2847",
    transfers: [
      {
        from: "Brewery Co.",
        to: "Transport LLC",
        timestamp: "2024-01-15 09:15:00",
        txHash: "0x1a2b3c4d5e6f",
        status: "Confirmed",
      },
      {
        from: "Transport LLC",
        to: "Downtown Brewery",
        timestamp: "2024-01-15 14:20:00",
        txHash: "0x4d5e6f7g8h9i",
        status: "Pending",
      },
    ],
  },
  {
    kegId: "KT-2848",
    nftId: "NFT-2848",
    transfers: [
      {
        from: "Brewery Co.",
        to: "Transport LLC",
        timestamp: "2024-01-15 09:15:00",
        txHash: "0x2b3c4d5e6f7g",
        status: "Confirmed",
      },
      {
        from: "Transport LLC",
        to: "Downtown Brewery",
        timestamp: "2024-01-15 14:20:00",
        txHash: "0x5e6f7g8h9i1j",
        status: "Pending",
      },
    ],
  },
]

export function RealTimeTracking() {
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("map")

  const filteredShipments = mockShipments.filter((shipment) => {
    const matchesStatus = statusFilter === "all" || shipment.status.toLowerCase() === statusFilter
    const matchesSearch =
      searchQuery === "" ||
      shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
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
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-time Tracking</h1>
          <p className="text-muted-foreground">Monitor all active shipments and their current locations</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search shipments, drivers, destinations..."
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
                <SelectItem value="in transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
                <SelectItem value="loading">Loading</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Enhanced Map View */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Live Map
                </CardTitle>
                <CardDescription>Real-time locations of all active shipments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg flex items-center justify-center border-2 border-dashed relative overflow-hidden">
                  {/* Mock map markers */}
                  <div className="absolute top-4 left-8 w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute top-12 right-16 w-3 h-3 bg-green-500 rounded-full shadow-lg"></div>
                  <div className="absolute bottom-8 left-1/3 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute bottom-16 right-8 w-3 h-3 bg-yellow-500 rounded-full shadow-lg"></div>

                  <div className="text-center z-10">
                    <Navigation className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Interactive map with live tracking</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Showing {filteredShipments.length} active shipments
                    </p>
                  </div>
                </div>

                {/* Map Legend */}
                <div className="flex gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>In Transit</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span>Delivered</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Alert</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span>Loading</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Shipments</CardTitle>
                <CardDescription>{filteredShipments.length} shipments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {filteredShipments.map((shipment) => (
                  <div
                    key={shipment.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedShipment === shipment.id
                        ? "bg-primary/10 border-primary"
                        : "bg-muted/50 hover:bg-muted/70"
                    }`}
                    onClick={() => setSelectedShipment(shipment.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(shipment.status)}
                        <span className="font-medium text-sm">{shipment.id}</span>
                      </div>
                      <Badge className={`${getStatusColor(shipment.status)} text-xs`}>{shipment.status}</Badge>
                    </div>

                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        <span>{shipment.kegs.length} kegs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{shipment.currentLocation}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowRight className="h-3 w-3" />
                        <span className="truncate">{shipment.destination}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{shipment.timestamp}</span>
                      </div>
                    </div>

                    {/* Keg NFT indicators */}
                    <div className="flex gap-1 mt-2">
                      {shipment.kegs.slice(0, 3).map((keg) => (
                        <Badge key={keg.id} variant={keg.hasNFT ? "default" : "outline"} className="text-xs">
                          {keg.id}
                          {keg.hasNFT && <Link className="h-2 w-2 ml-1" />}
                        </Badge>
                      ))}
                      {shipment.kegs.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{shipment.kegs.length - 3}
                        </Badge>
                      )}
                    </div>

                    {shipment.alerts > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                        <span className="text-xs text-red-500">{shipment.alerts} alert(s)</span>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          {/* List View with detailed shipment cards */}
          <div className="grid gap-4">
            {filteredShipments.map((shipment) => (
              <Card key={shipment.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(shipment.status)}
                      <div>
                        <h3 className="font-semibold">{shipment.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {shipment.driver} • {shipment.vehicle}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(shipment.status)}`}>{shipment.status}</Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="font-medium mb-1">Route</p>
                      <p className="text-sm text-muted-foreground">{shipment.currentLocation}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <ArrowRight className="h-3 w-3" />
                        <span>{shipment.destination}</span>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium mb-1">Kegs & Status</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {shipment.kegs.map((keg) => (
                          <Badge key={keg.id} variant={keg.hasNFT ? "default" : "outline"} className="text-xs">
                            {keg.id}
                            {keg.hasNFT && <Link className="h-2 w-2 ml-1" />}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Thermometer className="h-3 w-3" />
                        <span>{shipment.temperature}</span>
                        <span>•</span>
                        <span>ETA: {shipment.eta}</span>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium mb-1">Progress</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${shipment.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{shipment.progress}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{shipment.timestamp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedShipment && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Existing shipment details */}
          <Card>
            <CardHeader>
              <CardTitle>Shipment Details - {selectedShipment}</CardTitle>
              <CardDescription>Detailed information for the selected shipment</CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const shipment = filteredShipments.find((s) => s.id === selectedShipment)
                if (!shipment) return null

                return (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">Driver</p>
                        <p className="text-sm text-muted-foreground">{shipment.driver}</p>
                      </div>
                      <div>
                        <p className="font-medium">Vehicle</p>
                        <p className="text-sm text-muted-foreground">{shipment.vehicle}</p>
                      </div>
                      <div>
                        <p className="font-medium">Temperature</p>
                        <div className="flex items-center gap-1">
                          <Thermometer className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{shipment.temperature}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">Current Location</p>
                        <p className="text-sm text-muted-foreground">{shipment.currentLocation}</p>
                      </div>
                      <div>
                        <p className="font-medium">Destination</p>
                        <p className="text-sm text-muted-foreground">{shipment.destination}</p>
                      </div>
                      <div>
                        <p className="font-medium">Progress</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${shipment.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{shipment.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>

          {/* NFT Transfer History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                NFT Transfer History
              </CardTitle>
              <CardDescription>Blockchain ownership transfers for in-transit kegs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockNFTTransfers.map((nft) => (
                  <div key={nft.kegId} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span className="font-medium text-sm">{nft.kegId}</span>
                        <Badge variant="outline" className="text-xs">
                          <Link className="h-2 w-2 mr-1" />
                          {nft.nftId}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {nft.transfers.map((transfer, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${transfer.status === "Confirmed" ? "bg-green-500" : "bg-yellow-500"}`}
                            />
                            <span>{transfer.from}</span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span>{transfer.to}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={transfer.status === "Confirmed" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {transfer.status}
                            </Badge>
                            <span className="text-muted-foreground">{transfer.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                      <Link className="h-3 w-3 mr-2" />
                      View on Blockchain
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
