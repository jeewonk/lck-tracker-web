import { NextRequest, NextResponse } from "next/server";
import {
  getPlayerRankedInfo,
  getRecentMatches,
  getDailySummary,
} from "@/lib/riot-api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const route = path.join("/");

  try {
    if (route === "ranked") {
      const gameName = request.nextUrl.searchParams.get("gameName");
      const tagLine = request.nextUrl.searchParams.get("tagLine");
      if (!gameName || !tagLine) {
        return NextResponse.json({ error: "Missing params" }, { status: 400 });
      }
      const data = await getPlayerRankedInfo(gameName, tagLine);
      return NextResponse.json(data);
    }

    if (route === "matches") {
      const gameName = request.nextUrl.searchParams.get("gameName");
      const tagLine = request.nextUrl.searchParams.get("tagLine");
      if (!gameName || !tagLine) {
        return NextResponse.json({ error: "Missing params" }, { status: 400 });
      }
      const data = await getRecentMatches(gameName, tagLine);
      return NextResponse.json(data);
    }

    if (route === "daily") {
      const gameName = request.nextUrl.searchParams.get("gameName");
      const tagLine = request.nextUrl.searchParams.get("tagLine");
      const date = request.nextUrl.searchParams.get("date");
      if (!gameName || !tagLine || !date) {
        return NextResponse.json({ error: "Missing params" }, { status: 400 });
      }
      const data = await getDailySummary(gameName, tagLine, date);
      return NextResponse.json(data);
    }

    if (route === "leaderboard") {
      return NextResponse.json(
        { error: "Leaderboard temporarily disabled to conserve API quota" },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
