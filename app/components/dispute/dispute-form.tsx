"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, ImageIcon, AlertTriangle } from "lucide-react"

interface DisputeFormProps {
  orderId: string
  onSubmit: (data: any) => void
}

export function DisputeForm({ orderId, onSubmit }: DisputeFormProps) {
  const [formData, setFormData] = useState({
    category: "",
    description: "",
    evidence: [] as File[],
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        evidence: [...prev.evidence, ...Array.from(e.target.files!)],
      }))
    }
  }

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      evidence: prev.evidence.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          File a Dispute
        </CardTitle>
        <CardDescription>Order ID: {orderId} - Please provide detailed information about your dispute</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Dispute Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select dispute category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payment_not_received">Payment Not Received</SelectItem>
                <SelectItem value="payment_not_sent">Payment Not Sent</SelectItem>
                <SelectItem value="wrong_amount">Wrong Amount</SelectItem>
                <SelectItem value="fake_payment_proof">Fake Payment Proof</SelectItem>
                <SelectItem value="account_issues">Account Issues</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              placeholder="Please provide a detailed explanation of the issue, including timeline and any relevant information..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Evidence (Screenshots, Documents, etc.)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">Upload evidence to support your dispute</p>
              <Input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="evidence-upload"
              />
              <Label htmlFor="evidence-upload" className="cursor-pointer">
                <Button type="button" variant="outline" size="sm">
                  Choose Files
                </Button>
              </Label>
            </div>

            {formData.evidence.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploaded Files:</p>
                {formData.evidence.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {file.type.startsWith("image/") ? (
                        <ImageIcon className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Disputes are reviewed within 24-48 hours</li>
              <li>• Provide clear evidence to support your claim</li>
              <li>• False disputes may result in account penalties</li>
              <li>• Both parties will be notified of the dispute</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1" disabled={!formData.category || !formData.description}>
              Submit Dispute
            </Button>
            <Button type="button" variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
