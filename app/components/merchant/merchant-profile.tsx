"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Star, Shield, CheckCircle, Clock, TrendingUp, MessageCircle, Award, Users, Activity } from "lucide-react"

interface MerchantProfileProps {
  merchant: {
    id: string
    username: string
    displayName: string
    avatar?: string
    joinedAt: Date
    lastSeen: Date
    isOnline: boolean
    kyc: {
      level: number
      verifiedAt?: Date
    }
    stats: {
      totalTrades: number
      completionRate: number
      avgReleaseTime: number
      totalVolume: number
      activeSince: Date
      responseTime: number
    }
    badges: {
      verified: boolean
      bankVerified: boolean
      topMerchant: boolean
      fastRelease: boolean
    }
    ratings: {
      average: number
      total: number
      breakdown: {
        5: number
        4: number
        3: number
        2: number
        1: number
      }
    }
    offers: Array<{
      id: string
      token: string
      side: "buy" | "sell"
      price: number
      available: number
      paymentMethods: string[]
    }>
    reviews: Array<{
      id: string
      reviewerId: string
      reviewerName: string
      rating: number
      comment: string
      createdAt: Date
      tradeId: string
    }>
  }
  currentUserId?: string
  onStartTrade: (offerId: string) => void
  onSendMessage: () => void
  onReport: () => void
}

export function MerchantProfile({
  merchant,
  currentUserId,
  onStartTrade,
  onSendMessage,
  onReport,
}: MerchantProfileProps) {
  const isOwnProfile = merchant.id === currentUserId

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  const getKYCLevelName = (level: number) => {
    const levels = ["Unverified", "Basic", "Standard", "Enhanced", "Institutional"]
    return levels[level] || "Unknown"
  }

  const renderStarRating = (rating: number, size = "w-4 h-4") => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  const renderRatingBreakdown = () => {
    const total = merchant.ratings.total
    return (
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = merchant.ratings.breakdown[rating as keyof typeof merchant.ratings.breakdown]
          const percentage = total > 0 ? (count / total) * 100 : 0

          return (
            <div key={rating} className="flex items-center gap-2 text-sm">
              <span className="w-3">{rating}</span>
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <Progress value={percentage} className="flex-1 h-2" />
              <span className="w-8 text-right text-muted-foreground">{count}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={merchant.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">{merchant.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {merchant.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-background rounded-full" />
                )}
              </div>

              <div className="text-center md:text-left mt-4">
                <h1 className="text-2xl font-bold font-serif">{merchant.displayName}</h1>
                <p className="text-muted-foreground">@{merchant.username}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {merchant.isOnline ? "Online now" : `Last seen ${merchant.lastSeen.toLocaleDateString()}`}
                </p>
              </div>
            </div>

            {/* Stats and Badges */}
            <div className="flex-1 space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {merchant.badges.verified && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    KYC Verified
                  </Badge>
                )}
                {merchant.badges.bankVerified && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Bank Verified
                  </Badge>
                )}
                {merchant.badges.topMerchant && (
                  <Badge variant="default" className="flex items-center gap-1 bg-purple-600">
                    <Award className="w-3 h-3" />
                    Top Merchant
                  </Badge>
                )}
                {merchant.badges.fastRelease && (
                  <Badge variant="secondary" className="flex items-center gap-1 bg-green-600 text-white">
                    <Clock className="w-3 h-3" />
                    Fast Release
                  </Badge>
                )}
                <Badge variant="outline">{getKYCLevelName(merchant.kyc.level)} Level</Badge>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{merchant.stats.completionRate}%</div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{merchant.stats.totalTrades}</div>
                  <div className="text-sm text-muted-foreground">Total Trades</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{merchant.stats.avgReleaseTime}m</div>
                  <div className="text-sm text-muted-foreground">Avg Release</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatCurrency(merchant.stats.totalVolume)}</div>
                  <div className="text-sm text-muted-foreground">Total Volume</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {renderStarRating(merchant.ratings.average, "w-5 h-5")}
                  <span className="text-lg font-semibold">{merchant.ratings.average.toFixed(1)}</span>
                  <span className="text-muted-foreground">({merchant.ratings.total} reviews)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isOwnProfile && (
              <div className="flex flex-col gap-2 md:w-48">
                <Button onClick={onSendMessage} className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" onClick={onReport} className="w-full bg-transparent">
                  Report User
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      <Tabs defaultValue="offers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="offers">Active Offers</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="offers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {merchant.offers.map((offer) => (
              <Card key={offer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={offer.side === "buy" ? "default" : "secondary"}>
                      {offer.side.toUpperCase()} {offer.token}
                    </Badge>
                    <span className="font-semibold">{formatCurrency(offer.price)}</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available:</span>
                      <span>
                        {offer.available} {offer.token}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment:</span>
                      <span>{offer.paymentMethods.join(", ")}</span>
                    </div>
                  </div>

                  {!isOwnProfile && (
                    <Button
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => onStartTrade(offer.id)}
                      variant={offer.side === "buy" ? "default" : "secondary"}
                    >
                      {offer.side === "buy" ? "Sell" : "Buy"} {offer.token}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {merchant.offers.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Offers</h3>
                <p className="text-muted-foreground">This merchant doesn't have any active offers at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trading Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Trading Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Trades</span>
                    <span className="font-semibold">{merchant.stats.totalTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-semibold text-green-600">{merchant.stats.completionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Average Release Time</span>
                    <span className="font-semibold">{merchant.stats.avgReleaseTime} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="font-semibold">{merchant.stats.responseTime} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Volume</span>
                    <span className="font-semibold">{formatCurrency(merchant.stats.totalVolume)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rating Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Rating Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold">{merchant.ratings.average.toFixed(1)}</div>
                  <div className="flex justify-center mb-1">{renderStarRating(merchant.ratings.average)}</div>
                  <div className="text-sm text-muted-foreground">{merchant.ratings.total} total reviews</div>
                </div>
                {renderRatingBreakdown()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {merchant.reviews.length > 0 ? (
            <div className="space-y-4">
              {merchant.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {review.reviewerName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.reviewerName}</div>
                          <div className="flex items-center gap-2">
                            {renderStarRating(review.rating, "w-3 h-3")}
                            <span className="text-xs text-muted-foreground">
                              {review.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                <p className="text-muted-foreground">This merchant hasn't received any reviews yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                About {merchant.displayName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Member Since</span>
                  <div className="font-medium">{formatDate(merchant.joinedAt)}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">KYC Level</span>
                  <div className="font-medium">{getKYCLevelName(merchant.kyc.level)}</div>
                </div>
                {merchant.kyc.verifiedAt && (
                  <div>
                    <span className="text-muted-foreground">Verified On</span>
                    <div className="font-medium">{formatDate(merchant.kyc.verifiedAt)}</div>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Active Since</span>
                  <div className="font-medium">{formatDate(merchant.stats.activeSince)}</div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Trading Preferences</h4>
                <div className="text-sm text-muted-foreground">
                  This merchant specializes in fast, reliable cryptocurrency trading with a focus on customer
                  satisfaction and security.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
