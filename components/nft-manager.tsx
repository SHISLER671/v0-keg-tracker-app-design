"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useBlockchain } from "@/contexts/blockchain-context"
import { useAuth } from "@/contexts/auth-context"
import { Coins, Plus, Eye, Zap, Trash2, Send } from "lucide-react"
import { QRCodeSVG as QRCode } from "qrcode.react"

export function NFTManager() {
  const { nfts, mintNFT, transferNFT, burnNFT, isConnected } = useBlockchain()
  const { user } = useAuth()
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)
  const [isBurning, setIsBurning] = useState(false)
  const [showMintDialog, setShowMintDialog] = useState(false)
  const [showTransferDialog, setShowTransferDialog] = useState(false)
  const [showBurnDialog, setShowBurnDialog] = useState(false)
  const [transferNFTId, setTransferNFTId] = useState<string | null>(null)
  const [burnNFTId, setBurnNFTId] = useState<string | null>(null)

  const [newNFT, setNewNFT] = useState({
    kegId: "",
    contents: "",
    location: "",
    brewery: "",
    capacity: "",
    status: "Full",
  })

  const [transferForm, setTransferForm] = useState({
    recipient: "",
    recipientRole: "",
  })

  const { toast } = useToast()

  const handleCreateNFT = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint NFTs",
        variant: "destructive",
      })
      return
    }

    if (user?.role !== "Admin" && user?.role !== "Brewer") {
      toast({
        title: "Permission Denied",
        description: "Only Admins and Brewers can mint NFTs",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      await mintNFT(newNFT)
      setNewNFT({
        kegId: "",
        contents: "",
        location: "",
        brewery: "",
        capacity: "",
        status: "Full",
      })
      setShowMintDialog(false)
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleTransferNFT = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to transfer NFTs",
        variant: "destructive",
      })
      return
    }

    if (!transferNFTId) return

    setIsTransferring(true)
    try {
      const mockAddresses = {
        Admin: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
        Brewer: "0x8ba1f109551bD432803012645Hac136c0532925a",
        Partner: "0x9cb2f209661cE432903022645Hac136c0532925b",
        Driver: "0xacb3f309771dF532a03032645Hac136c0532925c",
      }

      const recipientAddress =
        mockAddresses[transferForm.recipientRole as keyof typeof mockAddresses] || mockAddresses.Partner

      await transferNFT(transferNFTId, recipientAddress)
      setTransferForm({ recipient: "", recipientRole: "" })
      setShowTransferDialog(false)
      setTransferNFTId(null)
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: "Failed to transfer NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTransferring(false)
    }
  }

  const handleBurnNFT = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to burn NFTs",
        variant: "destructive",
      })
      return
    }

    if (user?.role !== "Admin") {
      toast({
        title: "Permission Denied",
        description: "Only Admins can burn NFTs",
        variant: "destructive",
      })
      return
    }

    if (!burnNFTId) return

    setIsBurning(true)
    try {
      await burnNFT(burnNFTId)
      setShowBurnDialog(false)
      setBurnNFTId(null)
    } catch (error) {
      toast({
        title: "Burn Failed",
        description: "Failed to burn NFT. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsBurning(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Full":
        return "bg-green-500"
      case "In Transit":
        return "bg-blue-500"
      case "Empty":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const canMintNFT = user?.role === "Admin" || user?.role === "Brewer"
  const canBurnNFT = user?.role === "Admin"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NFT Manager</h1>
          <p className="text-muted-foreground">Create, manage, and track blockchain-based keg NFTs</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Zap className="h-3 w-3" />
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          {canMintNFT && (
            <Dialog open={showMintDialog} onOpenChange={setShowMintDialog}>
              <DialogTrigger asChild>
                <Button disabled={!isConnected}>
                  <Plus className="h-4 w-4 mr-2" />
                  Mint New NFT
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Mint New NFT</DialogTitle>
                  <DialogDescription>Create a new NFT for a keg on the blockchain</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="keg-id">Keg ID</Label>
                    <Input
                      id="keg-id"
                      placeholder="e.g., KT-2847"
                      value={newNFT.kegId}
                      onChange={(e) => setNewNFT({ ...newNFT, kegId: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contents">Contents</Label>
                    <Input
                      id="contents"
                      placeholder="e.g., Hoppy Delight IPA"
                      value={newNFT.contents}
                      onChange={(e) => setNewNFT({ ...newNFT, contents: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Warehouse A, Bay 12"
                      value={newNFT.location}
                      onChange={(e) => setNewNFT({ ...newNFT, location: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brewery">Brewery</Label>
                    <Input
                      id="brewery"
                      placeholder="e.g., Mountain Peak Brewing"
                      value={newNFT.brewery}
                      onChange={(e) => setNewNFT({ ...newNFT, brewery: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      placeholder="e.g., 50L"
                      value={newNFT.capacity}
                      onChange={(e) => setNewNFT({ ...newNFT, capacity: e.target.value })}
                    />
                  </div>

                  <Button onClick={handleCreateNFT} disabled={isCreating} className="w-full">
                    {isCreating ? (
                      <>
                        <Zap className="mr-2 h-4 w-4 animate-spin" />
                        Minting on Blockchain...
                      </>
                    ) : (
                      <>
                        <Coins className="mr-2 h-4 w-4" />
                        Mint NFT
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            NFT Collection
          </CardTitle>
          <CardDescription>Manage your minted keg NFTs ({nfts.length} total)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token ID</TableHead>
                  <TableHead>Keg ID</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Contents</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>QR Code</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nfts.map((nft) => (
                  <TableRow key={nft.tokenId}>
                    <TableCell className="font-mono text-xs">{nft.tokenId.slice(0, 8)}...</TableCell>
                    <TableCell className="font-medium">{nft.kegId}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
                        </div>
                        <div className="text-xs text-muted-foreground">Wallet Address</div>
                      </div>
                    </TableCell>
                    <TableCell>{nft.metadata.contents}</TableCell>
                    <TableCell className="text-sm">{nft.metadata.location}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(nft.metadata.status)} text-xs`}>{nft.metadata.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center p-2 bg-white rounded border">
                        <QRCode value={`https://kegtracker.app/nft/${nft.kegId}`} size={40} level="M" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Dialog
                          open={showTransferDialog && transferNFTId === nft.tokenId}
                          onOpenChange={(open) => {
                            setShowTransferDialog(open)
                            if (!open) setTransferNFTId(null)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setTransferNFTId(nft.tokenId)}
                              disabled={!isConnected}
                            >
                              <Send className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Transfer NFT</DialogTitle>
                              <DialogDescription>Transfer NFT {nft.kegId} to another party</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="recipient">Recipient</Label>
                                <Input
                                  id="recipient"
                                  placeholder="Enter recipient name"
                                  value={transferForm.recipient}
                                  onChange={(e) => setTransferForm({ ...transferForm, recipient: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="recipient-role">Recipient Role</Label>
                                <Select
                                  value={transferForm.recipientRole}
                                  onValueChange={(value) => setTransferForm({ ...transferForm, recipientRole: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Brewer">Brewer</SelectItem>
                                    <SelectItem value="Partner">Partner</SelectItem>
                                    <SelectItem value="Driver">Driver</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button onClick={handleTransferNFT} disabled={isTransferring} className="w-full">
                                {isTransferring ? (
                                  <>
                                    <Zap className="mr-2 h-4 w-4 animate-spin" />
                                    Transferring...
                                  </>
                                ) : (
                                  <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Transfer NFT
                                  </>
                                )}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {canBurnNFT && (
                          <Dialog
                            open={showBurnDialog && burnNFTId === nft.tokenId}
                            onOpenChange={(open) => {
                              setShowBurnDialog(open)
                              if (!open) setBurnNFTId(null)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setBurnNFTId(nft.tokenId)}
                                disabled={!isConnected}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Burn NFT</DialogTitle>
                                <DialogDescription>
                                  Permanently remove NFT {nft.kegId} from the blockchain. This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                  <p className="text-sm text-destructive">
                                    Warning: This will permanently destroy the NFT and remove it from the blockchain.
                                    This is typically done when a keg is retired or decommissioned.
                                  </p>
                                </div>
                                <Button
                                  onClick={handleBurnNFT}
                                  disabled={isBurning}
                                  variant="destructive"
                                  className="w-full"
                                >
                                  {isBurning ? (
                                    <>
                                      <Zap className="mr-2 h-4 w-4 animate-spin" />
                                      Burning NFT...
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Burn NFT
                                    </>
                                  )}
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="lg:hidden space-y-4">
            {nfts.map((nft) => (
              <Card key={nft.tokenId} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    <span className="font-medium text-sm">{nft.kegId}</span>
                  </div>
                  <Badge className={`${getStatusColor(nft.metadata.status)} text-xs`}>{nft.metadata.status}</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Token ID:</span>
                    <span className="font-mono text-xs">{nft.tokenId.slice(0, 8)}...</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Owner:</span>
                    <span className="font-mono text-xs">
                      {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Contents:</span>
                    <span className="text-right truncate max-w-[150px]">{nft.metadata.contents}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-right truncate max-w-[150px]">{nft.metadata.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center justify-center p-2 bg-white rounded border">
                    <QRCode value={`https://kegtracker.app/nft/${nft.kegId}`} size={32} level="M" />
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Dialog
                      open={showTransferDialog && transferNFTId === nft.tokenId}
                      onOpenChange={(open) => {
                        setShowTransferDialog(open)
                        if (!open) setTransferNFTId(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTransferNFTId(nft.tokenId)}
                          disabled={!isConnected}
                        >
                          <Send className="h-3 w-3" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Transfer NFT</DialogTitle>
                          <DialogDescription>Transfer NFT {nft.kegId} to another party</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="recipient">Recipient</Label>
                            <Input
                              id="recipient"
                              placeholder="Enter recipient name"
                              value={transferForm.recipient}
                              onChange={(e) => setTransferForm({ ...transferForm, recipient: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="recipient-role">Recipient Role</Label>
                            <Select
                              value={transferForm.recipientRole}
                              onValueChange={(value) => setTransferForm({ ...transferForm, recipientRole: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="Brewer">Brewer</SelectItem>
                                <SelectItem value="Partner">Partner</SelectItem>
                                <SelectItem value="Driver">Driver</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleTransferNFT} disabled={isTransferring} className="w-full">
                            {isTransferring ? (
                              <>
                                <Zap className="mr-2 h-4 w-4 animate-spin" />
                                Transferring...
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Transfer NFT
                              </>
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {canBurnNFT && (
                      <Dialog
                        open={showBurnDialog && burnNFTId === nft.tokenId}
                        onOpenChange={(open) => {
                          setShowBurnDialog(open)
                          if (!open) setBurnNFTId(null)
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setBurnNFTId(nft.tokenId)}
                            disabled={!isConnected}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Burn NFT</DialogTitle>
                            <DialogDescription>
                              Permanently remove NFT {nft.kegId} from the blockchain. This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                              <p className="text-sm text-destructive">
                                Warning: This will permanently destroy the NFT and remove it from the blockchain. This
                                is typically done when a keg is retired or decommissioned.
                              </p>
                            </div>
                            <Button
                              onClick={handleBurnNFT}
                              disabled={isBurning}
                              variant="destructive"
                              className="w-full"
                            >
                              {isBurning ? (
                                <>
                                  <Zap className="mr-2 h-4 w-4 animate-spin" />
                                  Burning NFT...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Burn NFT
                                </>
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Coins className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Blockchain NFT Ownership</h3>
              <p className="text-sm text-blue-700">
                Partners can transfer NFT ownership for kegs through the blockchain, ensuring transparent and immutable
                records of keg custody throughout the supply chain. Each transfer is recorded permanently on the
                Ethereum network with full traceability.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
