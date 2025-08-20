"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Zap, Info } from "lucide-react"

interface ExchangeRates {
  [key: string]: {
    [key: string]: number
  }
}

const EXCHANGE_RATES: ExchangeRates = {
  USD: {
    BTC: 0.000023,
    ETH: 0.000307,
    USDT: 1,
    NGN: 1652,
    USDC: 1.01, // Added USDC exchange rates
  },
  NGN: {
    BTC: 0.000000014,
    ETH: 0.000000186,
    USDT: 0.000605,
    USD: 0.000605,
    USDC: 0.000611, // Added USDC exchange rates
  },
  BTC: {
    USD: 43500,
    NGN: 71862000,
    ETH: 13.37,
    USDT: 43500,
    USDC: 44000, // Added USDC exchange rates
  },
  ETH: {
    USD: 3250.5,
    NGN: 5370826,
    BTC: 0.0748,
    USDT: 3250.5,
    USDC: 3283.05, // Added USDC exchange rates
  },
  USDT: {
    USD: 1,
    NGN: 1652,
    BTC: 0.000023,
    ETH: 0.000307,
    USDC: 1.01, // Added USDC exchange rates
  },
  USDC: {
    USD: 0.99, // Added USDC exchange rates
    NGN: 1635.65, // Added USDC exchange rates
    BTC: 0.000023, // Added USDC exchange rates
    ETH: 0.000299, // Added USDC exchange rates
    USDT: 0.99, // Added USDC exchange rates
  },
}

const CURRENCIES = [
  { value: "USD", label: "USD", symbol: "$" },
  { value: "NGN", label: "NGN", symbol: "₦" },
  { value: "USDC", label: "USDC", symbol: "$" }, // Added USDC to the currency options
  { value: "BTC", label: "BTC", symbol: "₿" },
  { value: "ETH", label: "ETH", symbol: "Ξ" },
  { value: "USDT", label: "USDT", symbol: "₮" },
]

export function ExpressTrading() {
  const [payAmount, setPayAmount] = useState("0.00")
  const [payCurrency, setPayCurrency] = useState("USD")
  const [receiveCurrency, setReceiveCurrency] = useState("ETH")
  const [receiveAmount, setReceiveAmount] = useState("0.000000")
  const [isLoading, setIsLoading] = useState(false)

  // Calculate exchange rate and amounts
  useEffect(() => {
    if (payAmount && !isNaN(Number(payAmount)) && Number(payAmount) > 0) {
      const rate = EXCHANGE_RATES[payCurrency]?.[receiveCurrency] || 0
      const calculated = (Number(payAmount) * rate).toFixed(6)
      setReceiveAmount(calculated)
    } else {
      setReceiveAmount("0.000000")
    }
  }, [payAmount, payCurrency, receiveCurrency])

  const handleSwapCurrencies = () => {
    const tempCurrency = payCurrency
    const tempAmount = payAmount

    setPayCurrency(receiveCurrency)
    setReceiveCurrency(tempCurrency)
    setPayAmount(receiveAmount)
    setReceiveAmount(tempAmount)
  }

  const handleInstantTrade = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Handle successful trade
      console.log(`Trading ${payAmount} ${payCurrency} for ${receiveAmount} ${receiveCurrency}`)
    }, 2000)
  }

  const exchangeRate = EXCHANGE_RATES[receiveCurrency]?.[payCurrency] || 0
  const fee = 0.5 // 0.5% fee
  const paySymbol = CURRENCIES.find((c) => c.value === payCurrency)?.symbol || ""
  const receiveSymbol = CURRENCIES.find((c) => c.value === receiveCurrency)?.symbol || ""

  return (
    <Card className="w-full max-w-md mx-auto bg-slate-900 border-slate-800 text-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <Zap className="w-5 h-5 text-cyan-400" />
          Express Buy/Sell
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* You Pay Section */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400">You Pay</label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-slate-800 border-slate-700 text-white text-lg font-medium"
            />
            <Select value={payCurrency} onValueChange={setPayCurrency}>
              <SelectTrigger className="w-24 bg-slate-800 border-cyan-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value} className="text-white hover:bg-slate-700">
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSwapCurrencies}
            className="rounded-full p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700"
          >
            <ArrowUpDown className="w-4 h-4 text-cyan-400" />
          </Button>
        </div>

        {/* You Receive Section */}
        <div className="space-y-2">
          <label className="text-sm text-slate-400">You Receive</label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={receiveAmount}
              readOnly
              className="flex-1 bg-slate-800 border-slate-700 text-white text-lg font-medium"
            />
            <Select value={receiveCurrency} onValueChange={setReceiveCurrency}>
              <SelectTrigger className="w-24 bg-slate-800 border-slate-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value} className="text-white hover:bg-slate-700">
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Rate and Fee Info */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Rate</span>
            <span className="text-white font-medium">
              1 {receiveCurrency} = {paySymbol}
              {exchangeRate.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-1">
              Fee
              <Info className="w-3 h-3" />
            </span>
            <span className="text-white font-medium">{fee}%</span>
          </div>
        </div>

        {/* Trade Button */}
        <Button
          onClick={handleInstantTrade}
          disabled={isLoading || !payAmount || Number(payAmount) <= 0}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 rounded-lg disabled:opacity-50"
        >
          <Zap className="w-4 h-4 mr-2" />
          {isLoading ? "Processing..." : `Buy ${receiveCurrency} Instantly`}
        </Button>

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 text-center">
          Express trades are executed instantly at market rates with a {fee}% service fee.
        </p>
      </CardContent>
    </Card>
  )
}
