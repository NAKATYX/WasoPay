"use client"

import { useState, useEffect } from "react"
import { TradeStatus } from "@/components/p2p/trade-room/trade-status"
import { TradeChat } from "@/components/p2p/trade-room/trade-chat"
import { TradeDetails } from "@/components/p2p/trade-room/trade-details"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock data - in real app this would come from API
const MOCK_TRADE = {
  id: "trade_123456789",
  amount: {
    crypto: 100,
    fiat: 165000,
  },
  token: "USDT",
  side: "buy" as const,
  price: 1650,
  status: "pending_payment" as const,
  deadline: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes from now
  buyer: {
    id: "buyer_1",
    name: "CryptoTrader",
    avatar: "/cryptotrader.png",
    completionRate: 98,
    totalTrades: 247,
  },
  seller: {
    id: "seller_1",
    name: "NairaKing",
    avatar: "/naira-king-logo.png",
    completionRate: 95,
    totalTrades: 189,
  },
  paymentMethod: {
    name: "Bank Transfer",
    details: {
      bankName: "First Bank of Nigeria",
      accountNumber: "3012345678",
      accountName: "JOHN DOE TRADING",
    },
  },
  escrow: {
    isActive: true,
    address: "0x742d35Cc6634C0532925a3b8D4C9db96590b4165",
    txHash: "0x8ba1f109551bd432803012645bd132fad648156269b130d4b2e17692d0d550d2",
  },
}

const MOCK_MESSAGES = [
  {
    id: "1",
    senderId: "system",
    senderName: "System",
    message: "Trade created. Buyer has 15 minutes to make payment.",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: "system" as const,
  },
  {
    id: "2",
    senderId: "seller_1",
    senderName: "NairaKing",
    message:
      "Hello! I've received your order. Please make the payment to the account details provided and upload proof here.",
    timestamp: new Date(Date.now() - 4 * 60 * 1000),
    type: "text" as const,
  },
  {
    id: "3",
    senderId: "buyer_1",
    senderName: "CryptoTrader",
    message: "Thanks! Making the payment now. Will upload receipt shortly.",
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    type: "text" as const,
  },
]

export default function TradeRoomPage() {
  const params = useParams()
  const orderId = params.orderId as string

  const [trade] = useState(MOCK_TRADE)
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [currentUserId] = useState("buyer_1") // In real app, get from auth
  const [isTyping, setIsTyping] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate typing indicator
      if (Math.random() > 0.9) {
        setIsTyping(true)
        setTimeout(() => setIsTyping(false), 2000)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserId === "buyer_1" ? "CryptoTrader" : "NairaKing",
      message,
      timestamp: new Date(),
      type: "text" as const,
    }

    setMessages((prev) => [...prev, newMessage])
  }

  const handleFileUpload = (file: File) => {
    const newMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserId === "buyer_1" ? "CryptoTrader" : "NairaKing",
      message: "Payment receipt uploaded",
      timestamp: new Date(),
      type: file.type.startsWith("image/") ? ("image" as const) : ("file" as const),
      fileUrl: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: file.size,
    }

    setMessages((prev) => [...prev, newMessage])
  }

  const handleMarkPaid = () => {
    console.log("Marking payment as made")
  }

  const handleConfirmPayment = () => {
    console.log("Confirming payment received")
  }

  const handleDispute = () => {
    console.log("Opening dispute")
  }

  const handleCancel = () => {
    console.log("Cancelling trade")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/p2p">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Market
              </Link>
            </Button>

            <div className="flex items-center space-x-2">
              <Logo size="sm" />
              <div className="border-l pl-2 ml-2">
                <p className="text-sm text-muted-foreground">Order #{orderId.slice(0, 8)}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="bg-transparent">
              Help
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Trade Status & Details */}
          <div className="lg:col-span-3 space-y-4 overflow-y-auto">
            <TradeStatus
              status={trade.status}
              deadline={trade.deadline}
              escrowActive={trade.escrow.isActive}
              currentStep={1}
              totalSteps={4}
            />

            <div className="hidden lg:block">
              <TradeDetails
                trade={trade}
                currentUserId={currentUserId}
                onMarkPaid={handleMarkPaid}
                onConfirmPayment={handleConfirmPayment}
                onDispute={handleDispute}
                onCancel={handleCancel}
              />
            </div>
          </div>

          {/* Center Panel - Chat */}
          <div className="lg:col-span-6 h-full">
            <TradeChat
              messages={messages}
              currentUserId={currentUserId}
              onSendMessage={handleSendMessage}
              onFileUpload={handleFileUpload}
              isTyping={isTyping}
              typingUser={isTyping ? "NairaKing" : undefined}
            />
          </div>

          {/* Right Panel - Trade Details (Mobile: Bottom Sheet) */}
          <div className="lg:col-span-3 lg:block hidden overflow-y-auto">
            <TradeDetails
              trade={trade}
              currentUserId={currentUserId}
              onMarkPaid={handleMarkPaid}
              onConfirmPayment={handleConfirmPayment}
              onDispute={handleDispute}
              onCancel={handleCancel}
            />
          </div>
        </div>

        {/* Mobile Trade Details */}
        <div className="lg:hidden mt-6">
          <TradeDetails
            trade={trade}
            currentUserId={currentUserId}
            onMarkPaid={handleMarkPaid}
            onConfirmPayment={handleConfirmPayment}
            onDispute={handleDispute}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  )
}
