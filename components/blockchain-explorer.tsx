"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Hash, Package, Zap, ExternalLink, Activity, Coins, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const mockTransactions = [
  {
    hash: "0x8f7e6d5c4b3a2918f7e6d5c4b3a29187f6e5d4c3b2a1",
    type: "NFT Mint",
    kegId: "KT-2847",
    from: "0x0000000000000000000000000000000000000000",
    to: "0x742d35Cc6634C0532925a3b8D404fddF4b34c451",
    timestamp: "2024-01-15T10:30:00Z",
    gasUsed: "0.0045 ETH",
    status: "Success",
    blockNumber: 18945672,
  },
  {
    hash: "0x9g8f7e6d5c4b3a2918f7e6d5c4b3a29187f6e5d4c3",
    type: "Transfer",
    kegId: "KT-2847",
    from: "0x742d35Cc6634C0532925a3b8D404fddF4b34c451",
    to: "0x8ba1f109551bD432803012645Hac136c30C6213",
    timestamp: "2024-01-16T14:20:00Z",
    gasUsed: "0.0021 ETH",
    status: "Success",
    blockNumber: 18946891,
  },
  {
    hash: "0xa1b2c3d4e5f6789012345678901234567890abcd",
    type: "NFT Mint",
    kegId: "KT-1234",
    from: "0x0000000000000000000000000000000000000000",
    to: "0x9cb2f210662cE543904023756Ibd247d41D7324",
    timestamp: "2024-01-10T08:45:00Z",
    gasUsed: "0.0048 ETH",
    status: "Success",
    blockNumber: 18943210,
  },
  {
    hash: "0xb2c3d4e5f6789012345678901234567890abcdef",
    type: "Quality Check",
    kegId: "KT-1234",
    from: "0x9cb2f210662cE543904023756Ibd247d41D7324",
    to: "0x9cb2f210662cE543904023756Ibd247d41D7324",
    timestamp: "2024-01-11T16:30:00Z",
    gasUsed: "0.0015 ETH",
    status: "Success",
    blockNumber: 18944567,
  },
  {
    hash: "0xc3d4e5f6789012345678901234567890abcdef12",
    type: "Transfer",
    kegId: "KT-5678",
    from: "0xa1b2c3d4e5f6789012345678901234567890abcd",
    to: "0xb2c3d4e5f6789012345678901234567890abcdef",
    timestamp: "2024-01-20T11:15:00Z",
    gasUsed: "0.0019 ETH",
    status: "Failed",
    blockNumber: 18948123,
  },
]

const mockBlocks = [
  {
    number: 18948123,
    hash: "0xd4e5f6789012345678901234567890abcdef123456",
    timestamp: "2024-01-20T11:15:00Z",
    transactions: 247,
    gasUsed: "12.45 ETH",
    miner: "0xe5f6789012345678901234567890abcdef1234567",
  },
  {
    number: 18946891,
    hash: "0xe5f6789012345678901234567890abcdef1234567",
    timestamp: "2024-01-16T14:20:00Z",
    transactions: 189,
    gasUsed: "9.87 ETH",
    miner: "0xf6789012345678901234567890abcdef12345678",
  },
  {
    number: 18945672,
    hash: "0xf6789012345678901234567890abcdef12345678",
    timestamp: "2024-01-15T10:30:00Z",
    transactions: 203,
    gasUsed: "11.23 ETH",
    miner: "0x789012345678901234567890abcdef123456789",
  },
]

export function BlockchainExplorer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [transactionFilter, setTransactionFilter] = useState("all")
  const { toast } = useToast()

  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesFilter = transactionFilter === "all" || tx.type.toLowerCase().includes(transactionFilter)
    const matchesSearch =
      searchQuery === "" ||
      tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.kegId.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: string) => {
    return status === "Success" ? "bg-green-500" : "bg-red-500"
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "NFT Mint":
        return <Coins className="h-4 w-4" />
      case "Transfer":
        return <Package className="h-4 w-4" />
      case "Quality Check":
        return <Activity className="h-4 w-4" />
      default:
        return <Hash className="h-4 w-4" />
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Transaction hash copied successfully",
    })
  }

  const openExternalExplorer = (txHash: string) => {
    toast({
      title: "External Explorer",
      description: `Opening transaction ${txHash.slice(0, 10)}... in Etherscan (mock)`,
    })
    // In real implementation: window.open(`https://etherscan.io/tx/${txHash}`, '_blank')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blockchain Explorer</h1>
        <p className="text-muted-foreground">Explore transactions, blocks, and smart contract interactions</p>
      </div>

      {/* Network Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Block</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18,948,123</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+1</span> new block
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+23</span> today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NFTs Minted</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-purple-600">+3</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gas Price</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25 Gwei</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-5%</span> from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Transaction Search
          </CardTitle>
          <CardDescription>Search by transaction hash or keg ID</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter transaction hash or keg ID (e.g., 0x8f7e6d5c... or KT-2847)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={transactionFilter} onValueChange={setTransactionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="mint">NFT Mint</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="quality">Quality Check</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Recent Transactions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription>{filteredTransactions.length} transactions found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="hidden lg:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tx Hash</TableHead>
                    <TableHead>From/To</TableHead>
                    <TableHead>Keg ID</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.hash}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(tx.hash)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div className="font-mono">
                            From: {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                          </div>
                          <div className="font-mono">
                            To: {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {tx.kegId}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(tx.type)}
                          <span className="text-sm">{tx.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(tx.timestamp).toLocaleDateString()} <br />
                        <span className="text-xs text-muted-foreground">
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(tx.status)} text-xs`}>{tx.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openExternalExplorer(tx.hash)}
                          className="text-xs"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Etherscan
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="lg:hidden space-y-4">
              {filteredTransactions.map((tx) => (
                <Card key={tx.hash} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(tx.type)}
                      <span className="font-medium text-sm">{tx.type}</span>
                    </div>
                    <Badge className={`${getStatusColor(tx.status)} text-xs`}>{tx.status}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Hash:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xs">
                          {tx.hash.slice(0, 8)}...{tx.hash.slice(-4)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(tx.hash)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Keg ID:</span>
                      <Badge variant="outline" className="text-xs">
                        {tx.kegId}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">From:</span>
                      <span className="font-mono text-xs">
                        {tx.from.slice(0, 6)}...{tx.from.slice(-4)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">To:</span>
                      <span className="font-mono text-xs">
                        {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="text-xs">{new Date(tx.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openExternalExplorer(tx.hash)}
                      className="w-full text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View on Etherscan
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Blocks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Recent Blocks
            </CardTitle>
            <CardDescription>Latest mined blocks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockBlocks.map((block) => (
              <div key={block.number} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">Block #{block.number}</span>
                  <Badge variant="outline" className="text-xs">
                    {block.transactions} txs
                  </Badge>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Hash:</span>
                    <span className="font-mono">{block.hash.slice(0, 12)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gas Used:</span>
                    <span>{block.gasUsed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>{new Date(block.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full mt-3 text-xs bg-transparent">
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Block
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
