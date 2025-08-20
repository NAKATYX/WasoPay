import { AdminDisputePanel } from "@/components/dispute/admin-dispute-panel"

export default function AdminDisputesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dispute Management</h1>
        <p className="text-gray-600">Review and resolve user disputes</p>
      </div>
      <AdminDisputePanel />
    </div>
  )
}
