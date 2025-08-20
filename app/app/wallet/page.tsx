"use client"

import { useState } from "react"
import { WalletDashboard } from "@/components/wallet/wallet-dashboard"
import { DepositModal } from "@/components/wallet/deposit-modal"
import { WithdrawalModal } from "@/components/wallet/withdrawal-modal"

export default function WalletPage() {
  const [depositModalOpen, setDepositModalOpen] = useState(false)
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false)
  const [selectedCrypto, setSelectedCrypto] = useState("USDT")

  return (
    <div className="container mx-auto px-4 py-8">
      <WalletDashboard />

      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        selectedCrypto={selectedCrypto}
      />

      <WithdrawalModal
        isOpen={withdrawalModalOpen}
        onClose={() => setWithdrawalModalOpen(false)}
        selectedCrypto={selectedCrypto}
      />
    </div>
  )
}
