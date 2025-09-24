import { createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { injected, metaMask, walletConnect } from "wagmi/connectors"

// Mock configuration for development
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected(), metaMask(), walletConnect({ projectId: "mock-project-id" })],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
