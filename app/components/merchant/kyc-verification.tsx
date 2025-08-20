"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, CheckCircle, Clock, XCircle, FileText, Shield, AlertCircle } from "lucide-react"

export enum KYCLevel {
  UNVERIFIED = 0,
  BASIC = 1,
  STANDARD = 2,
  ENHANCED = 3,
  INSTITUTIONAL = 4,
}

interface VerificationDocument {
  type: "NATIONAL_ID" | "PASSPORT" | "DRIVERS_LICENSE" | "UTILITY_BILL" | "BANK_STATEMENT" | "BUSINESS_REG"
  status: "pending" | "approved" | "rejected"
  uploadedAt: Date
  reviewedAt?: Date
  rejectionReason?: string
  fileUrl?: string
}

interface KYCVerificationProps {
  currentLevel: KYCLevel
  documents: VerificationDocument[]
  onDocumentUpload: (type: string, file: File) => void
  onSubmitForReview: () => void
}

const KYC_LEVELS = {
  [KYCLevel.UNVERIFIED]: {
    name: "Unverified",
    description: "Basic account access",
    color: "bg-gray-500",
    requirements: [],
    benefits: ["Browse offers", "Basic chat access"],
    limits: "No trading allowed",
  },
  [KYCLevel.BASIC]: {
    name: "Basic",
    description: "Email and phone verified",
    color: "bg-blue-500",
    requirements: ["Email verification", "Phone verification"],
    benefits: ["Trade up to ₦100,000/day", "Create basic offers"],
    limits: "₦100,000 daily limit",
  },
  [KYCLevel.STANDARD]: {
    name: "Standard",
    description: "ID document verified",
    color: "bg-green-500",
    requirements: ["Basic verification", "Government ID", "Selfie verification"],
    benefits: ["Trade up to ₦1,000,000/day", "Merchant badge eligible"],
    limits: "₦1,000,000 daily limit",
  },
  [KYCLevel.ENHANCED]: {
    name: "Enhanced",
    description: "Full identity verification",
    color: "bg-purple-500",
    requirements: ["Standard verification", "Proof of address", "Bank verification"],
    benefits: ["Trade up to ₦10,000,000/day", "Priority support", "Advanced features"],
    limits: "₦10,000,000 daily limit",
  },
  [KYCLevel.INSTITUTIONAL]: {
    name: "Institutional",
    description: "Business account verification",
    color: "bg-orange-500",
    requirements: ["Enhanced verification", "Business registration", "Tax documents"],
    benefits: ["Unlimited trading", "API access", "Dedicated support"],
    limits: "No limits",
  },
}

const DOCUMENT_TYPES = {
  NATIONAL_ID: { name: "National ID Card", icon: FileText, required: [KYCLevel.STANDARD] },
  PASSPORT: { name: "International Passport", icon: FileText, required: [KYCLevel.STANDARD] },
  DRIVERS_LICENSE: { name: "Driver's License", icon: FileText, required: [KYCLevel.STANDARD] },
  UTILITY_BILL: { name: "Utility Bill", icon: FileText, required: [KYCLevel.ENHANCED] },
  BANK_STATEMENT: { name: "Bank Statement", icon: FileText, required: [KYCLevel.ENHANCED] },
  BUSINESS_REG: { name: "Business Registration", icon: FileText, required: [KYCLevel.INSTITUTIONAL] },
}

export function KYCVerification({
  currentLevel,
  documents,
  onDocumentUpload,
  onSubmitForReview,
}: KYCVerificationProps) {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null)

  const getDocumentStatus = (type: string) => {
    return documents.find((doc) => doc.type === (type as any))
  }

  const handleFileUpload = async (type: string, file: File) => {
    setUploadingDoc(type)
    try {
      await onDocumentUpload(type, file)
    } finally {
      setUploadingDoc(null)
    }
  }

  const getNextLevel = () => {
    return Math.min(currentLevel + 1, KYCLevel.INSTITUTIONAL)
  }

  const canUpgradeToLevel = (level: KYCLevel) => {
    return level <= currentLevel + 1
  }

  const getProgressPercentage = () => {
    return (currentLevel / KYCLevel.INSTITUTIONAL) * 100
  }

  const renderDocumentUpload = (docType: string) => {
    const docConfig = DOCUMENT_TYPES[docType as keyof typeof DOCUMENT_TYPES]
    const docStatus = getDocumentStatus(docType)
    const Icon = docConfig.icon

    return (
      <Card key={docType} className="relative">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Icon className="w-5 h-5 text-muted-foreground" />
              <h4 className="font-medium">{docConfig.name}</h4>
            </div>

            {docStatus && (
              <Badge
                variant={
                  docStatus.status === "approved"
                    ? "default"
                    : docStatus.status === "rejected"
                      ? "destructive"
                      : "secondary"
                }
              >
                {docStatus.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                {docStatus.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                {docStatus.status === "rejected" && <XCircle className="w-3 h-3 mr-1" />}
                {docStatus.status.charAt(0).toUpperCase() + docStatus.status.slice(1)}
              </Badge>
            )}
          </div>

          {docStatus?.status === "rejected" && docStatus.rejectionReason && (
            <Alert variant="destructive" className="mb-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{docStatus.rejectionReason}</AlertDescription>
            </Alert>
          )}

          {!docStatus || docStatus.status === "rejected" ? (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                Upload a clear photo of your {docConfig.name.toLowerCase()}
              </p>
              <Button
                size="sm"
                disabled={uploadingDoc === docType}
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept = "image/*,.pdf"
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) handleFileUpload(docType, file)
                  }
                  input.click()
                }}
              >
                {uploadingDoc === docType ? "Uploading..." : "Choose File"}
              </Button>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Document uploaded</p>
                  <p className="text-xs text-muted-foreground">{docStatus.uploadedAt.toLocaleDateString()}</p>
                </div>
                {docStatus.status === "approved" && <CheckCircle className="w-5 h-5 text-green-600" />}
                {docStatus.status === "pending" && <Clock className="w-5 h-5 text-yellow-600" />}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            KYC Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Badge className={`${KYC_LEVELS[currentLevel].color} text-white`}>
                {KYC_LEVELS[currentLevel].name} Level
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">{KYC_LEVELS[currentLevel].description}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{currentLevel}</p>
              <p className="text-xs text-muted-foreground">/ {KYCLevel.INSTITUTIONAL}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Verification Progress</span>
              <span>{Math.round(getProgressPercentage())}%</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Current Benefits</h4>
              <ul className="space-y-1 text-muted-foreground">
                {KYC_LEVELS[currentLevel].benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Current Limits</h4>
              <p className="text-muted-foreground">{KYC_LEVELS[currentLevel].limits}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="upgrade">Upgrade</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Verification Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(KYC_LEVELS).map(([level, config]) => {
                  const levelNum = Number(level)
                  const isCurrentLevel = levelNum === currentLevel
                  const isCompleted = levelNum < currentLevel

                  return (
                    <div
                      key={level}
                      className={`border rounded-lg p-4 ${
                        isCurrentLevel
                          ? "border-primary bg-primary/5"
                          : isCompleted
                            ? "border-green-200 bg-green-50"
                            : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`${config.color} text-white`}>{config.name}</Badge>
                          {isCompleted && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {isCurrentLevel && <Clock className="w-4 h-4 text-primary" />}
                        </div>
                        <span className="text-sm text-muted-foreground">Level {level}</span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{config.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <h5 className="font-medium mb-1">Requirements</h5>
                          <ul className="space-y-1 text-muted-foreground">
                            {config.requirements.map((req, index) => (
                              <li key={index}>• {req}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-1">Benefits</h5>
                          <ul className="space-y-1 text-muted-foreground">
                            {config.benefits.map((benefit, index) => (
                              <li key={index}>• {benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(DOCUMENT_TYPES).map((docType) => renderDocumentUpload(docType))}
          </div>
        </TabsContent>

        <TabsContent value="upgrade" className="space-y-4">
          {currentLevel < KYCLevel.INSTITUTIONAL ? (
            <Card>
              <CardHeader>
                <CardTitle>Upgrade to {KYC_LEVELS[getNextLevel()].name} Level</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Next Level Benefits</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {KYC_LEVELS[getNextLevel()].benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Required Documents</h4>
                  {Object.entries(DOCUMENT_TYPES)
                    .filter(([_, config]) => config.required.includes(getNextLevel()))
                    .map(([docType, config]) => {
                      const docStatus = getDocumentStatus(docType)
                      return (
                        <div key={docType} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">{config.name}</span>
                          {docStatus?.status === "approved" ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                </div>

                <Button onClick={onSubmitForReview} className="w-full">
                  Submit for Review
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Maximum Verification Achieved</h3>
                <p className="text-muted-foreground">
                  You have reached the highest verification level with unlimited trading access.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
