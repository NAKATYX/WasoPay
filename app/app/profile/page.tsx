"use client"

import { useState } from "react"
import { KYCVerification, KYCLevel } from "@/components/merchant/kyc-verification"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Settings, User, Shield, Activity } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/ui/logo"

// Mock user data
const MOCK_USER = {
  id: "user_123",
  username: "cryptotrader",
  displayName: "CryptoTrader",
  email: "trader@example.com",
  phone: "+234 800 000 0000",
  avatar: "/cryptotrader.png",
  joinedAt: new Date("2023-06-15"),
  kycLevel: KYCLevel.STANDARD,
  stats: {
    totalTrades: 45,
    completionRate: 96,
    totalVolume: 2500000,
  },
}

const MOCK_DOCUMENTS = [
  {
    type: "NATIONAL_ID" as const,
    status: "approved" as const,
    uploadedAt: new Date("2023-07-01"),
    reviewedAt: new Date("2023-07-02"),
  },
  {
    type: "UTILITY_BILL" as const,
    status: "pending" as const,
    uploadedAt: new Date("2024-01-15"),
  },
]

export default function ProfilePage() {
  const [user] = useState(MOCK_USER)
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS)

  const handleDocumentUpload = async (type: string, file: File) => {
    console.log("Uploading document:", type, file.name)
    // Simulate upload
    const newDoc = {
      type: type as any,
      status: "pending" as const,
      uploadedAt: new Date(),
    }
    setDocuments((prev) => [...prev.filter((doc) => doc.type !== type), newDoc])
  }

  const handleSubmitForReview = () => {
    console.log("Submitting for KYC review")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount)
  }

  const getKYCLevelName = (level: number) => {
    const levels = ["Unverified", "Basic", "Standard", "Enhanced", "Institutional"]
    return levels[level] || "Unknown"
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

            <Logo size="sm" showSubtitle subtitle="My Profile" />
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild className="bg-transparent">
              <Link href="/settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Profile Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:items-start">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">{user.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className="text-center md:text-left mt-4">
                    <h1 className="text-2xl font-bold font-serif">{user.displayName}</h1>
                    <p className="text-muted-foreground">@{user.username}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Member since {user.joinedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">{getKYCLevelName(user.kycLevel)} Level</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{user.stats.completionRate}%</div>
                      <div className="text-sm text-muted-foreground">Completion Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{user.stats.totalTrades}</div>
                      <div className="text-sm text-muted-foreground">Total Trades</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formatCurrency(user.stats.totalVolume)}</div>
                      <div className="text-sm text-muted-foreground">Total Volume</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="verification" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="verification" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Verification
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="verification">
              <KYCVerification
                currentLevel={user.kycLevel}
                documents={documents}
                onDocumentUpload={handleDocumentUpload}
                onSubmitForReview={handleSubmitForReview}
              />
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Recent Activity</h3>
                    <p className="text-muted-foreground">Your trading activity will appear here.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Display Name</label>
                      <div className="mt-1 p-2 border rounded-md">{user.displayName}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Username</label>
                      <div className="mt-1 p-2 border rounded-md">@{user.username}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <div className="mt-1 p-2 border rounded-md">{user.email}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <div className="mt-1 p-2 border rounded-md">{user.phone}</div>
                    </div>
                  </div>
                  <Button>Edit Profile</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Settings</h3>
                    <p className="text-muted-foreground">Account settings and preferences will be available here.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
