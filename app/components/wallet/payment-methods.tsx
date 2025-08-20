"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreditCard, Building2, Smartphone, Plus, Trash2, CheckCircle } from "lucide-react"

const mockPaymentMethods = [
  {
    id: "pm1",
    type: "bank_transfer",
    name: "GTBank Account",
    details: "****1234",
    verified: true,
    preferred: true,
  },
  {
    id: "pm2",
    type: "mobile_money",
    name: "Opay Wallet",
    details: "****5678",
    verified: true,
    preferred: false,
  },
  {
    id: "pm3",
    type: "bank_transfer",
    name: "Access Bank",
    details: "****9012",
    verified: false,
    preferred: false,
  },
]

const paymentMethodTypes = [
  { value: "bank_transfer", label: "Bank Transfer", icon: Building2 },
  { value: "mobile_money", label: "Mobile Money", icon: Smartphone },
  { value: "card", label: "Debit Card", icon: CreditCard },
]

export function PaymentMethods() {
  const [methods, setMethods] = useState(mockPaymentMethods)
  const [isAddingMethod, setIsAddingMethod] = useState(false)
  const [newMethod, setNewMethod] = useState({
    type: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  })

  const getMethodIcon = (type: string) => {
    const methodType = paymentMethodTypes.find((t) => t.value === type)
    const Icon = methodType?.icon || Building2
    return <Icon className="h-5 w-5" />
  }

  const handleAddMethod = () => {
    // Add new payment method logic
    console.log("Adding payment method:", newMethod)
    setIsAddingMethod(false)
    setNewMethod({ type: "", bankName: "", accountNumber: "", accountName: "" })
  }

  const handleDeleteMethod = (id: string) => {
    setMethods(methods.filter((m) => m.id !== id))
  }

  const handleSetPreferred = (id: string) => {
    setMethods(methods.map((m) => ({ ...m, preferred: m.id === id })))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Payment Methods</h2>
          <p className="text-gray-600">Manage your fiat payment methods for P2P trading</p>
        </div>
        <Dialog open={isAddingMethod} onOpenChange={setIsAddingMethod}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Method
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>Add a new payment method for P2P trading</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Payment Type</Label>
                <Select
                  value={newMethod.type}
                  onValueChange={(value) => setNewMethod((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethodTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newMethod.type === "bank_transfer" && (
                <>
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input
                      placeholder="e.g., GTBank, Access Bank"
                      value={newMethod.bankName}
                      onChange={(e) => setNewMethod((prev) => ({ ...prev, bankName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input
                      placeholder="Enter account number"
                      value={newMethod.accountNumber}
                      onChange={(e) => setNewMethod((prev) => ({ ...prev, accountNumber: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Name</Label>
                    <Input
                      placeholder="Account holder name"
                      value={newMethod.accountName}
                      onChange={(e) => setNewMethod((prev) => ({ ...prev, accountName: e.target.value }))}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3">
                <Button onClick={handleAddMethod} className="flex-1">
                  Add Method
                </Button>
                <Button variant="outline" onClick={() => setIsAddingMethod(false)} className="flex-1 bg-transparent">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {methods.map((method) => (
          <Card key={method.id} className={method.preferred ? "border-primary" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">{getMethodIcon(method.type)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{method.name}</p>
                      {method.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {method.preferred && (
                        <Badge variant="default" className="text-xs">
                          Preferred
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{method.details}</p>
                    {!method.verified && (
                      <Badge variant="destructive" className="text-xs mt-1">
                        Verification Required
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!method.preferred && method.verified && (
                    <Button variant="outline" size="sm" onClick={() => handleSetPreferred(method.id)}>
                      Set as Preferred
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleDeleteMethod(method.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
