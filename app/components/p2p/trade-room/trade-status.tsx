"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

export type TradeStatus =
  | "pending_payment"
  | "payment_made"
  | "payment_confirmed"
  | "completed"
  | "disputed"
  | "cancelled"
  | "expired"

interface TradeStatusProps {
  status: TradeStatus
  deadline?: Date
  escrowActive: boolean
  currentStep: number
  totalSteps: number
}

const STATUS_CONFIG = {
  pending_payment: {
    label: "Waiting for Payment",
    color: "bg-yellow-500",
    icon: Clock,
    description: "Buyer needs to make payment",
  },
  payment_made: {
    label: "Payment Made",
    color: "bg-blue-500",
    icon: Shield,
    description: "Waiting for seller confirmation",
  },
  payment_confirmed: {
    label: "Payment Confirmed",
    color: "bg-green-500",
    icon: CheckCircle,
    description: "Releasing crypto from escrow",
  },
  completed: {
    label: "Trade Completed",
    color: "bg-green-600",
    icon: CheckCircle,
    description: "Trade successful",
  },
  disputed: {
    label: "Under Dispute",
    color: "bg-red-500",
    icon: AlertTriangle,
    description: "Support team reviewing",
  },
  cancelled: {
    label: "Trade Cancelled",
    color: "bg-gray-500",
    icon: XCircle,
    description: "Trade was cancelled",
  },
  expired: {
    label: "Trade Expired",
    color: "bg-red-600",
    icon: XCircle,
    description: "Payment deadline passed",
  },
}

export function TradeStatus({ status, deadline, escrowActive, currentStep, totalSteps }: TradeStatusProps) {
  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  const getTimeRemaining = () => {
    if (!deadline) return null

    const now = new Date()
    const timeLeft = deadline.getTime() - now.getTime()

    if (timeLeft <= 0) return "Expired"

    const minutes = Math.floor(timeLeft / (1000 * 60))
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m remaining`
    }
    return `${minutes}m remaining`
  }

  const progressPercentage = (currentStep / totalSteps) * 100

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="w-5 h-5" />
          Trade Status
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${config.color}`} />
            {config.label}
          </Badge>
          {escrowActive && (
            <Badge variant="outline" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Escrow Active
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground">{config.description}</p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {currentStep}/{totalSteps}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Countdown Timer */}
        {deadline && status === "pending_payment" && (
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="font-medium">Payment Deadline</span>
            </div>
            <div className="text-lg font-bold text-orange-600 mt-1">{getTimeRemaining()}</div>
          </div>
        )}

        {/* Trade Steps */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Trade Steps</h4>
          <div className="space-y-1 text-xs">
            <div
              className={`flex items-center gap-2 ${currentStep >= 1 ? "text-foreground" : "text-muted-foreground"}`}
            >
              <div className={`w-2 h-2 rounded-full ${currentStep >= 1 ? "bg-primary" : "bg-muted"}`} />
              Order Created
            </div>
            <div
              className={`flex items-center gap-2 ${currentStep >= 2 ? "text-foreground" : "text-muted-foreground"}`}
            >
              <div className={`w-2 h-2 rounded-full ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`} />
              Payment Made
            </div>
            <div
              className={`flex items-center gap-2 ${currentStep >= 3 ? "text-foreground" : "text-muted-foreground"}`}
            >
              <div className={`w-2 h-2 rounded-full ${currentStep >= 3 ? "bg-primary" : "bg-muted"}`} />
              Payment Confirmed
            </div>
            <div
              className={`flex items-center gap-2 ${currentStep >= 4 ? "text-foreground" : "text-muted-foreground"}`}
            >
              <div className={`w-2 h-2 rounded-full ${currentStep >= 4 ? "bg-primary" : "bg-muted"}`} />
              Trade Completed
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
