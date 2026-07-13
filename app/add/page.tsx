"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  InterviewInput,
  ROUND_OPTIONS,
  STATUS_OPTIONS,
  MODE_OPTIONS,
} from "@/lib/notion";

const EMPTY: InterviewInput = {
  company: "",
  role: "",
  round: "",
  date: "",
  status: "",
  interviewer: "",
  notes: "",
  nextActionDate: "",
  jobLink: "",
  ctc: "",
  location: "",
  mode: "",
};

export default function AddInterviewPage() {
  const router = useRouter();
  const [form, setForm] = useState<InterviewInput>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof InterviewInput>(key: K, value: InterviewInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to create interview");
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Add Interview</h1>
        <Link href="/" className="text-sm text-gray-600 hover:underline">
          ← Back to table
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Company *">
          <input
            required
            type="text"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            className="border rounded px-3 py-2 w-full text-sm"
          />
        </Field>

        <Field label="Role">
          <input
            type="text"
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
            className="border rounded px-3 py-2 w-full text-sm"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Round / Stage">
            <select
              value={form.round}
              onChange={(e) => update("round", e.target.value as InterviewInput["round"])}
              className="border rounded px-3 py-2 w-full text-sm"
            >
              <option value="">—</option>
              {ROUND_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value as InterviewInput["status"])}
              className="border rounded px-3 py-2 w-full text-sm"
            >
              <option value="">—</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Date">
            <input
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              className="border rounded px-3 py-2 w-full text-sm"
            />
          </Field>

          <Field label="Next Action Date">
            <input
              type="date"
              value={form.nextActionDate}
              onChange={(e) => update("nextActionDate", e.target.value)}
              className="border rounded px-3 py-2 w-full text-sm"
            />
          </Field>
        </div>

        <Field label="Interviewer(s)">
          <input
            type="text"
            value={form.interviewer}
            onChange={(e) => update("interviewer", e.target.value)}
            className="border rounded px-3 py-2 w-full text-sm"
          />
        </Field>

        <Field label="Job Link / Source">
          <input
            type="url"
            value={form.jobLink}
            onChange={(e) => update("jobLink", e.target.value)}
            className="border rounded px-3 py-2 w-full text-sm"
            placeholder="https://..."
          />
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Expected/Offered CTC">
            <input
              type="text"
              value={form.ctc}
              onChange={(e) => update("ctc", e.target.value)}
              className="border rounded px-3 py-2 w-full text-sm"
            />
          </Field>

          <Field label="Location">
            <input
              type="text"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              className="border rounded px-3 py-2 w-full text-sm"
            />
          </Field>

          <Field label="Mode">
            <select
              value={form.mode}
              onChange={(e) => update("mode", e.target.value as InterviewInput["mode"])}
              className="border rounded px-3 py-2 w-full text-sm"
            >
              <option value="">—</option>
              {MODE_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Notes">
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            className="border rounded px-3 py-2 w-full text-sm"
            rows={4}
          />
        </Field>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-black text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Save Interview"}
        </button>
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">{label}</span>
      {children}
    </label>
  );
}
