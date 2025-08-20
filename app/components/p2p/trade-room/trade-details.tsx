"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, ExternalLink, Shield, AlertTriangle, CheckCircle, Clock, Bitcoin, DollarSign } from "lucide-react"

interface TradeDetailsProps {
  trade: {
    id: string
    amount: {
      crypto: number
      fiat: number
    }
    token: string
    side: "buy" | "sell"
    price: number
    buyer: {
      id: string
      name: string
      avatar?: string
      completionRate: number
      totalTrades: number
    }
    seller: {
      id: string
      name: string
      avatar?: string
      completionRate: number
      totalTrades: number
    }
    paymentMethod: {
      name: string
      details: {
        bankName?: string
        accountNumber?: string
        accountName?: string
      }
    }
    escrow: {
      isActive: boolean
      address?: string
      txHash?: string
    }
  }
  currentUserId: string
  onMarkPaid: () => void
  onConfirmPayment: () => void
  onDispute: () => void
  onCancel: () => void
}

export function TradeDetails({
  trade,
  currentUserId,
  onMarkPaid,
  onConfirmPayment,
  onDispute,
  onCancel,
}: TradeDetailsProps) {
  const isBuyer = trade.buyer.id === currentUserId
  const isSeller = trade.seller.id === currentUserId
  const counterparty = isBuyer ? trade.seller : trade.buyer

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {/* Trade Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bitcoin className="w-5 h-5" />
            Trade Details
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Order ID</span>
              <div className="font-mono text-xs flex items-center gap-1">
                {trade.id.slice(0, 8)}...
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0" onClick={() => copyToClipboard(trade.id)}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div>
              <span className="text-muted-foreground">Type</span>
              <div>
                <Badge variant={trade.side === "buy" ? "default" : "secondary"}>
                  {trade.side.toUpperCase()} {trade.token}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount</span>
              <div className="text-right">
                <div className="font-semibold">
                  {trade.amount.crypto} {trade.token}
                </div>
                <div className="text-sm text-muted-foreground">{formatCurrency(trade.amount.fiat)}</div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Price</span>
              <div className="font-semibold">{formatCurrency(trade.price)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Counterparty Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{isBuyer ? "Seller" : "Buyer"} Information</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={counterparty.avatar || "/placeholder.svg"} />
              <AvatarFallback>{counterparty.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{counterparty.name}</h3>
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground">
                {counterparty.completionRate}% completion • {counterparty.totalTrades} trades
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full bg-transparent">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Profile
          </Button>
        </CardContent>
      </Card>

      {/* Payment Details */}
      {isBuyer && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payment Details
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">Payment Method</span>
              <div className="font-medium">{trade.paymentMethod.name}</div>
            </div>

            {trade.paymentMethod.details.bankName && (
              <>
                <div>
                  <span className="text-sm text-muted-foreground">Bank Name</span>
                  <div className="font-medium">{trade.paymentMethod.details.bankName}</div>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Account Number</span>
                  <div className="font-mono flex items-center gap-2">
                    {trade.paymentMethod.details.accountNumber}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => copyToClipboard(trade.paymentMethod.details.accountNumber || "")}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-muted-foreground">Account Name</span>
                  <div className="font-medium">{trade.paymentMethod.details.accountName}</div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Escrow Information */}
      {trade.escrow.isActive && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Escrow Protection
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                {trade.amount.crypto} {trade.token} is secured in escrow and will be released when payment is confirmed.
              </AlertDescription>
            </Alert>

            {trade.escrow.txHash && (
              <div className="mt-3 text-sm">
                <span className="text-muted-foreground">Escrow TX: </span>
                <span className="font-mono text-xs">
                  {trade.escrow.txHash.slice(0, 10)}...
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => copyToClipboard(trade.escrow.txHash || "")}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {isBuyer && (
              <Button onClick={onMarkPaid} className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Paid
              </Button>
            )}

            {isSeller && (
              <Button onClick={onConfirmPayment} className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Payment Received
              </Button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={onDispute} className="bg-transparent">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Dispute
              </Button>

              <Button variant="destructive" onClick={onCancel}>
                <Clock className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-orange-600">Safety Tips</CardTitle>
        </CardHeader>

        <CardContent>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>• Only release crypto after confirming payment in your account</li>
            <li>• Never share your private keys or wallet passwords</li>
            <li>• Use the chat to communicate and keep records</li>
            <li>• Report suspicious activity immediately</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
