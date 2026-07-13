import { listInterviews } from "@/lib/notion";
import InterviewsTable from "@/app/components/InterviewsTable";

export const dynamic = "force-dynamic";

export default async function Home() {
  let interviews: Awaited<ReturnType<typeof listInterviews>> = [];
  let error: string | null = null;

  try {
    interviews = await listInterviews();
  } catch {
    error =
      "Could not load interviews from Notion. Check NOTION_TOKEN and NOTION_DATABASE_ID in .env.local.";
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Interview Tracker</h1>
      {error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <InterviewsTable interviews={interviews} />
      )}
    </main>
  );
}
