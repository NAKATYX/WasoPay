"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Shield, CheckCircle, Star, TrendingUp, TrendingDown, Circle } from "lucide-react"

interface OfferCardProps {
  offer: {
    id: string
    merchantId: string
    merchantName: string
    token: string
    side: "buy" | "sell"
    price: {
      amount: number
      currency: string
      type: "fixed" | "floating"
      spread?: number
    }
    limits: {
      min: number
      max: number
      available: number
    }
    stats: {
      completionRate: number
      orderCount: number
      avgReleaseTime: number
    }
    paymentMethods: Array<{
      id: string
      name: string
      icon: string
    }>
    badges: {
      kycVerified: boolean
      bankVerified: boolean
      merchantBadge: boolean
    }
    isOnline: boolean
    createdAt: Date
  }
  onTrade: (offerId: string) => void
}

export function OfferCard({ offer, onTrade }: OfferCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatCrypto = (amount: number, token: string) => {
    return `${amount.toFixed(token === "BTC" ? 8 : 2)} ${token}`
  }

  const getPriceDisplay = () => {
    if (offer.price.type === "floating" && offer.price.spread) {
      const spreadSign = offer.price.spread >= 0 ? "+" : ""
      return (
        <div className="flex items-center gap-1">
          <span>{formatCurrency(offer.price.amount)}</span>
          <Badge variant={offer.price.spread >= 0 ? "default" : "destructive"} className="text-xs">
            {spreadSign}
            {offer.price.spread}%
          </Badge>
        </div>
      )
    }
    return formatCurrency(offer.price.amount)
  }

  const getAvailableAmount = () => {
    const cryptoAmount = offer.limits.available
    const fiatAmount = cryptoAmount * offer.price.amount
    return {
      crypto: formatCrypto(cryptoAmount, offer.token),
      fiat: formatCurrency(fiatAmount),
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={`/abstract-geometric-shapes.png?height=40&width=40&query=${offer.merchantName}`} />
                <AvatarFallback>{offer.merchantName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              {offer.isOnline && (
                <Circle className="absolute -bottom-1 -right-1 w-3 h-3 fill-green-500 text-green-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">{offer.merchantName}</h3>
                {offer.badges.kycVerified && <CheckCircle className="w-4 h-4 text-primary" />}
                {offer.badges.merchantBadge && <Shield className="w-4 h-4 text-secondary" />}
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{offer.stats.completionRate}%</span>
                </div>
                <span>•</span>
                <span>{offer.stats.orderCount} orders</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{offer.stats.avgReleaseTime}m</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              {offer.side === "buy" ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <Badge variant={offer.side === "buy" ? "default" : "secondary"}>{offer.side.toUpperCase()}</Badge>
            </div>
            <div className="text-xs text-muted-foreground">{offer.token}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price and Limits */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Price</div>
            <div className="font-semibold">{getPriceDisplay()}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Available</div>
            <div className="font-semibold text-sm">
              <div>{getAvailableAmount().crypto}</div>
              <div className="text-xs text-muted-foreground">{getAvailableAmount().fiat}</div>
            </div>
          </div>
        </div>

        {/* Limits */}
        <div>
          <div className="text-xs text-muted-foreground mb-1">Limits</div>
          <div className="text-sm">
            {formatCurrency(offer.limits.min)} - {formatCurrency(offer.limits.max)}
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <div className="text-xs text-muted-foreground mb-2">Payment Methods</div>
          <div className="flex flex-wrap gap-1">
            {offer.paymentMethods.slice(0, 3).map((method) => (
              <Badge key={method.id} variant="outline" className="text-xs">
                {method.icon} {method.name}
              </Badge>
            ))}
            {offer.paymentMethods.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{offer.paymentMethods.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Trade Button */}
        <Button
          className="w-full"
          onClick={() => onTrade(offer.id)}
          variant={offer.side === "buy" ? "default" : "secondary"}
        >
          {offer.side === "buy" ? "Sell" : "Buy"} {offer.token}
        </Button>
      </CardContent>
    </Card>
  )
}
