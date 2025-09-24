"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Plus,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Building,
  TrendingUp,
  Star,
  Eye,
  MessageCircle,
  Truck,
  Info,
} from "lucide-react"

const mockPartners = [
  {
    id: "PT-001",
    name: "Downtown Brewery",
    type: "Distributor",
    status: "Active",
    location: "123 Main St, San Francisco, CA 94102",
    contact: {
      name: "John Smith",
      email: "john@downtownbrewery.com",
      phone: "+1 (555) 123-4567",
    },
    joinDate: "2023-06-15",
    totalOrders: 247,
    monthlyOrders: 23,
    kegsDelivered: 1247,
    rating: 4.8,
    lastOrder: "2024-01-19",
    specialties: ["IPA", "Stout", "Lager"],
    contractType: "Premium",
  },
  {
    id: "PT-002",
    name: "Craft Beer Co.",
    type: "Distributor",
    status: "Active",
    location: "456 Oak Ave, Oakland, CA 94607",
    contact: {
      name: "Sarah Johnson",
      email: "sarah@craftbeerco.com",
      phone: "+1 (555) 234-5678",
    },
    joinDate: "2023-03-22",
    totalOrders: 189,
    monthlyOrders: 18,
    kegsDelivered: 892,
    rating: 4.6,
    lastOrder: "2024-01-20",
    specialties: ["Craft Beer", "Seasonal"],
    contractType: "Standard",
  },
  {
    id: "PT-003",
    name: "The Rusty Anchor",
    type: "Restaurant",
    status: "Active",
    location: "789 Pine St, Berkeley, CA 94704",
    contact: {
      name: "Mike Wilson",
      email: "mike@rustyanchor.com",
      phone: "+1 (555) 345-6789",
    },
    joinDate: "2023-08-10",
    totalOrders: 156,
    monthlyOrders: 15,
    kegsDelivered: 634,
    rating: 4.7,
    lastOrder: "2024-01-18",
    specialties: ["Wheat Beer", "Pilsner"],
    contractType: "Standard",
  },
  {
    id: "PT-004",
    name: "Neon Nights Bar",
    type: "Bar",
    status: "Active",
    location: "321 Elm St, San Jose, CA 95112",
    contact: {
      name: "Emma Davis",
      email: "emma@neonnights.com",
      phone: "+1 (555) 456-7890",
    },
    joinDate: "2023-11-05",
    totalOrders: 89,
    monthlyOrders: 12,
    kegsDelivered: 423,
    rating: 4.5,
    lastOrder: "2024-01-21",
    specialties: ["Seasonal", "Local Brews"],
    contractType: "Basic",
  },
  {
    id: "PT-005",
    name: "Corner Market",
    type: "Retailer",
    status: "Active",
    location: "654 Maple Dr, Fremont, CA 94536",
    contact: {
      name: "David Brown",
      email: "david@cornermarket.com",
      phone: "+1 (555) 567-8901",
    },
    joinDate: "2024-01-15",
    totalOrders: 45,
    monthlyOrders: 8,
    kegsDelivered: 178,
    rating: 4.3,
    lastOrder: "2024-01-22",
    specialties: ["Organic", "Gluten-Free"],
    contractType: "Standard",
  },
  {
    id: "PT-006",
    name: "Sunset Grill",
    type: "Restaurant",
    status: "Active",
    location: "987 Beach Blvd, Santa Cruz, CA 95060",
    contact: {
      name: "Lisa Chen",
      email: "lisa@sunsetgrill.com",
      phone: "+1 (555) 678-9012",
    },
    joinDate: "2023-09-12",
    totalOrders: 134,
    monthlyOrders: 14,
    kegsDelivered: 567,
    rating: 4.9,
    lastOrder: "2024-01-20",
    specialties: ["Craft Lagers", "Seasonal"],
    contractType: "Premium",
  },
]

export function PartnerManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null)
  const { toast } = useToast()

  const getFilteredPartners = (tabFilter: string) => {
    return mockPartners.filter((partner) => {
      const matchesSearch =
        searchQuery === "" ||
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTab = tabFilter === "all" || partner.type.toLowerCase() === tabFilter.toLowerCase()
      const matchesStatus = statusFilter === "all" || partner.status.toLowerCase() === statusFilter

      return matchesSearch && matchesTab && matchesStatus
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500"
      case "Pending":
        return "bg-yellow-500"
      case "Inactive":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getContractColor = (contractType: string) => {
    switch (contractType) {
      case "Premium":
        return "bg-purple-500"
      case "Standard":
        return "bg-blue-500"
      case "Basic":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const handlePartnerAction = (action: string, partnerId: string) => {
    toast({
      title: `${action} Action`,
      description: `${action} performed on partner ${partnerId}`,
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partner Management</h1>
          <p className="text-muted-foreground">Manage your brewery partners, distributors, and customers</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Partner
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">All partnerships</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">298</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-muted-foreground">Partner satisfaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+8.2%</div>
            <p className="text-xs text-muted-foreground">New partners this month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100">Blockchain Integration</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Partners can transfer NFT ownership for kegs through our blockchain verification system. All transfers
                are recorded on-chain for complete transparency and authenticity.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  placeholder="Search by partner name, contact, or location..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="distributors">Distributors</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          <TabsTrigger value="bars">Bars</TabsTrigger>
          <TabsTrigger value="retailers">Retailers</TabsTrigger>
        </TabsList>

        {["all", "distributors", "restaurants", "bars", "retailers"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {getFilteredPartners(
                tab === "distributors" ? "distributor" : tab === "all" ? "all" : tab.slice(0, -1),
              ).map((partner) => (
                <Card key={partner.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{partner.name}</CardTitle>
                        <CardDescription>{partner.type}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getContractColor(partner.contractType)} text-xs`}>
                          {partner.contractType}
                        </Badge>
                        <Badge className={`${getStatusColor(partner.status)} text-xs`}>{partner.status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{partner.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{partner.contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{partner.contact.phone}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Kegs Delivered</p>
                        <p className="font-medium flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          {partner.kegsDelivered.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">This Month</p>
                        <p className="font-medium">{partner.monthlyOrders}</p>
                      </div>
                    </div>

                    {partner.rating > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(partner.rating)}</div>
                        <span className="text-sm text-muted-foreground">({partner.rating})</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Specialties</p>
                      <div className="flex flex-wrap gap-1">
                        {partner.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => handlePartnerAction("View Details", partner.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => handlePartnerAction("Contact", partner.id)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
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
