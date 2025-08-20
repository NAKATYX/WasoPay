"use client"

import { useState } from "react"
import { CreateOfferForm } from "@/components/p2p/offer-creation/create-offer-form"
import { OfferDashboard } from "@/components/p2p/offer-management/offer-dashboard"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Bitcoin } from "lucide-react"
import Link from "next/link"

// Mock offers data
const MOCK_OFFERS = [
  {
    id: "offer_1",
    side: "buy" as const,
    token: "USDT",
    price: {
      amount: 1650,
      type: "fixed" as const,
    },
    limits: {
      min: 50000,
      max: 2000000,
      available: 1500,
    },
    paymentMethods: ["Bank Transfer", "OPay"],
    isActive: true,
    stats: {
      views: 245,
      orders: 12,
      completionRate: 98,
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "offer_2",
    side: "sell" as const,
    token: "BTC",
    price: {
      amount: 65500000,
      type: "floating" as const,
      spread: 0.5,
    },
    limits: {
      min: 1000000,
      max: 10000000,
      available: 0.5,
    },
    paymentMethods: ["Bank Transfer", "PalmPay", "Moniepoint"],
    isActive: false,
    stats: {
      views: 89,
      orders: 3,
      completionRate: 100,
    },
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
]

export default function PostOfferPage() {
  const [currentView, setCurrentView] = useState<"dashboard" | "create" | "edit">("dashboard")
  const [offers, setOffers] = useState(MOCK_OFFERS)
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null)

  const handleCreateOffer = () => {
    setCurrentView("create")
    setEditingOfferId(null)
  }

  const handleEditOffer = (offerId: string) => {
    setEditingOfferId(offerId)
    setCurrentView("edit")
  }

  const handleDeleteOffer = (offerId: string) => {
    setOffers((prev) => prev.filter((offer) => offer.id !== offerId))
  }

  const handleToggleOffer = (offerId: string, active: boolean) => {
    setOffers((prev) => prev.map((offer) => (offer.id === offerId ? { ...offer, isActive: active } : offer)))
  }

  const handleViewOffer = (offerId: string) => {
    console.log("Viewing offer:", offerId)
  }

  const handleSubmitOffer = (data: any) => {
    if (editingOfferId) {
      // Update existing offer
      setOffers((prev) =>
        prev.map((offer) =>
          offer.id === editingOfferId
            ? {
                ...offer,
                ...data,
                updatedAt: new Date(),
              }
            : offer,
        ),
      )
    } else {
      // Create new offer
      const newOffer = {
        id: `offer_${Date.now()}`,
        ...data,
        stats: {
          views: 0,
          orders: 0,
          completionRate: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setOffers((prev) => [newOffer, ...prev])
    }
    setCurrentView("dashboard")
  }

  const handleCancel = () => {
    setCurrentView("dashboard")
    setEditingOfferId(null)
  }

  const getEditingOffer = () => {
    if (!editingOfferId) return undefined
    return offers.find((offer) => offer.id === editingOfferId)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/p2p">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Market
              </Link>
            </Button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Bitcoin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg">WasoPay</h1>
                <p className="text-sm text-muted-foreground">
                  {currentView === "dashboard"
                    ? "Offer Management"
                    : currentView === "create"
                      ? "Create Offer"
                      : "Edit Offer"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {currentView !== "dashboard" && (
              <Button variant="outline" size="sm" onClick={handleCancel} className="bg-transparent">
                Back to Dashboard
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {currentView === "dashboard" && (
          <OfferDashboard
            offers={offers}
            onCreateOffer={handleCreateOffer}
            onEditOffer={handleEditOffer}
            onDeleteOffer={handleDeleteOffer}
            onToggleOffer={handleToggleOffer}
            onViewOffer={handleViewOffer}
          />
        )}

        {(currentView === "create" || currentView === "edit") && (
          <CreateOfferForm
            onSubmit={handleSubmitOffer}
            onCancel={handleCancel}
            initialData={getEditingOffer()}
            isEditing={currentView === "edit"}
          />
        )}
      </div>
    </div>
  )
}
