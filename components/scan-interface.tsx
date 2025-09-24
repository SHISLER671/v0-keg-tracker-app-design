"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Scanner } from "@yudiel/react-qr-scanner"
import { useBlockchain } from "@/contexts/blockchain-context"
import {
  QrCode,
  Camera,
  Search,
  Package,
  MapPin,
  Clock,
  Thermometer,
  CheckCircle,
  AlertTriangle,
  Truck,
  X,
  Maximize,
  BitcoinIcon as Blockchain,
  Shield,
} from "lucide-react"

const mockKegData = {
  "KT-2847": {
    id: "KT-2847",
    status: "In Transit",
    location: "Highway 101, CA",
    temperature: "38°F",
    lastUpdate: "2 minutes ago",
    destination: "Downtown Brewery",
    estimatedArrival: "2:30 PM",
    driver: "Alex Chen",
    batch: "B-456",
    contents: "IPA - Hoppy Delight",
    volume: "15.5 gallons",
    nft: {
      tokenId: "NFT-2847",
      owner: "Downtown Brewery",
      mintDate: "2024-01-15",
      verified: true,
    },
  },
  "KT-1234": {
    id: "KT-1234",
    status: "Delivered",
    location: "Craft Beer Co.",
    temperature: "37°F",
    lastUpdate: "1 hour ago",
    destination: "Craft Beer Co.",
    estimatedArrival: "Delivered",
    driver: "Sarah Miller",
    batch: "B-455",
    contents: "Lager - Golden Brew",
    volume: "15.5 gallons",
    nft: {
      tokenId: "NFT-1234",
      owner: "Craft Beer Co.",
      mintDate: "2024-01-14",
      verified: true,
    },
  },
  "KT-5678": {
    id: "KT-5678",
    status: "Alert",
    location: "Warehouse A",
    temperature: "45°F",
    lastUpdate: "5 minutes ago",
    destination: "Pending",
    estimatedArrival: "N/A",
    driver: "N/A",
    batch: "B-457",
    contents: "Stout - Dark Roast",
    volume: "15.5 gallons",
    nft: {
      tokenId: "NFT-5678",
      owner: "Brewery Corp",
      mintDate: "2024-01-16",
      verified: true,
    },
  },
}

export function ScanInterface() {
  const [scannedKeg, setScannedKeg] = useState<string>("")
  const [kegData, setKegData] = useState<(typeof mockKegData)[keyof typeof mockKegData] | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const { toast } = useToast()
  const { updateKegStatus, verifyKeg, isConnected } = useBlockchain()

  const handleQrScan = (result: string) => {
    console.log("[v0] QR scan result:", result)

    let kegId = result
    if (result.includes("/keg/")) {
      kegId = result.split("/keg/")[1]
    } else if (result.includes("/nft/")) {
      kegId = result.split("/nft/")[1]
    }

    console.log("[v0] Extracted keg ID:", kegId)

    if (kegId in mockKegData) {
      setScannedKeg(kegId)
      setKegData(mockKegData[kegId as keyof typeof mockKegData])
      setIsScanning(false)
      setIsFullScreen(false)

      toast({
        title: "Keg Scanned Successfully",
        description: `Found keg ${kegId} with NFT ${mockKegData[kegId as keyof typeof mockKegData].nft.tokenId}`,
      })
    } else {
      toast({
        title: "Keg Not Found",
        description: "This QR code doesn't match any keg in our system",
        variant: "destructive",
      })
    }
  }

  const handleScanError = (error: Error) => {
    console.log("[v0] QR scan error:", error)
    toast({
      title: "Scanning Error",
      description: "Unable to access camera. Please check permissions.",
      variant: "destructive",
    })
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!kegData) return

    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to update keg status",
        variant: "destructive",
      })
      return
    }

    try {
      const txHash = await updateKegStatus(kegData.id, newStatus)

      setKegData({
        ...kegData,
        status: newStatus,
        lastUpdate: "Just now",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update keg status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleManualSearch = () => {
    if (scannedKeg in mockKegData) {
      setKegData(mockKegData[scannedKeg as keyof typeof mockKegData])
      toast({
        title: "Keg Found",
        description: `Retrieved data for keg ${scannedKeg}`,
      })
    } else {
      setKegData(null)
      toast({
        title: "Keg Not Found",
        description: "Please check the keg ID and try again",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500"
      case "In Transit":
        return "bg-blue-500"
      case "Alert":
        return "bg-red-500"
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
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Scan & Track</h1>
        <p className="text-muted-foreground">Scan QR codes or search manually to track keg status and location</p>
        {!isConnected && (
          <div className="mt-2">
            <Badge variant="outline" className="text-amber-600 border-amber-600">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Connect wallet to update keg status on blockchain
            </Badge>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code Scanner
            </CardTitle>
            <CardDescription>Scan keg QR codes for instant tracking information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square bg-muted/50 rounded-lg flex items-center justify-center border-2 border-dashed overflow-hidden">
              {isScanning ? (
                <div className="w-full h-full">
                  <Scanner onScan={handleQrScan} onError={handleScanError} style={{ width: "100%", height: "100%" }} />
                </div>
              ) : (
                <div className="text-center">
                  <QrCode className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Camera view will appear here</p>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => setIsScanning(!isScanning)}
                className="flex-1 h-11"
                variant={isScanning ? "destructive" : "default"}
              >
                {isScanning ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Stop Scanning
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Start Scanning
                  </>
                )}
              </Button>
              <Button
                onClick={() => {
                  setIsScanning(true)
                  setIsFullScreen(true)
                }}
                variant="outline"
                size="icon"
                className="h-11 w-11"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="manual-search">Manual Search</Label>
              <div className="flex gap-2">
                <Input
                  id="manual-search"
                  placeholder="Enter keg ID (e.g., KT-2847)"
                  value={scannedKeg}
                  onChange={(e) => setScannedKeg(e.target.value)}
                  className="h-11 text-base"
                />
                <Button onClick={handleManualSearch} variant="outline" className="h-11 px-4 bg-transparent">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Your recently scanned kegs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.values(mockKegData).map((keg) => (
              <div
                key={keg.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => {
                  setScannedKeg(keg.id)
                  setKegData(keg)
                }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(keg.status)}`} />
                  <div>
                    <p className="font-medium text-sm">{keg.id}</p>
                    <p className="text-xs text-muted-foreground">{keg.lastUpdate}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {keg.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {kegData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Keg Details - {kegData.id}
            </CardTitle>
            <CardDescription>Complete tracking information for this keg</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(kegData.status)}
                  <div>
                    <p className="font-medium">Status</p>
                    <Badge className={getStatusColor(kegData.status)}>{kegData.status}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Current Location</p>
                    <p className="text-sm text-muted-foreground">{kegData.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Temperature</p>
                    <p className="text-sm text-muted-foreground">{kegData.temperature}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Destination</p>
                    <p className="text-sm text-muted-foreground">{kegData.destination}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">ETA</p>
                    <p className="text-sm text-muted-foreground">{kegData.estimatedArrival}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Driver</p>
                    <p className="text-sm text-muted-foreground">{kegData.driver}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Blockchain className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">NFT Token</p>
                    <p className="text-sm text-muted-foreground">{kegData.nft.tokenId}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="font-medium">Verification</p>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>

                <div>
                  <p className="font-medium">NFT Owner</p>
                  <p className="text-sm text-muted-foreground">{kegData.nft.owner}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2">Update Status {!isConnected && "(Wallet Required)"}</p>
                <div className="flex flex-wrap gap-2">
                  {kegData.status !== "In Transit" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate("In Transit")}
                      disabled={!isConnected}
                      className="h-10"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Mark In Transit
                    </Button>
                  )}
                  {kegData.status !== "Delivered" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate("Delivered")}
                      disabled={!isConnected}
                      className="h-10"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Delivered
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate("Maintenance")}
                    disabled={!isConnected}
                    className="h-10"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Needs Maintenance
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button className="flex-1 h-11">
                  <MapPin className="h-4 w-4 mr-2" />
                  View on Map
                </Button>
                <Button variant="outline" className="flex-1 h-11 bg-transparent">
                  <Blockchain className="h-4 w-4 mr-2" />
                  View NFT
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
        <DialogContent className="max-w-full h-full p-0 m-0">
          <DialogHeader className="absolute top-4 left-4 right-4 z-10 bg-black/50 rounded-lg p-4">
            <DialogTitle className="text-white">Scan Keg QR Code</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-white hover:bg-white/20"
              onClick={() => {
                setIsFullScreen(false)
                setIsScanning(false)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="w-full h-full">
            <Scanner onScan={handleQrScan} onError={handleScanError} style={{ width: "100%", height: "100%" }} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
