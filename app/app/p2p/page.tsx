"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { MarketFilters } from "@/components/p2p/market-filters"
import { OfferCard } from "@/components/p2p/offer-card"
import { Search, Plus, RefreshCw, TrendingUp, TrendingDown, Zap } from "lucide-react"
import Link from "next/link"
import { ExpressTrading } from "@/components/p2p/express-trading"
import { Logo } from "@/components/ui/logo"

// Mock data for demonstration
const MOCK_OFFERS = [
  {
    id: "1",
    merchantId: "merchant1",
    merchantName: "CryptoKing",
    token: "USDT",
    side: "buy" as const,
    price: {
      amount: 1650,
      currency: "NGN",
      type: "fixed" as const,
    },
    limits: {
      min: 50000,
      max: 2000000,
      available: 1500,
    },
    stats: {
      completionRate: 98,
      orderCount: 1247,
      avgReleaseTime: 3,
    },
    paymentMethods: [
      { id: "NIP_TRANSFER", name: "Bank Transfer", icon: "🏦" },
      { id: "OPAY", name: "OPay", icon: "💳" },
    ],
    badges: {
      kycVerified: true,
      bankVerified: true,
      merchantBadge: true,
    },
    isOnline: true,
    createdAt: new Date(),
  },
  {
    id: "2",
    merchantId: "merchant2",
    merchantName: "NairaTrader",
    token: "USDT",
    side: "sell" as const,
    price: {
      amount: 1655,
      currency: "NGN",
      type: "floating" as const,
      spread: 0.5,
    },
    limits: {
      min: 100000,
      max: 5000000,
      available: 3200,
    },
    stats: {
      completionRate: 95,
      orderCount: 892,
      avgReleaseTime: 5,
    },
    paymentMethods: [
      { id: "PALMPAY", name: "PalmPay", icon: "🌴" },
      { id: "MONIEPOINT", name: "Moniepoint", icon: "💰" },
      { id: "NIP_TRANSFER", name: "Bank Transfer", icon: "🏦" },
    ],
    badges: {
      kycVerified: true,
      bankVerified: false,
      merchantBadge: false,
    },
    isOnline: false,
    createdAt: new Date(),
  },
  // Add more mock offers...
]

export default function P2PMarketPage() {
  const [activeTab, setActiveTab] = useState("buy")
  const [mainTab, setMainTab] = useState("p2p") // Added main tab state for P2P vs Express
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    token: "USDT",
    fiat: "NGN",
    paymentMethods: [],
    priceType: "all",
    merchantOnly: false,
    limits: { min: 0, max: 10000000 },
    onlineStatus: false,
    completionRate: 0,
  })
  const [offers, setOffers] = useState(MOCK_OFFERS)
  const [isLoading, setIsLoading] = useState(false)

  // Filter offers based on current filters and search
  const filteredOffers = offers.filter((offer) => {
    // Filter by side (buy/sell)
    if (offer.side !== activeTab) return false

    // Filter by token
    if (filters.token && offer.token !== filters.token) return false

    // Filter by search query
    if (searchQuery && !offer.merchantName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by payment methods
    if (filters.paymentMethods.length > 0) {
      const hasMatchingPayment = offer.paymentMethods.some((method) => filters.paymentMethods.includes(method.id))
      if (!hasMatchingPayment) return false
    }

    // Filter by merchant verification
    if (filters.merchantOnly && !offer.badges.merchantBadge) return false

    // Filter by online status
    if (filters.onlineStatus && !offer.isOnline) return false

    // Filter by completion rate
    if (offer.stats.completionRate < filters.completionRate) return false

    return true
  })

  const handleTrade = (offerId: string) => {
    // Navigate to trade creation page
    console.log("Starting trade with offer:", offerId)
  }

  const refreshOffers = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Logo size="sm" />
              <span className="font-serif font-bold text-xl text-foreground">WasoPay</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/p2p" className="text-foreground font-medium">
              Trade
            </Link>
            <Link href="/wallets" className="text-muted-foreground hover:text-foreground transition-colors">
              Wallets
            </Link>
            <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
              Profile
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="outline" asChild>
              <Link href="/p2p/post">
                <Plus className="w-4 h-4 mr-2" />
                Post Ad
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/profile">Profile</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Main Tab Selection */}
        <div className="mb-6">
          <Tabs value={mainTab} onValueChange={setMainTab}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="p2p" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                P2P Trading
              </TabsTrigger>
              <TabsTrigger value="express" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Express Trade
              </TabsTrigger>
            </TabsList>

            <TabsContent value="express" className="mt-6">
              <div className="flex justify-center">
                <ExpressTrading />
              </div>
            </TabsContent>

            <TabsContent value="p2p" className="mt-6">
              {/* Main Trading Interface */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <MarketFilters
                      filters={filters}
                      onFiltersChange={setFilters}
                      isOpen={showFilters}
                      onToggle={() => setShowFilters(!showFilters)}
                    />
                  </div>
                </div>

                {/* Offers List */}
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <CardTitle className="font-serif">P2P Market</CardTitle>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <div className="relative flex-1 sm:flex-initial">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search merchants..."
                              className="pl-10 w-full sm:w-64"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={refreshOffers}
                            disabled={isLoading}
                            className="lg:hidden bg-transparent"
                          >
                            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden"
                          >
                            Filters
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <div className="px-6 pb-4">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="buy" className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Buy Crypto
                          </TabsTrigger>
                          <TabsTrigger value="sell" className="flex items-center gap-2">
                            <TrendingDown className="w-4 h-4" />
                            Sell Crypto
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      <CardContent>
                        <TabsContent value="buy" className="mt-0">
                          <div className="space-y-4">
                            {filteredOffers.length > 0 ? (
                              filteredOffers.map((offer) => (
                                <OfferCard key={offer.id} offer={offer} onTrade={handleTrade} />
                              ))
                            ) : (
                              <div className="text-center py-12">
                                <p className="text-muted-foreground mb-4">No offers found matching your criteria</p>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    setFilters({
                                      token: "USDT",
                                      fiat: "NGN",
                                      paymentMethods: [],
                                      priceType: "all",
                                      merchantOnly: false,
                                      limits: { min: 0, max: 10000000 },
                                      onlineStatus: false,
                                      completionRate: 0,
                                    })
                                  }
                                >
                                  Clear Filters
                                </Button>
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="sell" className="mt-0">
                          <div className="space-y-4">
                            {filteredOffers.length > 0 ? (
                              filteredOffers.map((offer) => (
                                <OfferCard key={offer.id} offer={offer} onTrade={handleTrade} />
                              ))
                            ) : (
                              <div className="text-center py-12">
                                <p className="text-muted-foreground mb-4">No offers found matching your criteria</p>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    setFilters({
                                      token: "USDT",
                                      fiat: "NGN",
                                      paymentMethods: [],
                                      priceType: "all",
                                      merchantOnly: false,
                                      limits: { min: 0, max: 10000000 },
                                      onlineStatus: false,
                                      completionRate: 0,
                                    })
                                  }
                                >
                                  Clear Filters
                                </Button>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      </CardContent>
                    </Tabs>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
