const COLORS: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-800",
  "Awaiting Response": "bg-yellow-100 text-yellow-800",
  Passed: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
  Withdrawn: "bg-gray-100 text-gray-800",
};

export default function StatusBadge({ status }: { status: string }) {
  if (!status) return null;
  const color = COLORS[status] ?? "bg-gray-100 text-gray-800";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {status}
    </span>
  );
}
