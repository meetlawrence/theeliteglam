"use client";

import { useMemo, useState } from "react";
import AdminTicketStats from "./AdminTicketStats";
import AdminTicketSalesChart from "./AdminTicketSalesChart";
import AdminTicketCategoryTable from "./AdminTicketCategoryTable";
import AdminTicketTransactions from "./AdminTicketTransactions";
import AdminTicketVerification from "./AdminTicketVerification";
import type { TicketMetric, TicketSalePoint, TicketCategory, TicketTransaction, TicketVerificationRecord } from "./AdminTicketTypes";

const ticketMetrics: TicketMetric[] = [
  { label: "Tickets Sold", value: "5.2K", note: "Cumulative sold tickets" },
  { label: "Revenue", value: "$132.4K", note: "Total revenue generated" },
];

const ticketSales: TicketSalePoint[] = [
  { day: "Mon", sold: 340, revenue: 8400 },
  { day: "Tue", sold: 520, revenue: 10400 },
  { day: "Wed", sold: 430, revenue: 9200 },
  { day: "Thu", sold: 610, revenue: 12600 },
  { day: "Fri", sold: 760, revenue: 15800 },
  { day: "Sat", sold: 980, revenue: 21100 },
  { day: "Sun", sold: 820, revenue: 17500 },
];

const ticketCategories: TicketCategory[] = [
  { type: "General Admission", price: "$45", sold: 2800, available: 1200, revenue: "$126K" },
  { type: "VIP", price: "$95", sold: 840, available: 120, revenue: "$79.8K" },
  { type: "Premium", price: "$150", sold: 280, available: 80, revenue: "$42.0K" },
];

const recentTransactions: TicketTransaction[] = [
  { id: "tx-1", buyer: "Amara N.", ticketType: "VIP", quantity: 2, total: "$190", status: "Completed" },
  { id: "tx-2", buyer: "Leah O.", ticketType: "General Admission", quantity: 4, total: "$180", status: "Pending" },
  { id: "tx-3", buyer: "Blessing A.", ticketType: "Premium", quantity: 1, total: "$150", status: "Completed" },
  { id: "tx-4", buyer: "Tomi K.", ticketType: "VIP", quantity: 3, total: "$285", status: "Refunded" },
];

const verificationHistoryInitial: TicketVerificationRecord[] = [
  { code: "TK-56213", buyer: "Amara N.", ticketType: "VIP", status: "Valid", timestamp: "Just now" },
  { code: "TK-48291", buyer: "Leah O.", ticketType: "General Admission", status: "Invalid", timestamp: "5 min ago" },
  { code: "TK-79902", buyer: "Blessing A.", ticketType: "Premium", status: "Already Used", timestamp: "12 min ago" },
  { code: "TK-31415", buyer: "Tomi K.", ticketType: "VIP", status: "Valid", timestamp: "20 min ago" },
];

const validTicketLedger: Record<string, { buyer: string; ticketType: string }> = {
  "TK-56213": { buyer: "Amara N.", ticketType: "VIP" },
  "TK-31415": { buyer: "Tomi K.", ticketType: "VIP" },
  "TK-86001": { buyer: "New Guest", ticketType: "General Admission" },
};

export default function AdminTicketsPanel() {
  const [verificationHistory, setVerificationHistory] = useState<TicketVerificationRecord[]>(verificationHistoryInitial);
  const totalRevenue = useMemo(() => ticketSales.reduce((sum, point) => sum + point.revenue, 0), []);

  const verifyTicket = (code: string) => {
    const cleanedCode = code.trim().toUpperCase();
    if (!cleanedCode) return;

    const existing = verificationHistory.find((record) => record.code === cleanedCode);
    const recordData = validTicketLedger[cleanedCode];

    const status: TicketVerificationRecord["status"] = existing
      ? "Already Used"
      : recordData
      ? "Valid"
      : "Invalid";

    const newRecord: TicketVerificationRecord = {
      code: cleanedCode,
      buyer: recordData?.buyer || existing?.buyer || "Unknown",
      ticketType: recordData?.ticketType || existing?.ticketType || "Unknown",
      status,
      timestamp: "Just now",
    };

    setVerificationHistory((current) => [newRecord, ...current].slice(0, 8));
  };

  return (
    <div className="space-y-6">
      <div className="border border-[#1a170e] bg-[#080808] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <p className="text-[0.65rem] uppercase tracking-[0.36em] text-[#C9A84C]">Tickets Management</p>
        <h1 className="mt-3 text-4xl font-serif text-[#F5EDD6]">Event Tickets</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <AdminTicketStats metrics={ticketMetrics} />
          <AdminTicketSalesChart data={ticketSales} />
          <AdminTicketVerification history={verificationHistory} onVerify={verifyTicket} />
        </div>

        <div className="space-y-6">
          <div className="border border-[#1a170e] bg-[#080808] p-4">
            <p className="text-muted-foreground">Manage event tickets, sales, and attendees.</p>
            <p className="text-[#666] text-sm mt-4">Total revenue from weekly ticket sales: ${totalRevenue.toLocaleString()}</p>
          </div>

          <AdminTicketCategoryTable categories={ticketCategories} />
        </div>
      </div>

      <AdminTicketTransactions transactions={recentTransactions} />
    </div>
  );
}
