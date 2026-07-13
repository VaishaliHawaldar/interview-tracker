import { NextRequest, NextResponse } from "next/server";
import { createInterview, listInterviews, InterviewInput } from "@/lib/notion";

export async function GET() {
  try {
    const interviews = await listInterviews();
    return NextResponse.json({ interviews });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch interviews from Notion" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InterviewInput;

    if (!body.company?.trim()) {
      return NextResponse.json({ error: "Company is required" }, { status: 400 });
    }

    const interview = await createInterview(body);
    return NextResponse.json({ interview }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create interview in Notion" },
      { status: 500 }
    );
  }
}
