"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Scanner } from "@yudiel/react-qr-scanner"
import { useBlockchain } from "@/contexts/blockchain-context"
import {
  Shield,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Hash,
  Calendar,
  User,
  Package,
  Zap,
  ExternalLink,
  QrCode,
  Camera,
} from "lucide-react"

export function VerificationInterface() {
  const [kegId, setKegId] = useState("")
  const [verificationResult, setVerificationResult] = useState<any | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const { toast } = useToast()
  const { verifyKeg, isConnected } = useBlockchain()

  const handleVerify = async () => {
    if (!kegId.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a keg ID to verify",
        variant: "destructive",
      })
      return
    }

    setIsVerifying(true)

    try {
      const result = await verifyKeg(kegId)

      if (result) {
        setVerificationResult({
          kegId: result.kegId,
          isVerified: true,
          nftTokenId: result.tokenId,
          blockchainHash: result.transactionHistory[0]?.hash,
          verificationDate: result.transactionHistory[0]?.timestamp,
          creator: result.metadata.brewery,
          owner: result.owner,
          authenticity: "Verified",
          tamperProof: true,
          chainOfCustody: result.transactionHistory.map((tx) => ({
            timestamp: tx.timestamp,
            action: tx.action,
            party: tx.action === "Mint" ? result.metadata.brewery : "Transfer Party",
          })),
        })

        toast({
          title: "Verification Successful",
          description: `Keg ${kegId} is authentic and verified on blockchain`,
        })
      } else {
        setVerificationResult({
          kegId,
          isVerified: false,
          nftTokenId: null,
          blockchainHash: null,
          verificationDate: null,
          creator: "Unknown",
          owner: "Unknown",
          authenticity: "Not Found",
          tamperProof: false,
          chainOfCustody: [],
        })

        toast({
          title: "Verification Failed",
          description: `Keg ${kegId} could not be verified`,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Failed to verify keg. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleQrScan = (result: string) => {
    const kegIdMatch = result.match(/\/nft\/(.+)$/) || result.match(/KT-\d+/)
    if (kegIdMatch) {
      const extractedKegId = kegIdMatch[1] || kegIdMatch[0]
      setKegId(extractedKegId)
      setShowScanner(false)
      toast({
        title: "QR Code Scanned",
        description: `Keg ID ${extractedKegId} detected`,
      })
    } else {
      toast({
        title: "Invalid QR Code",
        description: "QR code does not contain a valid keg ID",
        variant: "destructive",
      })
    }
  }

  const handleScanError = (error: Error) => {
    console.error("QR Scanner Error:", error)
    toast({
      title: "Scanner Error",
      description: "Unable to access camera. Please check permissions.",
      variant: "destructive",
    })
  }

  const getVerificationIcon = (isVerified: boolean) => {
    return isVerified ? (
      <CheckCircle className="h-6 w-6 text-green-500" />
    ) : (
      <XCircle className="h-6 w-6 text-red-500" />
    )
  }

  const getVerificationColor = (isVerified: boolean) => {
    return isVerified ? "bg-green-500" : "bg-red-500"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blockchain Verification</h1>
        <p className="text-muted-foreground">
          Verify the authenticity and provenance of kegs using blockchain technology
        </p>
        {!isConnected && (
          <div className="mt-2">
            <Badge variant="outline" className="text-amber-600 border-amber-600">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Wallet not connected - Connect wallet for full verification
            </Badge>
          </div>
        )}
      </div>

      {/* Verification Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Verify Keg Authenticity
          </CardTitle>
          <CardDescription>Enter a keg ID manually or scan a QR code to verify blockchain record</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Manual Input
              </TabsTrigger>
              <TabsTrigger value="scan" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Scan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="keg-id">Keg ID</Label>
                  <Input
                    id="keg-id"
                    placeholder="Enter keg ID (e.g., KT-2847)"
                    value={kegId}
                    onChange={(e) => setKegId(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleVerify()}
                    className="h-11 text-base"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleVerify} disabled={isVerifying} className="w-full sm:w-auto h-11">
                    {isVerifying ? (
                      <>
                        <Zap className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Verify
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="scan" className="space-y-4">
              <div className="space-y-4">
                {!showScanner ? (
                  <div className="text-center py-8">
                    <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Click the button below to start scanning QR codes</p>
                    <Button onClick={() => setShowScanner(true)} className="h-11">
                      <Camera className="mr-2 h-4 w-4" />
                      Start Camera
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <Scanner
                        onScan={handleQrScan}
                        onError={handleScanError}
                        style={{
                          width: "100%",
                          maxWidth: "400px",
                          margin: "0 auto",
                        }}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button variant="outline" onClick={() => setShowScanner(false)} className="h-11">
                        Stop Camera
                      </Button>
                      {kegId && (
                        <Button onClick={handleVerify} disabled={isVerifying} className="h-11">
                          {isVerifying ? (
                            <>
                              <Zap className="mr-2 h-4 w-4 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <Search className="mr-2 h-4 w-4" />
                              Verify {kegId}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-sm text-muted-foreground">
            <p>Try these sample IDs: KT-2847, KT-1234, KT-FAKE</p>
          </div>
        </CardContent>
      </Card>

      {/* Verification Results */}
      {verificationResult && (
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getVerificationIcon(verificationResult.isVerified)}
                Verification Status
                {verificationResult.isVerified && <CheckCircle className="h-6 w-6 text-green-500 ml-auto" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold mb-1">
                    {verificationResult.isVerified ? (
                      <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-500 mx-auto" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Authenticity</div>
                  <Badge className={`${getVerificationColor(verificationResult.isVerified)} mt-1`}>
                    {verificationResult.authenticity}
                  </Badge>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold mb-1">
                    {verificationResult.tamperProof ? (
                      <Shield className="h-8 w-8 text-green-500 mx-auto" />
                    ) : (
                      <AlertTriangle className="h-8 w-8 text-red-500 mx-auto" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">Tamper Proof</div>
                  <Badge className={`${verificationResult.tamperProof ? "bg-green-500" : "bg-red-500"} mt-1`}>
                    {verificationResult.tamperProof ? "Secure" : "Compromised"}
                  </Badge>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold mb-1">
                    <Package className="h-8 w-8 text-blue-500 mx-auto" />
                  </div>
                  <div className="text-sm text-muted-foreground">Keg ID</div>
                  <div className="font-mono text-sm mt-1">{verificationResult.kegId}</div>
                </div>

                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold mb-1">
                    <Zap className="h-8 w-8 text-purple-500 mx-auto" />
                  </div>
                  <div className="text-sm text-muted-foreground">Blockchain</div>
                  <Badge variant="outline" className="mt-1">
                    Ethereum
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Information */}
          {verificationResult.isVerified && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Details</CardTitle>
                  <CardDescription>On-chain verification information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">NFT Token ID</p>
                      <p className="text-xs text-muted-foreground font-mono">{verificationResult.nftTokenId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Transaction Hash</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {verificationResult.blockchainHash?.slice(0, 20)}...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Creator</p>
                      <p className="text-xs text-muted-foreground">{verificationResult.creator}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Verification Date</p>
                      <p className="text-xs text-muted-foreground">
                        {verificationResult.verificationDate
                          ? new Date(verificationResult.verificationDate).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <Button className="w-full bg-transparent" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Etherscan
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Chain of Custody</CardTitle>
                  <CardDescription>Complete ownership and transfer history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {verificationResult.chainOfCustody.map((event, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{event.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(event.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">{event.party}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
