"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface NFTData {
  tokenId: string
  kegId: string
  owner: string
  metadata: {
    contents: string
    location: string
    brewery: string
    capacity: string
    status: string
  }
  transactionHistory: Array<{
    hash: string
    from: string
    to: string
    action: string
    timestamp: string
    blockNumber: number
  }>
}

interface BlockchainContextType {
  isConnected: boolean
  address: string | null
  balance: string
  chainId: number
  nfts: NFTData[]
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  mintNFT: (kegData: any) => Promise<string>
  transferNFT: (tokenId: string, to: string) => Promise<string>
  burnNFT: (tokenId: string) => Promise<string>
  verifyKeg: (kegId: string) => Promise<NFTData | null>
  updateKegStatus: (kegId: string, status: string) => Promise<string>
  getTransactionHistory: (kegId: string) => Array<any>
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined)

// Mock NFT data
const mockNFTs: NFTData[] = [
  {
    tokenId: "1001",
    kegId: "KEG-2024-001",
    owner: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    metadata: {
      contents: "IPA Craft Beer",
      location: "Denver Brewery",
      brewery: "Mountain Peak Brewing",
      capacity: "50L",
      status: "Full",
    },
    transactionHistory: [
      {
        hash: "0x1234567890abcdef1234567890abcdef12345678",
        from: "0x0000000000000000000000000000000000000000",
        to: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
        action: "Mint",
        timestamp: "2024-01-15T10:30:00Z",
        blockNumber: 18500000,
      },
    ],
  },
  {
    tokenId: "1002",
    kegId: "KEG-2024-002",
    owner: "0x8ba1f109551bD432803012645Hac136c0532925a",
    metadata: {
      contents: "Wheat Beer",
      location: "Austin Distribution",
      brewery: "Lone Star Brewing",
      capacity: "30L",
      status: "In Transit",
    },
    transactionHistory: [
      {
        hash: "0xabcdef1234567890abcdef1234567890abcdef12",
        from: "0x0000000000000000000000000000000000000000",
        to: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
        action: "Mint",
        timestamp: "2024-01-14T14:20:00Z",
        blockNumber: 18499500,
      },
      {
        hash: "0xdef1234567890abcdef1234567890abcdef123456",
        from: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
        to: "0x8ba1f109551bD432803012645Hac136c0532925a",
        action: "Transfer",
        timestamp: "2024-01-15T09:15:00Z",
        blockNumber: 18499800,
      },
    ],
  },
]

export function BlockchainProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState("0.0")
  const [chainId, setChainId] = useState(1)
  const [nfts, setNfts] = useState<NFTData[]>(mockNFTs)
  const { toast } = useToast()

  // Load wallet state from localStorage
  useEffect(() => {
    const savedWallet = localStorage.getItem("mockWallet")
    if (savedWallet) {
      const walletData = JSON.parse(savedWallet)
      setIsConnected(walletData.isConnected)
      setAddress(walletData.address)
      setBalance(walletData.balance)
      setChainId(walletData.chainId)
    }
  }, [])

  const connectWallet = async () => {
    try {
      // Mock wallet connection
      const mockAddress = "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4"
      const mockBalance = "2.5"

      setIsConnected(true)
      setAddress(mockAddress)
      setBalance(mockBalance)
      setChainId(1)

      // Save to localStorage
      localStorage.setItem(
        "mockWallet",
        JSON.stringify({
          isConnected: true,
          address: mockAddress,
          balance: mockBalance,
          chainId: 1,
        }),
      )

      toast({
        title: "Wallet Connected",
        description: `Connected to ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress(null)
    setBalance("0.0")
    setChainId(1)
    localStorage.removeItem("mockWallet")

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  const mintNFT = async (kegData: any): Promise<string> => {
    if (!isConnected) {
      throw new Error("Wallet not connected")
    }

    // Mock minting process
    const newTokenId = (Math.floor(Math.random() * 9000) + 1000).toString()
    const txHash = `0x${Math.random().toString(16).substr(2, 40)}`

    const newNFT: NFTData = {
      tokenId: newTokenId,
      kegId: kegData.kegId,
      owner: address!,
      metadata: {
        contents: kegData.contents,
        location: kegData.location,
        brewery: kegData.brewery,
        capacity: kegData.capacity,
        status: kegData.status,
      },
      transactionHistory: [
        {
          hash: txHash,
          from: "0x0000000000000000000000000000000000000000",
          to: address!,
          action: "Mint",
          timestamp: new Date().toISOString(),
          blockNumber: Math.floor(Math.random() * 1000000) + 18500000,
        },
      ],
    }

    setNfts((prev) => [...prev, newNFT])

    toast({
      title: "NFT Minted Successfully",
      description: `Token ID: ${newTokenId} for Keg ${kegData.kegId}`,
    })

    return txHash
  }

  const transferNFT = async (tokenId: string, to: string): Promise<string> => {
    if (!isConnected) {
      throw new Error("Wallet not connected")
    }

    const txHash = `0x${Math.random().toString(16).substr(2, 40)}`

    setNfts((prev) =>
      prev.map((nft) => {
        if (nft.tokenId === tokenId) {
          return {
            ...nft,
            owner: to,
            transactionHistory: [
              ...nft.transactionHistory,
              {
                hash: txHash,
                from: address!,
                to: to,
                action: "Transfer",
                timestamp: new Date().toISOString(),
                blockNumber: Math.floor(Math.random() * 1000000) + 18500000,
              },
            ],
          }
        }
        return nft
      }),
    )

    toast({
      title: "NFT Transferred",
      description: `Token ${tokenId} transferred to ${to.slice(0, 6)}...${to.slice(-4)}`,
    })

    return txHash
  }

  const burnNFT = async (tokenId: string): Promise<string> => {
    if (!isConnected) {
      throw new Error("Wallet not connected")
    }

    const txHash = `0x${Math.random().toString(16).substr(2, 40)}`

    setNfts((prev) => prev.filter((nft) => nft.tokenId !== tokenId))

    toast({
      title: "NFT Burned",
      description: `Token ${tokenId} has been permanently destroyed`,
    })

    return txHash
  }

  const verifyKeg = async (kegId: string): Promise<NFTData | null> => {
    // Mock verification delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const nft = nfts.find((n) => n.kegId === kegId)
    return nft || null
  }

  const updateKegStatus = async (kegId: string, status: string): Promise<string> => {
    if (!isConnected) {
      throw new Error("Wallet not connected")
    }

    const txHash = `0x${Math.random().toString(16).substr(2, 40)}`

    setNfts((prev) =>
      prev.map((nft) => {
        if (nft.kegId === kegId) {
          return {
            ...nft,
            metadata: { ...nft.metadata, status },
            transactionHistory: [
              ...nft.transactionHistory,
              {
                hash: txHash,
                from: address!,
                to: address!,
                action: `Status Update: ${status}`,
                timestamp: new Date().toISOString(),
                blockNumber: Math.floor(Math.random() * 1000000) + 18500000,
              },
            ],
          }
        }
        return nft
      }),
    )

    toast({
      title: "Status Updated",
      description: `Keg ${kegId} status updated to ${status}`,
    })

    return txHash
  }

  const getTransactionHistory = (kegId: string) => {
    const nft = nfts.find((n) => n.kegId === kegId)
    return nft?.transactionHistory || []
  }

  return (
    <BlockchainContext.Provider
      value={{
        isConnected,
        address,
        balance,
        chainId,
        nfts,
        connectWallet,
        disconnectWallet,
        mintNFT,
        transferNFT,
        burnNFT,
        verifyKeg,
        updateKegStatus,
        getTransactionHistory,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  )
}

export const useBlockchain = () => {
  const context = useContext(BlockchainContext)
  if (context === undefined) {
    throw new Error("useBlockchain must be used within a BlockchainProvider")
  }
  return context
}
