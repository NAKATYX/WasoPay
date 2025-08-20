"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, QrCode, AlertTriangle, CheckCircle } from "lucide-react"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCrypto?: string
}

const cryptoNetworks = {
  USDT: [
    { name: "Ethereum (ERC-20)", fee: "5 USDT", time: "5-10 min" },
    { name: "Tron (TRC-20)", fee: "1 USDT", time: "1-3 min" },
    { name: "BSC (BEP-20)", fee: "0.5 USDT", time: "1-3 min" },
  ],
  BTC: [{ name: "Bitcoin Network", fee: "0.0005 BTC", time: "10-30 min" }],
  ETH: [{ name: "Ethereum Network", fee: "0.005 ETH", time: "5-10 min" }],
}

export function DepositModal({ isOpen, onClose, selectedCrypto = "USDT" }: DepositModalProps) {
  const [selectedNetwork, setSelectedNetwork] = useState("")
  const [depositAddress] = useState("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa")
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(depositAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const networks = cryptoNetworks[selectedCrypto as keyof typeof cryptoNetworks] || []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit {selectedCrypto}</DialogTitle>
          <DialogDescription>Send {selectedCrypto} to your WasoPay wallet</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Network Selection */}
          <div className="space-y-2">
            <Label>Select Network</Label>
            <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
              <SelectTrigger>
                <SelectValue placeholder="Choose network" />
              </SelectTrigger>
              <SelectContent>
                {networks.map((network, index) => (
                  <SelectItem key={index} value={network.name}>
                    <div className="flex items-center justify-between w-full">
                      <span>{network.name}</span>
                      <div className="text-xs text-gray-500 ml-2">
                        Fee: {network.fee} • {network.time}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedNetwork && (
            <>
              {/* QR Code */}
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">Scan QR code to deposit</p>
                </CardContent>
              </Card>

              {/* Deposit Address */}
              <div className="space-y-2">
                <Label>Deposit Address</Label>
                <div className="flex gap-2">
                  <Input value={depositAddress} readOnly className="font-mono text-sm" />
                  <Button variant="outline" size="sm" onClick={copyAddress}>
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Important Notes */}
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="space-y-2">
                      <p className="font-medium text-yellow-800">Important Notes:</p>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Only send {selectedCrypto} to this address</li>
                        <li>• Minimum deposit: 10 {selectedCrypto}</li>
                        <li>• Deposits require 3 network confirmations</li>
                        <li>• Wrong network deposits may result in permanent loss</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Network Info */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Network Fee:</span>
                <Badge variant="outline">{networks.find((n) => n.name === selectedNetwork)?.fee}</Badge>
              </div>
            </>
          )}

          <Button onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
