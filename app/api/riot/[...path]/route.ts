import { NextRequest, NextResponse } from "next/server";
import {
  getPlayerRankedInfo,
  getRecentMatches,
  getDailySummary,
} from "@/lib/riot-api";
import { getAllPlayers } from "@/lib/players";

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
      const allPlayers = getAllPlayers();
      const results = [];

      for (const { player, team } of allPlayers) {
        const account = player.accounts[0];
        if (!account) continue;
        const info = await getPlayerRankedInfo(
          account.gameName,
          account.tagLine
        );
        if (info.ranked) {
          results.push({
            ign: player.ign,
            role: player.role,
            teamName: team.shortName,
            teamFullName: team.name,
            teamColorHex: team.colorHex || "#888",
            profileIconId: info.profileIconId,
            ...info.ranked,
          });
        }
        await new Promise((r) => setTimeout(r, 150));
      }

      results.sort((a, b) => {
        const tierOrder: Record<string, number> = {
          CHALLENGER: 9,
          GRANDMASTER: 8,
          MASTER: 7,
          DIAMOND: 6,
          EMERALD: 5,
          PLATINUM: 4,
          GOLD: 3,
          SILVER: 2,
          BRONZE: 1,
          IRON: 0,
        };
        const ta = tierOrder[a.tier] ?? 0;
        const tb = tierOrder[b.tier] ?? 0;
        if (ta !== tb) return tb - ta;
        return b.leaguePoints - a.leaguePoints;
      });

      return NextResponse.json(
        results.map((r, i) => ({ ...r, rank: i + 1 }))
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
