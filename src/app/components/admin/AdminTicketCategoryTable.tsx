"use client";

import { AdminButton } from "./AdminButton";
import type { TicketCategory } from "./AdminTicketTypes";

export default function AdminTicketCategoryTable({ categories }: { categories: TicketCategory[] }) {
  return (
    <div className="border border-[#1a170e] bg-[#080808] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[#F5EDD6] font-serif text-lg">Ticket Inventory</h2>
          <p className="text-[#9A8C6A] text-xs">Ticket types, pricing, and availability</p>
        </div>
        <AdminButton label="Add Type" variant="ghost" />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#1a170e] text-xs uppercase text-[#9A8C6A]">
            <tr>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Sold</th>
              <th className="px-3 py-2">Available</th>
              <th className="px-3 py-2">Revenue</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.type} className="border-b border-[#1a170e]">
                <td className="px-3 py-3 text-[#F5EDD6]">{category.type}</td>
                <td className="px-3 py-3 text-[#F5EDD6]">{category.price}</td>
                <td className="px-3 py-3 text-[#F5EDD6]">{category.sold}</td>
                <td className="px-3 py-3 text-[#F5EDD6]">{category.available}</td>
                <td className="px-3 py-3 text-[#F5EDD6]">{category.revenue}</td>
                <td className="px-3 py-3">
                  <AdminButton label="Edit" variant="ghost" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
