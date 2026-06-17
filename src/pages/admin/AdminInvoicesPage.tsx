import { TransactionHistory } from "../../components/Admin/AdminTokenPlans/components/TransactionHistory";

export default function AdminInvoicesPage() {
  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <div className="mb-4">
        <h1 className="text-xl font-extrabold text-gray-900">Invoices</h1>
        <p className="text-sm text-gray-500 mt-0.5">Complete transaction and payment history.</p>
      </div>
      <TransactionHistory />
    </div>
  );
}
