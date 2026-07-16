import { NextRequest, NextResponse } from "next/server";
import { STATUS_OPTIONS, Status, updateInterviewStatus } from "@/lib/notion";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as { status?: string };

    if (!body.status || !STATUS_OPTIONS.includes(body.status as Status)) {
      return NextResponse.json({ error: "A valid status is required" }, { status: 400 });
    }

    const interview = await updateInterviewStatus(id, body.status as Status);
    return NextResponse.json({ interview });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update interview status in Notion" },
      { status: 500 }
    );
  }
}
