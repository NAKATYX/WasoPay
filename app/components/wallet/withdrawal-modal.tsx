"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Shield } from "lucide-react"

interface WithdrawalModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCrypto?: string
  availableBalance?: string
}

export function WithdrawalModal({
  isOpen,
  onClose,
  selectedCrypto = "USDT",
  availableBalance = "1,245.67",
}: WithdrawalModalProps) {
  const [withdrawalData, setWithdrawalData] = useState({
    address: "",
    amount: "",
    network: "",
    twoFactorCode: "",
  })

  const [step, setStep] = useState(1) // 1: Form, 2: Confirmation, 3: 2FA

  const networks = {
    USDT: ["Ethereum (ERC-20)", "Tron (TRC-20)", "BSC (BEP-20)"],
    BTC: ["Bitcoin Network"],
    ETH: ["Ethereum Network"],
  }

  const networkFees = {
    "Ethereum (ERC-20)": "5 USDT",
    "Tron (TRC-20)": "1 USDT",
    "BSC (BEP-20)": "0.5 USDT",
    "Bitcoin Network": "0.0005 BTC",
    "Ethereum Network": "0.005 ETH",
  }

  const handleSubmit = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else {
      // Process withdrawal
      console.log("Processing withdrawal:", withdrawalData)
      onClose()
    }
  }

  const calculateReceiveAmount = () => {
    const amount = Number.parseFloat(withdrawalData.amount) || 0
    const fee = Number.parseFloat(networkFees[withdrawalData.network as keyof typeof networkFees]?.split(" ")[0] || "0")
    return Math.max(0, amount - fee).toFixed(6)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw {selectedCrypto}</DialogTitle>
          <DialogDescription>
            {step === 1 && "Enter withdrawal details"}
            {step === 2 && "Confirm withdrawal details"}
            {step === 3 && "Enter 2FA code to complete"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {step === 1 && (
            <>
              {/* Network Selection */}
              <div className="space-y-2">
                <Label>Network</Label>
                <Select
                  value={withdrawalData.network}
                  onValueChange={(value) => setWithdrawalData((prev) => ({ ...prev, network: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    {networks[selectedCrypto as keyof typeof networks]?.map((network) => (
                      <SelectItem key={network} value={network}>
                        {network}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Withdrawal Address */}
              <div className="space-y-2">
                <Label>Withdrawal Address</Label>
                <Input
                  placeholder="Enter destination address"
                  value={withdrawalData.address}
                  onChange={(e) => setWithdrawalData((prev) => ({ ...prev, address: e.target.value }))}
                  className="font-mono text-sm"
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Amount</Label>
                  <span className="text-sm text-gray-500">
                    Available: {availableBalance} {selectedCrypto}
                  </span>
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={withdrawalData.amount}
                    onChange={(e) => setWithdrawalData((prev) => ({ ...prev, amount: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs"
                    onClick={() => setWithdrawalData((prev) => ({ ...prev, amount: availableBalance }))}
                  >
                    MAX
                  </Button>
                </div>
              </div>

              {/* Fee Information */}
              {withdrawalData.network && (
                <Card className="bg-gray-50">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Network Fee:</span>
                      <span>{networkFees[withdrawalData.network as keyof typeof networkFees]}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>You will receive:</span>
                      <span className="font-medium">
                        {calculateReceiveAmount()} {selectedCrypto}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {step === 2 && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-medium">Confirm Withdrawal</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network:</span>
                    <span>{withdrawalData.network}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-mono text-xs">
                      {withdrawalData.address.slice(0, 10)}...{withdrawalData.address.slice(-10)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span>
                      {withdrawalData.amount} {selectedCrypto}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fee:</span>
                    <span>{networkFees[withdrawalData.network as keyof typeof networkFees]}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>You will receive:</span>
                    <span>
                      {calculateReceiveAmount()} {selectedCrypto}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-blue-800">Enter your 2FA code to complete the withdrawal</p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label>2FA Code</Label>
                <Input
                  placeholder="Enter 6-digit code"
                  value={withdrawalData.twoFactorCode}
                  onChange={(e) => setWithdrawalData((prev) => ({ ...prev, twoFactorCode: e.target.value }))}
                  maxLength={6}
                />
              </div>
            </div>
          )}

          {/* Warning */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium mb-1">Important:</p>
                  <p>Double-check the address and network. Incorrect details may result in permanent loss of funds.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 bg-transparent">
                Back
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={
                (step === 1 && (!withdrawalData.address || !withdrawalData.amount || !withdrawalData.network)) ||
                (step === 3 && withdrawalData.twoFactorCode.length !== 6)
              }
            >
              {step === 1 && "Continue"}
              {step === 2 && "Confirm"}
              {step === 3 && "Complete Withdrawal"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
