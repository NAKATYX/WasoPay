"use client"

import { useState } from "react"
import { MerchantProfile } from "@/components/merchant/merchant-profile"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Logo } from "@/components/ui/logo"

// Mock merchant data
const MOCK_MERCHANT = {
  id: "merchant_123",
  username: "cryptoking",
  displayName: "CryptoKing",
  avatar: "/cryptotrader.png",
  joinedAt: new Date("2023-01-15"),
  lastSeen: new Date(),
  isOnline: true,
  kyc: {
    level: 3,
    verifiedAt: new Date("2023-02-01"),
  },
  stats: {
    totalTrades: 1247,
    completionRate: 98,
    avgReleaseTime: 3,
    totalVolume: 125000000,
    activeSince: new Date("2023-01-15"),
    responseTime: 2,
  },
  badges: {
    verified: true,
    bankVerified: true,
    topMerchant: true,
    fastRelease: true,
  },
  ratings: {
    average: 4.8,
    total: 892,
    breakdown: {
      5: 720,
      4: 140,
      3: 25,
      2: 5,
      1: 2,
    },
  },
  offers: [
    {
      id: "offer_1",
      token: "USDT",
      side: "buy" as const,
      price: 1650,
      available: 1500,
      paymentMethods: ["Bank Transfer", "OPay"],
    },
    {
      id: "offer_2",
      token: "BTC",
      side: "sell" as const,
      price: 65000000,
      available: 0.5,
      paymentMethods: ["Bank Transfer", "PalmPay", "Moniepoint"],
    },
    {
      id: "offer_3",
      token: "ETH",
      side: "buy" as const,
      price: 4200000,
      available: 2.5,
      paymentMethods: ["Bank Transfer"],
    },
  ],
  reviews: [
    {
      id: "review_1",
      reviewerId: "user_1",
      reviewerName: "TraderPro",
      rating: 5,
      comment: "Excellent trader! Very fast release and professional communication. Highly recommended.",
      createdAt: new Date("2024-01-15"),
      tradeId: "trade_123",
    },
    {
      id: "review_2",
      reviewerId: "user_2",
      reviewerName: "CryptoNewbie",
      rating: 5,
      comment: "Great experience trading with CryptoKing. Patient and helpful throughout the process.",
      createdAt: new Date("2024-01-10"),
      tradeId: "trade_124",
    },
    {
      id: "review_3",
      reviewerId: "user_3",
      reviewerName: "NairaTrader",
      rating: 4,
      comment: "Good trader, quick transactions. Only minor delay in communication but overall satisfied.",
      createdAt: new Date("2024-01-05"),
      tradeId: "trade_125",
    },
  ],
}

export default function MerchantProfilePage() {
  const params = useParams()
  const username = params.username as string

  const [merchant] = useState(MOCK_MERCHANT)
  const [currentUserId] = useState("user_current") // In real app, get from auth

  const handleStartTrade = (offerId: string) => {
    console.log("Starting trade with offer:", offerId)
    // Navigate to trade creation
  }

  const handleSendMessage = () => {
    console.log("Opening chat with merchant")
    // Open chat interface
  }

  const handleReport = () => {
    console.log("Reporting merchant")
    // Open report dialog
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

            <Logo size="sm" showSubtitle subtitle="Merchant Profile" />
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="bg-transparent">
              Share Profile
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <MerchantProfile
          merchant={merchant}
          currentUserId={currentUserId}
          onStartTrade={handleStartTrade}
          onSendMessage={handleSendMessage}
          onReport={handleReport}
        />
      </div>
    </div>
  )
}
