"use client";

import type { TicketTransaction } from "./AdminTicketTypes";
import { AdminButton } from "./AdminButton";

export default function AdminTicketTransactions({
  transactions,
}: {
  transactions: TicketTransaction[];
}) {
  return (
    <div className="border border-[#1a170e] bg-[#080808] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[#F5EDD6] font-serif text-lg">Recent Sales</h2>
          <p className="text-[#9A8C6A] text-xs">Latest ticket purchases</p>
        </div>
        <AdminButton label="Export" variant="ghost" />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#1a170e] text-xs uppercase text-[#9A8C6A]">
            <tr>
              <th className="px-3 py-2">Buyer</th>
              <th className="px-3 py-2">Ticket</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-[#1a170e]">
                <td className="px-3 py-3 text-[#F5EDD6]">{tx.buyer}</td>
                <td className="px-3 py-3 text-[#F5EDD6]">{tx.ticketType}</td>
                <td className="px-3 py-3 text-[#F5EDD6]">{tx.quantity}</td>
                <td className="px-3 py-3 text-[#F5EDD6]">{tx.total}</td>
                <td className="px-3 py-3 text-[#9A8C6A]">{tx.status}</td>
                <td className="px-3 py-3">
                  <AdminButton label="View" variant="ghost" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
