"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle, User, FileText, MessageSquare, Gavel } from "lucide-react"

interface DisputeCase {
  id: string
  orderId: string
  category: string
  status: string
  priority: string
  plaintiff: string
  defendant: string
  amount: string
  crypto: string
  createdAt: string
  evidence: string[]
  description: string
  chatHistory: any[]
}

const mockDisputeCases: DisputeCase[] = [
  {
    id: "DSP001",
    orderId: "ORD123456",
    category: "Payment Not Received",
    status: "under_review",
    priority: "high",
    plaintiff: "buyer_mike",
    defendant: "merchant_john",
    amount: "50,000 NGN",
    crypto: "45.2 USDT",
    createdAt: "2024-01-15T10:30:00Z",
    evidence: ["payment_screenshot.jpg", "bank_statement.pdf"],
    description:
      "I sent the payment 2 hours ago but the seller claims they haven't received it. I have provided bank transfer receipt as evidence.",
    chatHistory: [],
  },
]

export function AdminDisputePanel() {
  const [selectedCase, setSelectedCase] = useState<DisputeCase | null>(null)
  const [resolution, setResolution] = useState("")
  const [resolutionType, setResolutionType] = useState("")

  const handleResolveDispute = () => {
    if (!selectedCase || !resolutionType || !resolution) return

    // Handle dispute resolution
    console.log("Resolving dispute:", {
      caseId: selectedCase.id,
      type: resolutionType,
      resolution,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "under_review":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cases List */}
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Dispute Cases
            </CardTitle>
            <CardDescription>Active disputes requiring review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockDisputeCases.map((disputeCase) => (
              <div
                key={disputeCase.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedCase?.id === disputeCase.id ? "border-primary bg-primary/5" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedCase(disputeCase)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">#{disputeCase.id}</span>
                  <div className="flex gap-1">
                    <Badge className={getStatusColor(disputeCase.status)} size="sm">
                      {disputeCase.status.replace("_", " ")}
                    </Badge>
                    <Badge className={getPriorityColor(disputeCase.priority)} size="sm">
                      {disputeCase.priority}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{disputeCase.category}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {disputeCase.amount} • {new Date(disputeCase.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Case Details */}
      <div className="lg:col-span-2">
        {selectedCase ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Dispute #{selectedCase.id}</CardTitle>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(selectedCase.status)}>
                      {selectedCase.status.replace("_", " ")}
                    </Badge>
                    <Badge className={getPriorityColor(selectedCase.priority)}>{selectedCase.priority} Priority</Badge>
                  </div>
                </div>
                <CardDescription>
                  Order: {selectedCase.orderId} • Category: {selectedCase.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Plaintiff</p>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{selectedCase.plaintiff}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Defendant</p>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{selectedCase.defendant}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Amount</p>
                    <p>
                      {selectedCase.amount} ({selectedCase.crypto})
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Created</p>
                    <p>{new Date(selectedCase.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedCase.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Evidence ({selectedCase.evidence.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedCase.evidence.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm">{file}</span>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resolution Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Resolve Dispute</CardTitle>
                <CardDescription>Make a decision on this dispute case</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Resolution Type</label>
                  <Select value={resolutionType} onValueChange={setResolutionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resolution type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="favor_plaintiff">Rule in favor of plaintiff</SelectItem>
                      <SelectItem value="favor_defendant">Rule in favor of defendant</SelectItem>
                      <SelectItem value="partial_refund">Partial refund</SelectItem>
                      <SelectItem value="full_refund">Full refund</SelectItem>
                      <SelectItem value="dismiss">Dismiss case</SelectItem>
                      <SelectItem value="escalate">Escalate to senior moderator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Resolution Details</label>
                  <Textarea
                    placeholder="Provide detailed explanation of the resolution and reasoning..."
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleResolveDispute} disabled={!resolutionType || !resolution} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Resolve Dispute
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Parties
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a dispute case to view details</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
