"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Interview, STATUS_OPTIONS } from "@/lib/notion";
import StatusBadge from "./StatusBadge";

type SortKey = "company" | "role" | "round" | "date" | "status";

export default function InterviewsTable({ interviews }: { interviews: Interview[] }) {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let rows = interviews;
    if (statusFilter) rows = rows.filter((r) => r.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.company.toLowerCase().includes(q) || r.role.toLowerCase().includes(q)
      );
    }
    const sorted = [...rows].sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [interviews, statusFilter, search, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const columns: { key: SortKey; label: string }[] = [
    { key: "company", label: "Company" },
    { key: "role", label: "Role" },
    { key: "round", label: "Round" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <Link
          href="/add"
          className="ml-auto bg-black text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-800"
        >
          + Add Interview
        </Link>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="text-left px-4 py-2 font-medium cursor-pointer select-none whitespace-nowrap"
                >
                  {col.label}
                  {sortKey === col.key ? (sortAsc ? " ▲" : " ▼") : ""}
                </th>
              ))}
              <th className="text-left px-4 py-2 font-medium">Next Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((interview) => (
              <tr key={interview.id} className="border-t">
                <td className="px-4 py-2 font-medium">{interview.company}</td>
                <td className="px-4 py-2">{interview.role}</td>
                <td className="px-4 py-2">{interview.round}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {interview.date ?? "—"}
                </td>
                <td className="px-4 py-2">
                  <StatusBadge status={interview.status} />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {interview.nextActionDate ?? "—"}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No interviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
