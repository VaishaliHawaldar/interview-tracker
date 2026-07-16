import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const databaseId = () => {
  const id = process.env.NOTION_DATABASE_ID;
  if (!id) throw new Error("NOTION_DATABASE_ID is not set");
  return id;
};

export const ROUND_OPTIONS = [
  "Applied",
  "Phone Screen",
  "Technical",
  "Onsite",
  "HR",
  "Offer",
  "Rejected",
] as const;

export const STATUS_OPTIONS = [
  "Scheduled",
  "Awaiting Response",
  "Passed",
  "Rejected",
  "Withdrawn",
] as const;

export const MODE_OPTIONS = ["Remote", "Onsite", "Hybrid"] as const;

export type Round = (typeof ROUND_OPTIONS)[number];
export type Status = (typeof STATUS_OPTIONS)[number];
export type Mode = (typeof MODE_OPTIONS)[number];

export interface Interview {
  id: string;
  company: string;
  role: string;
  round: Round | "";
  date: string | null;
  status: Status | "";
  interviewer: string;
  notes: string;
  nextActionDate: string | null;
  jobLink: string;
  ctc: string;
  location: string;
  mode: Mode | "";
}

export interface InterviewInput {
  company: string;
  role: string;
  round: Round | "";
  date: string;
  status: Status | "";
  interviewer: string;
  notes: string;
  nextActionDate: string;
  jobLink: string;
  ctc: string;
  location: string;
  mode: Mode | "";
}

function text(page: PageObjectResponse, prop: string): string {
  const p = page.properties[prop];
  if (!p) return "";
  if (p.type === "rich_text") return p.rich_text.map((t) => t.plain_text).join("");
  if (p.type === "title") return p.title.map((t) => t.plain_text).join("");
  if (p.type === "url") return p.url ?? "";
  if (p.type === "number") return p.number != null ? String(p.number) : "";
  return "";
}

function select(page: PageObjectResponse, prop: string): string {
  const p = page.properties[prop];
  if (!p || p.type !== "select") return "";
  return p.select?.name ?? "";
}

function date(page: PageObjectResponse, prop: string): string | null {
  const p = page.properties[prop];
  if (!p || p.type !== "date") return null;
  return p.date?.start ?? null;
}

function toInterview(page: PageObjectResponse): Interview {
  return {
    id: page.id,
    company: text(page, "Company"),
    role: text(page, "Role"),
    round: select(page, "Round") as Round | "",
    date: date(page, "Date"),
    status: select(page, "Status") as Status | "",
    interviewer: text(page, "Interviewer"),
    notes: text(page, "Notes"),
    nextActionDate: date(page, "Next Action Date"),
    jobLink: text(page, "Job Link"),
    ctc: text(page, "CTC"),
    location: text(page, "Location"),
    mode: select(page, "Mode") as Mode | "",
  };
}

export async function listInterviews(): Promise<Interview[]> {
  const results: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const query: QueryDatabaseParameters = {
      database_id: databaseId(),
      sorts: [{ property: "Date", direction: "descending" }],
      start_cursor: cursor,
    };
    const response = await notion.databases.query(query);
    results.push(...(response.results as PageObjectResponse[]));
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return results.map(toInterview);
}

export async function createInterview(input: InterviewInput): Promise<Interview> {
  const page = await notion.pages.create({
    parent: { database_id: databaseId() },
    properties: {
      Company: { title: [{ text: { content: input.company } }] },
      Role: { rich_text: [{ text: { content: input.role } }] },
      ...(input.round && { Round: { select: { name: input.round } } }),
      ...(input.date && { Date: { date: { start: input.date } } }),
      ...(input.status && { Status: { select: { name: input.status } } }),
      Interviewer: { rich_text: [{ text: { content: input.interviewer } }] },
      Notes: { rich_text: [{ text: { content: input.notes } }] },
      ...(input.nextActionDate && {
        "Next Action Date": { date: { start: input.nextActionDate } },
      }),
      ...(input.jobLink && { "Job Link": { url: input.jobLink } }),
      CTC: { rich_text: [{ text: { content: input.ctc } }] },
      Location: { rich_text: [{ text: { content: input.location } }] },
      ...(input.mode && { Mode: { select: { name: input.mode } } }),
    },
  });

  return toInterview(page as PageObjectResponse);
}

export async function updateInterviewStatus(id: string, status: Status): Promise<Interview> {
  const page = await notion.pages.update({
    page_id: id,
    properties: {
      Status: { select: { name: status } },
    },
  });

  return toInterview(page as PageObjectResponse);
}
