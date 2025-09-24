export async function POST(req: Request) {
  try {
    const { messages, role } = await req.json()
    const lastMessage = messages[messages.length - 1]?.content || ""

    // Try Flowise endpoint first (placeholder)
    try {
      const flowiseResponse = await fetch("https://your-flowise.vercel.app/api/v1/prediction/your-chatflow-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: lastMessage,
          role: role,
        }),
      })

      if (flowiseResponse.ok) {
        const data = await flowiseResponse.json()
        return new Response(data.text || "No response from Flowise")
      }
    } catch (error) {
      console.log("[v0] Flowise endpoint failed, using mock responses")
    }

    // Mock responses based on role and question content
    const mockResponses = {
      admin: {
        mint: 'As an Admin, you can mint new NFTs by going to NFT Manager → Mint New NFT. Fill in the keg details and click "Mint NFT". This will create a blockchain record for the keg.',
        status:
          "You have full access to view all keg statuses. Check the Dashboard for overview metrics or go to Kegs page for detailed inventory.",
        blockchain:
          "All blockchain operations are available to you. You can mint, transfer, and burn NFTs as needed for keg lifecycle management.",
        default:
          "As an Admin, you have full access to all KegTracker features including minting NFTs, managing kegs, viewing all shipments, and blockchain operations.",
      },
      brewer: {
        transfer:
          "As a Brewer, you can transfer keg ownership by going to NFT Manager → selecting a keg → Transfer NFT. Choose the recipient role and confirm the transaction.",
        status:
          "You can view keg status in the Dashboard or Kegs page. Focus on production metrics and kegs ready for distribution.",
        refill:
          "Go to Refill page to schedule keg refills. You can mark kegs as ready for pickup and track refill progress.",
        default:
          "As a Brewer, you can transfer keg ownership, schedule refills, and track production metrics. Use the Dashboard to monitor your brewing operations.",
      },
      partner: {
        receive:
          "When kegs are transferred to you, you'll see them in your Dashboard. Use Scan & Track to update status when kegs arrive at your location.",
        verify:
          "Use the Verify page to scan QR codes and confirm keg authenticity. This checks the blockchain record for ownership history.",
        status:
          "Track your received kegs in the Dashboard. You can see delivery status and update when kegs are consumed.",
        default:
          "As a Partner, you can receive keg transfers, verify authenticity, and update consumption status. Check your Dashboard for current inventory.",
      },
      driver: {
        scan: "Use Scan & Track to scan keg QR codes during pickup and delivery. This updates the blockchain with location and status changes.",
        delivery:
          'Mark kegs as "In Transit" when picked up and "Delivered" when dropped off. Each scan creates a blockchain record.',
        route: "Check Shipments page for your assigned routes and delivery schedules.",
        default:
          "As a Driver, use Scan & Track for all keg handling. Scan QR codes to update status and location throughout the delivery process.",
      },
    }

    // Determine response based on role and question content
    const userRole = role?.toLowerCase() || "admin"
    const question = lastMessage.toLowerCase()

    let response = mockResponses[userRole]?.default || mockResponses.admin.default

    // Check for specific keywords
    for (const [keyword, answer] of Object.entries(mockResponses[userRole] || {})) {
      if (question.includes(keyword)) {
        response = answer
        break
      }
    }

    // Add blockchain action suggestions
    if (question.includes("keg-") || question.includes("KEG-")) {
      const kegId = question.match(/keg-?\d+/i)?.[0]?.toUpperCase()
      response += `\n\n💡 **Suggested Actions for ${kegId}:**\n• Verify authenticity in Verify page\n• Check blockchain history in Blockchain Explorer\n• Update status via Scan & Track`
    }

    return new Response(response)
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response("Sorry, I encountered an error. Please try again.", { status: 500 })
  }
}
