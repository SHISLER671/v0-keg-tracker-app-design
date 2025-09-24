"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  MapPin,
  Calendar,
  Thermometer,
  BarChart3,
  ExternalLink,
  CheckCircle,
} from "lucide-react"
import { QRCodeSVG as QRCode } from "qrcode.react"

const mockKegs = [
  {
    id: "KT-2847",
    serial: "SN-847291",
    beerType: "IPA - Hoppy Delight",
    contents: "Hoppy Delight IPA",
    volume: "15.5 gallons",
    abv: "6.2%",
    batch: "B-456",
    status: "In Use",
    fillStatus: "Full",
    location: "Highway 101, CA",
    temperature: "38°F",
    createdDate: "2024-01-15",
    lastUpdate: "2 minutes ago",
    lastAction: "Shipped to Downtown Bar",
    owner: "Downtown Brewery",
    nftMinted: true,
    blockchainVerified: true,
    category: "in-use",
  },
  {
    id: "KT-1234",
    serial: "SN-123456",
    beerType: "Lager - Golden Brew",
    contents: "Golden Brew Lager",
    volume: "15.5 gallons",
    abv: "4.8%",
    batch: "B-455",
    status: "Available",
    fillStatus: "Empty",
    location: "Craft Beer Co.",
    temperature: "37°F",
    createdDate: "2024-01-10",
    lastUpdate: "1 hour ago",
    lastAction: "Returned from customer",
    owner: "Craft Beer Co.",
    nftMinted: true,
    blockchainVerified: true,
    category: "available",
  },
  {
    id: "KT-5678",
    serial: "SN-567890",
    beerType: "Stout - Dark Roast",
    contents: "Dark Roast Stout",
    volume: "15.5 gallons",
    abv: "7.1%",
    batch: "B-457",
    status: "Maintenance",
    fillStatus: "Empty",
    location: "Warehouse A",
    temperature: "45°F",
    createdDate: "2024-01-20",
    lastUpdate: "5 minutes ago",
    lastAction: "Scheduled for cleaning",
    owner: "Artisan Brewery",
    nftMinted: true,
    blockchainVerified: false,
    category: "maintenance",
  },
  {
    id: "KT-3456",
    serial: "SN-345678",
    beerType: "Wheat Beer - Summer Breeze",
    contents: "Summer Breeze Wheat",
    volume: "15.5 gallons",
    abv: "5.4%",
    batch: "B-458",
    status: "In Use",
    fillStatus: "Full",
    location: "Production Line 2",
    temperature: "34°F",
    createdDate: "2024-01-21",
    lastUpdate: "30 minutes ago",
    lastAction: "Filled and sealed",
    owner: "Suburban Taphouse",
    nftMinted: false,
    blockchainVerified: false,
    category: "in-use",
  },
  {
    id: "KT-7890",
    serial: "SN-789012",
    beerType: "Pilsner - Crystal Clear",
    contents: "Crystal Clear Pilsner",
    volume: "15.5 gallons",
    abv: "4.9%",
    batch: "B-459",
    status: "Available",
    fillStatus: "Full",
    location: "Cold Storage B",
    temperature: "35°F",
    createdDate: "2024-01-19",
    lastUpdate: "2 hours ago",
    lastAction: "Quality check passed",
    owner: "Metro Brewery",
    nftMinted: false,
    blockchainVerified: true,
    category: "available",
  },
]

export function KegManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  const getFilteredKegs = (category: string) => {
    let kegs = mockKegs

    if (category !== "all") {
      kegs = kegs.filter((keg) => keg.category === category)
    }

    return kegs.filter((keg) => {
      const matchesSearch =
        searchQuery === "" ||
        keg.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        keg.beerType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        keg.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
        keg.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        keg.serial.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || keg.status.toLowerCase() === statusFilter

      return matchesSearch && matchesStatus
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-500"
      case "In Use":
        return "bg-blue-500"
      case "Maintenance":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getFillStatusColor = (fillStatus: string) => {
    return fillStatus === "Full" ? "bg-blue-500" : "bg-gray-500"
  }

  const handleKegAction = (action: string, kegId: string) => {
    toast({
      title: `${action} Action`,
      description: `${action} performed on keg ${kegId}`,
    })
  }

  const handleViewOnBlockchain = (kegId: string) => {
    toast({
      title: "Opening Blockchain Explorer",
      description: `Viewing NFT for keg ${kegId} on blockchain`,
    })
  }

  const tabCounts = {
    all: mockKegs.length,
    "in-use": mockKegs.filter((k) => k.category === "in-use").length,
    available: mockKegs.filter((k) => k.category === "available").length,
    maintenance: mockKegs.filter((k) => k.category === "maintenance").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Keg Management</h1>
          <p className="text-muted-foreground">Manage your keg inventory and track their lifecycle</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Keg
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kegs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKegs.length}</div>
            <p className="text-xs text-muted-foreground">Active inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Use</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tabCounts["in-use"]}</div>
            <p className="text-xs text-muted-foreground">Currently deployed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tabCounts.available}</div>
            <p className="text-xs text-muted-foreground">Ready for use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tabCounts.maintenance}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NFT Minted</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKegs.filter((k) => k.nftMinted).length}</div>
            <p className="text-xs text-muted-foreground">Blockchain verified</p>
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
                  placeholder="Search by keg ID, serial, beer type, batch, or owner..."
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
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="in use">In Use</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Kegs ({tabCounts.all})</TabsTrigger>
          <TabsTrigger value="in-use">In Use ({tabCounts["in-use"]})</TabsTrigger>
          <TabsTrigger value="available">Available ({tabCounts.available})</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance ({tabCounts.maintenance})</TabsTrigger>
        </TabsList>

        {["all", "in-use", "available", "maintenance"].map((category) => (
          <TabsContent key={category} value={category} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {getFilteredKegs(category).map((keg) => (
                <Card key={keg.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{keg.id}</CardTitle>
                        <p className="text-sm text-muted-foreground">Serial: {keg.serial}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          {keg.blockchainVerified && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {keg.nftMinted && (
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                              NFT
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(keg.status)} text-xs`}>{keg.status}</Badge>
                          <Badge className={`${getFillStatusColor(keg.fillStatus)} text-xs`}>{keg.fillStatus}</Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription>{keg.contents}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="grid grid-cols-2 gap-4 text-sm flex-1">
                        <div>
                          <p className="text-muted-foreground">Volume</p>
                          <p className="font-medium">{keg.volume}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">ABV</p>
                          <p className="font-medium">{keg.abv}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Batch</p>
                          <p className="font-medium">{keg.batch}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Temperature</p>
                          <p className="font-medium">{keg.temperature}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <QRCode
                          value={`https://kegtracker.app/nft/${keg.id}`}
                          size={80}
                          level="M"
                          includeMargin={true}
                        />
                        <p className="text-xs text-muted-foreground">QR Code</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Location:</span>
                        <span>{keg.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Last Action:</span>
                        <span>{keg.lastAction}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Owner:</span>
                        <span>{keg.owner}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => handleKegAction("View", keg.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => handleKegAction("Edit", keg.id)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>

                    {keg.nftMinted && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                        onClick={() => handleViewOnBlockchain(keg.id)}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Blockchain
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
