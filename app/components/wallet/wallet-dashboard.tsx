"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, ArrowUpRight, ArrowDownLeft, Eye, EyeOff, QrCode, Shield, History, Plus } from "lucide-react"

const mockWalletData = {
  balances: [
    { symbol: "USDT", name: "Tether USD", balance: "1,245.67", usdValue: "1,245.67", change: "+2.3%" },
    { symbol: "BTC", name: "Bitcoin", balance: "0.05432", usdValue: "2,156.80", change: "+5.7%" },
    { symbol: "ETH", name: "Ethereum", balance: "0.8921", usdValue: "2,045.32", change: "-1.2%" },
  ],
  totalValue: "5,447.79",
  recentTransactions: [
    {
      id: "tx1",
      type: "deposit",
      symbol: "USDT",
      amount: "500.00",
      status: "completed",
      timestamp: "2024-01-16T10:30:00Z",
      txHash: "0x1234...5678",
    },
    {
      id: "tx2",
      type: "withdrawal",
      symbol: "BTC",
      amount: "0.01",
      status: "pending",
      timestamp: "2024-01-16T09:15:00Z",
      txHash: "0xabcd...efgh",
    },
  ],
}

export function WalletDashboard() {
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [selectedCrypto, setSelectedCrypto] = useState("USDT")

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            My Wallet
          </h1>
          <p className="text-gray-600">Manage your cryptocurrency assets</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </Button>
          <Button variant="outline" size="sm">
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>
      </div>

      {/* Total Balance Card */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Total Portfolio Value</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleBalanceVisibility}
              className="text-white hover:bg-white/20"
            >
              {balanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-3xl font-bold">{balanceVisible ? `$${mockWalletData.totalValue}` : "••••••"}</p>
            <p className="text-white/80">≈ ₦{balanceVisible ? "8,671,648" : "••••••"} NGN</p>
          </div>
        </CardContent>
      </Card>

      {/* Crypto Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockWalletData.balances.map((crypto) => (
          <Card key={crypto.symbol} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{crypto.symbol[0]}</span>
                  </div>
                  <div>
                    <p className="font-medium">{crypto.symbol}</p>
                    <p className="text-xs text-gray-500">{crypto.name}</p>
                  </div>
                </div>
                <Badge variant={crypto.change.startsWith("+") ? "default" : "destructive"} className="text-xs">
                  {crypto.change}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-lg font-bold">
                  {balanceVisible ? crypto.balance : "••••••"} {crypto.symbol}
                </p>
                <p className="text-sm text-gray-600">${balanceVisible ? crypto.usdValue : "••••••"}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1">
                  <ArrowDownLeft className="h-3 w-3 mr-1" />
                  Deposit
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start">
              <ArrowDownLeft className="h-4 w-4 mr-2" />
              Deposit Crypto
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Withdraw Crypto
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <QrCode className="h-4 w-4 mr-2" />
              Receive QR Code
            </Button>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockWalletData.recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${tx.type === "deposit" ? "bg-green-100" : "bg-blue-100"}`}>
                      {tx.type === "deposit" ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{tx.type}</p>
                      <p className="text-sm text-gray-500">
                        {tx.amount} {tx.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(tx.status)}>{tx.status}</Badge>
                    <p className="text-xs text-gray-500 mt-1">{new Date(tx.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
