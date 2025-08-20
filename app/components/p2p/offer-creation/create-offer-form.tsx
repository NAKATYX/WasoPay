"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Calculator, Clock, DollarSign, Shield, X } from "lucide-react"

interface CreateOfferFormData {
  side: "buy" | "sell"
  token: string
  pricing: {
    mode: "fixed" | "floating"
    fixedPrice?: number
    spread?: number
  }
  limits: {
    min: number
    max: number
  }
  paymentMethods: string[]
  terms: string
  autoReply: string
  schedule: {
    isAlwaysActive: boolean
    activeHours?: Array<{
      start: string
      end: string
      days: number[]
    }>
    timezone: string
  }
  margin: number
}

interface CreateOfferFormProps {
  onSubmit: (data: CreateOfferFormData) => void
  onCancel: () => void
  initialData?: Partial<CreateOfferFormData>
  isEditing?: boolean
}

const CRYPTO_TOKENS = [
  { id: "USDT", name: "USDT", fullName: "Tether", marketPrice: 1650 },
  { id: "BTC", name: "BTC", fullName: "Bitcoin", marketPrice: 65000000 },
  { id: "ETH", name: "ETH", fullName: "Ethereum", marketPrice: 4200000 },
]

const PAYMENT_METHODS = [
  { id: "NIP_TRANSFER", name: "Bank Transfer", icon: "🏦", description: "All Nigerian banks" },
  { id: "OPAY", name: "OPay", icon: "💳", description: "OPay wallet" },
  { id: "PALMPAY", name: "PalmPay", icon: "🌴", description: "PalmPay wallet" },
  { id: "MONIEPOINT", name: "Moniepoint", icon: "💰", description: "Moniepoint agent" },
  { id: "CHIPPER", name: "Chipper Cash", icon: "🐿️", description: "Chipper Cash wallet" },
]

const DAYS_OF_WEEK = [
  { id: 0, name: "Sunday", short: "Sun" },
  { id: 1, name: "Monday", short: "Mon" },
  { id: 2, name: "Tuesday", short: "Tue" },
  { id: 3, name: "Wednesday", short: "Wed" },
  { id: 4, name: "Thursday", short: "Thu" },
  { id: 5, name: "Friday", short: "Fri" },
  { id: 6, name: "Saturday", short: "Sat" },
]

export function CreateOfferForm({ onSubmit, onCancel, initialData, isEditing = false }: CreateOfferFormProps) {
  const [formData, setFormData] = useState<CreateOfferFormData>({
    side: "buy",
    token: "USDT",
    pricing: {
      mode: "fixed",
      fixedPrice: 1650,
      spread: 0,
    },
    limits: {
      min: 50000,
      max: 1000000,
    },
    paymentMethods: [],
    terms: "",
    autoReply: "Hello! I've received your order. Please make the payment and upload proof here.",
    schedule: {
      isAlwaysActive: true,
      timezone: "Africa/Lagos",
    },
    margin: 0,
    ...initialData,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentTab, setCurrentTab] = useState("basic")

  const selectedToken = CRYPTO_TOKENS.find((token) => token.id === formData.token)
  const marketPrice = selectedToken?.marketPrice || 0

  const calculatePrice = () => {
    if (formData.pricing.mode === "fixed") {
      return formData.pricing.fixedPrice || 0
    }
    const spread = formData.pricing.spread || 0
    return marketPrice * (1 + spread / 100)
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => {
      const keys = field.split(".")
      if (keys.length === 1) {
        return { ...prev, [field]: value }
      }

      const newData = { ...prev }
      let current: any = newData
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]]
      }
      current[keys[keys.length - 1]] = value
      return newData
    })

    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const togglePaymentMethod = (methodId: string) => {
    const currentMethods = formData.paymentMethods
    const newMethods = currentMethods.includes(methodId)
      ? currentMethods.filter((id) => id !== methodId)
      : [...currentMethods, methodId]
    updateFormData("paymentMethods", newMethods)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.token) {
      newErrors.token = "Please select a cryptocurrency"
    }

    if (formData.pricing.mode === "fixed" && (!formData.pricing.fixedPrice || formData.pricing.fixedPrice <= 0)) {
      newErrors["pricing.fixedPrice"] = "Please enter a valid fixed price"
    }

    if (formData.limits.min <= 0) {
      newErrors["limits.min"] = "Minimum amount must be greater than 0"
    }

    if (formData.limits.max <= formData.limits.min) {
      newErrors["limits.max"] = "Maximum amount must be greater than minimum"
    }

    if (formData.paymentMethods.length === 0) {
      newErrors.paymentMethods = "Please select at least one payment method"
    }

    if (!formData.terms.trim()) {
      newErrors.terms = "Please enter your trading terms"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            {isEditing ? "Edit Offer" : "Create New Offer"}
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Form Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Trade Side */}
              <div className="space-y-2">
                <Label>I want to</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={formData.side === "buy" ? "default" : "outline"}
                    onClick={() => updateFormData("side", "buy")}
                    className="justify-start"
                  >
                    Buy Cryptocurrency
                  </Button>
                  <Button
                    variant={formData.side === "sell" ? "default" : "outline"}
                    onClick={() => updateFormData("side", "sell")}
                    className="justify-start"
                  >
                    Sell Cryptocurrency
                  </Button>
                </div>
              </div>

              {/* Cryptocurrency Selection */}
              <div className="space-y-2">
                <Label>Cryptocurrency</Label>
                <Select value={formData.token} onValueChange={(value) => updateFormData("token", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CRYPTO_TOKENS.map((token) => (
                      <SelectItem key={token.id} value={token.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {token.name} - {token.fullName}
                          </span>
                          <span className="text-muted-foreground ml-4">{formatCurrency(token.marketPrice)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.token && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.token}</AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Trading Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Minimum Amount (NGN)</Label>
                  <Input
                    type="number"
                    placeholder="50,000"
                    value={formData.limits.min || ""}
                    onChange={(e) => updateFormData("limits.min", Number(e.target.value))}
                  />
                  {errors["limits.min"] && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors["limits.min"]}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Maximum Amount (NGN)</Label>
                  <Input
                    type="number"
                    placeholder="1,000,000"
                    value={formData.limits.max || ""}
                    onChange={(e) => updateFormData("limits.max", Number(e.target.value))}
                  />
                  {errors["limits.max"] && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors["limits.max"]}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-2">
                <Label>Trading Terms</Label>
                <Textarea
                  placeholder="Enter your trading terms and conditions..."
                  value={formData.terms}
                  onChange={(e) => updateFormData("terms", e.target.value)}
                  rows={4}
                />
                {errors.terms && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.terms}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Pricing Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pricing Mode */}
              <div className="space-y-2">
                <Label>Pricing Mode</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={formData.pricing.mode === "fixed" ? "default" : "outline"}
                    onClick={() => updateFormData("pricing.mode", "fixed")}
                    className="justify-start"
                  >
                    Fixed Price
                  </Button>
                  <Button
                    variant={formData.pricing.mode === "floating" ? "default" : "outline"}
                    onClick={() => updateFormData("pricing.mode", "floating")}
                    className="justify-start"
                  >
                    Floating Price
                  </Button>
                </div>
              </div>

              {/* Market Price Display */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Market Price</span>
                  <span className="font-semibold">{formatCurrency(marketPrice)}</span>
                </div>
              </div>

              {/* Fixed Price */}
              {formData.pricing.mode === "fixed" && (
                <div className="space-y-2">
                  <Label>Fixed Price (NGN)</Label>
                  <Input
                    type="number"
                    placeholder="1,650"
                    value={formData.pricing.fixedPrice || ""}
                    onChange={(e) => updateFormData("pricing.fixedPrice", Number(e.target.value))}
                  />
                  {errors["pricing.fixedPrice"] && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors["pricing.fixedPrice"]}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Floating Price */}
              {formData.pricing.mode === "floating" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Price Spread: {formData.pricing.spread}%</Label>
                    <Slider
                      value={[formData.pricing.spread || 0]}
                      onValueChange={(value) => updateFormData("pricing.spread", value[0])}
                      min={-10}
                      max={10}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>-10% (Below market)</span>
                      <span>+10% (Above market)</span>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Your Price</span>
                      <span className="font-semibold">{formatCurrency(calculatePrice())}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Profit Margin */}
              <div className="space-y-2">
                <Label>Profit Margin: {formData.margin}%</Label>
                <Slider
                  value={[formData.margin]}
                  onValueChange={(value) => updateFormData("margin", value[0])}
                  min={0}
                  max={20}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0% (No profit)</span>
                  <span>20% (Maximum)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      formData.paymentMethods.includes(method.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => togglePaymentMethod(method.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <h4 className="font-medium">{method.name}</h4>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </div>
                      <Checkbox
                        checked={formData.paymentMethods.includes(method.id)}
                        onChange={() => togglePaymentMethod(method.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {errors.paymentMethods && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.paymentMethods}</AlertDescription>
                </Alert>
              )}

              {formData.paymentMethods.length > 0 && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Selected Payment Methods</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.paymentMethods.map((methodId) => {
                      const method = PAYMENT_METHODS.find((m) => m.id === methodId)
                      return (
                        <Badge key={methodId} variant="secondary" className="flex items-center gap-1">
                          {method?.icon} {method?.name}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => togglePaymentMethod(methodId)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Auto Reply */}
              <div className="space-y-2">
                <Label>Auto Reply Message</Label>
                <Textarea
                  placeholder="Enter an automatic message sent to buyers..."
                  value={formData.autoReply}
                  onChange={(e) => updateFormData("autoReply", e.target.value)}
                  rows={3}
                />
              </div>

              {/* Schedule */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Always Active</Label>
                  <Switch
                    checked={formData.schedule.isAlwaysActive}
                    onCheckedChange={(checked) => updateFormData("schedule.isAlwaysActive", checked)}
                  />
                </div>

                {!formData.schedule.isAlwaysActive && (
                  <div className="space-y-4 border rounded-lg p-4">
                    <h4 className="font-medium">Active Hours</h4>
                    <p className="text-sm text-muted-foreground">Set specific hours when your offer should be active</p>

                    <div className="grid grid-cols-7 gap-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <Button key={day.id} variant="outline" size="sm" className="text-xs bg-transparent">
                          {day.short}
                        </Button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Time</Label>
                        <Input type="time" defaultValue="09:00" />
                      </div>
                      <div>
                        <Label>End Time</Label>
                        <Input type="time" defaultValue="18:00" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select
                  value={formData.schedule.timezone}
                  onValueChange={(value) => updateFormData("schedule.timezone", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Lagos">West Africa Time (WAT)</SelectItem>
                    <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Offer Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant={formData.side === "buy" ? "default" : "secondary"}>
                {formData.side.toUpperCase()} {formData.token}
              </Badge>
              <span className="font-semibold">{formatCurrency(calculatePrice())}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Limits: {formatCurrency(formData.limits.min)} - {formatCurrency(formData.limits.max)}
            </div>
            <div className="text-sm text-muted-foreground">
              Payment:{" "}
              {formData.paymentMethods.map((id) => PAYMENT_METHODS.find((m) => m.id === id)?.name).join(", ") ||
                "None selected"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={handleSubmit} className="flex-1">
          <Shield className="w-4 h-4 mr-2" />
          {isEditing ? "Update Offer" : "Create Offer"}
        </Button>
        <Button variant="outline" onClick={onCancel} className="bg-transparent">
          Cancel
        </Button>
      </div>
    </div>
  )
}
