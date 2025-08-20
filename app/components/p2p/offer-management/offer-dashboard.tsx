"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  Activity,
  AlertCircle,
} from "lucide-react"

interface Offer {
  id: string
  side: "buy" | "sell"
  token: string
  price: {
    amount: number
    type: "fixed" | "floating"
    spread?: number
  }
  limits: {
    min: number
    max: number
    available: number
  }
  paymentMethods: string[]
  isActive: boolean
  stats: {
    views: number
    orders: number
    completionRate: number
  }
  createdAt: Date
  updatedAt: Date
}

interface OfferDashboardProps {
  offers: Offer[]
  onCreateOffer: () => void
  onEditOffer: (offerId: string) => void
  onDeleteOffer: (offerId: string) => void
  onToggleOffer: (offerId: string, active: boolean) => void
  onViewOffer: (offerId: string) => void
}

export function OfferDashboard({
  offers,
  onCreateOffer,
  onEditOffer,
  onDeleteOffer,
  onToggleOffer,
  onViewOffer,
}: OfferDashboardProps) {
  const [selectedTab, setSelectedTab] = useState("all")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatCrypto = (amount: number, token: string) => {
    return `${amount.toFixed(token === "BTC" ? 8 : 2)} ${token}`
  }

  const getFilteredOffers = () => {
    switch (selectedTab) {
      case "active":
        return offers.filter((offer) => offer.isActive)
      case "inactive":
        return offers.filter((offer) => !offer.isActive)
      case "buy":
        return offers.filter((offer) => offer.side === "buy")
      case "sell":
        return offers.filter((offer) => offer.side === "sell")
      default:
        return offers
    }
  }

  const getOfferStats = () => {
    const totalOffers = offers.length
    const activeOffers = offers.filter((offer) => offer.isActive).length
    const totalViews = offers.reduce((sum, offer) => sum + offer.stats.views, 0)
    const totalOrders = offers.reduce((sum, offer) => sum + offer.stats.orders, 0)

    return {
      totalOffers,
      activeOffers,
      totalViews,
      totalOrders,
    }
  }

  const stats = getOfferStats()
  const filteredOffers = getFilteredOffers()

  const renderOfferCard = (offer: Offer) => {
    return (
      <Card key={offer.id} className={`${!offer.isActive ? "opacity-60" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Badge variant={offer.side === "buy" ? "default" : "secondary"}>
                {offer.side === "buy" ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {offer.side.toUpperCase()} {offer.token}
              </Badge>
              {!offer.isActive && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  Inactive
                </Badge>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewOffer(offer.id)}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditOffer(offer.id)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Offer
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDeleteOffer(offer.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Offer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-3">
            {/* Price and Limits */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Price</div>
                <div className="font-semibold">
                  {formatCurrency(offer.price.amount)}
                  {offer.price.type === "floating" && offer.price.spread && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {offer.price.spread >= 0 ? "+" : ""}
                      {offer.price.spread}%
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Available</div>
                <div className="font-semibold text-sm">{formatCrypto(offer.limits.available, offer.token)}</div>
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
              <div className="text-xs text-muted-foreground mb-1">Payment Methods</div>
              <div className="text-sm">{offer.paymentMethods.join(", ")}</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="font-medium">{offer.stats.views}</div>
                <div className="text-muted-foreground">Views</div>
              </div>
              <div>
                <div className="font-medium">{offer.stats.orders}</div>
                <div className="text-muted-foreground">Orders</div>
              </div>
              <div>
                <div className="font-medium">{offer.stats.completionRate}%</div>
                <div className="text-muted-foreground">Success</div>
              </div>
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm text-muted-foreground">{offer.isActive ? "Active" : "Inactive"}</span>
              <Switch checked={offer.isActive} onCheckedChange={(checked) => onToggleOffer(offer.id, checked)} />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif">My Offers</h1>
          <p className="text-muted-foreground">Manage your trading offers</p>
        </div>
        <Button onClick={onCreateOffer}>
          <Plus className="w-4 h-4 mr-2" />
          Create Offer
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Offers</p>
                <p className="text-2xl font-bold">{stats.totalOffers}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Offers</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeOffers}</p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{stats.totalViews}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Offers List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Offers</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="buy">Buy Orders</TabsTrigger>
              <TabsTrigger value="sell">Sell Orders</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-6">
              {filteredOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOffers.map(renderOfferCard)}
                </div>
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Offers Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedTab === "all" ? "You haven't created any offers yet." : `No ${selectedTab} offers found.`}
                  </p>
                  <Button onClick={onCreateOffer}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Offer
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Tips */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Pro Tips:</strong> Keep your offers competitive and active for better visibility. Update your prices
          regularly to match market conditions.
        </AlertDescription>
      </Alert>
    </div>
  )
}
