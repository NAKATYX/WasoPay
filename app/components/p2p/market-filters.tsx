"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Filter, X } from "lucide-react"

interface MarketFilters {
  token: string
  fiat: string
  paymentMethods: string[]
  priceType: string
  merchantOnly: boolean
  limits: { min: number; max: number }
  onlineStatus: boolean
  completionRate: number
}

interface MarketFiltersProps {
  filters: MarketFilters
  onFiltersChange: (filters: MarketFilters) => void
  isOpen: boolean
  onToggle: () => void
}

const PAYMENT_METHODS = [
  { id: "NIP_TRANSFER", name: "Bank Transfer", icon: "🏦" },
  { id: "OPAY", name: "OPay", icon: "💳" },
  { id: "PALMPAY", name: "PalmPay", icon: "🌴" },
  { id: "MONIEPOINT", name: "Moniepoint", icon: "💰" },
  { id: "CHIPPER", name: "Chipper Cash", icon: "🐿️" },
]

const CRYPTO_TOKENS = [
  { id: "USDT", name: "USDT", fullName: "Tether" },
  { id: "BTC", name: "BTC", fullName: "Bitcoin" },
  { id: "ETH", name: "ETH", fullName: "Ethereum" },
]

export function MarketFilters({ filters, onFiltersChange, isOpen, onToggle }: MarketFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const updateFilter = (key: keyof MarketFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const togglePaymentMethod = (methodId: string) => {
    const currentMethods = localFilters.paymentMethods
    const newMethods = currentMethods.includes(methodId)
      ? currentMethods.filter((id) => id !== methodId)
      : [...currentMethods, methodId]
    updateFilter("paymentMethods", newMethods)
  }

  const clearFilters = () => {
    const defaultFilters: MarketFilters = {
      token: "USDT",
      fiat: "NGN",
      paymentMethods: [],
      priceType: "all",
      merchantOnly: false,
      limits: { min: 0, max: 10000000 },
      onlineStatus: false,
      completionRate: 0,
    }
    setLocalFilters(defaultFilters)
    onFiltersChange(defaultFilters)
  }

  const activeFiltersCount =
    localFilters.paymentMethods.length +
    (localFilters.merchantOnly ? 1 : 0) +
    (localFilters.onlineStatus ? 1 : 0) +
    (localFilters.completionRate > 0 ? 1 : 0) +
    (localFilters.priceType !== "all" ? 1 : 0)

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={onToggle} className="flex items-center gap-2 bg-transparent">
        <Filter className="w-4 h-4" />
        Filters
        {activeFiltersCount > 0 && (
          <Badge variant="secondary" className="ml-1">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-serif">Filters</CardTitle>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Cryptocurrency Selection */}
        <div className="space-y-2">
          <Label>Cryptocurrency</Label>
          <Select value={localFilters.token} onValueChange={(value) => updateFilter("token", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CRYPTO_TOKENS.map((token) => (
                <SelectItem key={token.id} value={token.id}>
                  {token.name} - {token.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <Label>Payment Methods</Label>
          <div className="grid grid-cols-1 gap-2">
            {PAYMENT_METHODS.map((method) => (
              <div key={method.id} className="flex items-center space-x-2">
                <Checkbox
                  id={method.id}
                  checked={localFilters.paymentMethods.includes(method.id)}
                  onCheckedChange={() => togglePaymentMethod(method.id)}
                />
                <Label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer">
                  <span>{method.icon}</span>
                  {method.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Type */}
        <div className="space-y-2">
          <Label>Price Type</Label>
          <Select value={localFilters.priceType} onValueChange={(value) => updateFilter("priceType", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="fixed">Fixed Price</SelectItem>
              <SelectItem value="floating">Floating Price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Amount Range */}
        <div className="space-y-3">
          <Label>Amount Range (NGN)</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-amount" className="text-xs text-muted-foreground">
                Min Amount
              </Label>
              <Input
                id="min-amount"
                type="number"
                placeholder="0"
                value={localFilters.limits.min || ""}
                onChange={(e) =>
                  updateFilter("limits", {
                    ...localFilters.limits,
                    min: Number(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="max-amount" className="text-xs text-muted-foreground">
                Max Amount
              </Label>
              <Input
                id="max-amount"
                type="number"
                placeholder="10,000,000"
                value={localFilters.limits.max || ""}
                onChange={(e) =>
                  updateFilter("limits", {
                    ...localFilters.limits,
                    max: Number(e.target.value) || 10000000,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="space-y-3">
          <Label>Minimum Completion Rate: {localFilters.completionRate}%</Label>
          <Slider
            value={[localFilters.completionRate]}
            onValueChange={(value) => updateFilter("completionRate", value[0])}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        {/* Additional Filters */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="merchant-only"
              checked={localFilters.merchantOnly}
              onCheckedChange={(checked) => updateFilter("merchantOnly", checked)}
            />
            <Label htmlFor="merchant-only">Verified Merchants Only</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="online-only"
              checked={localFilters.onlineStatus}
              onCheckedChange={(checked) => updateFilter("onlineStatus", checked)}
            />
            <Label htmlFor="online-only">Online Users Only</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
