"use client";

import { useEffect, useState, use } from "react";
import { getTeamById } from "@/lib/players";
import { RankedInfo, TIER_SHORT } from "@/lib/types";
import TeamBadge from "@/components/TeamBadge";
import PlayerRow from "@/components/PlayerRow";

const ROLE_ORDER = ["TOP", "JNG", "MID", "ADC", "SUP"];

export default function TeamDetailPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = use(params);
  const team = getTeamById(teamId);
  const [ranks, setRanks] = useState<Record<string, RankedInfo | null>>({});

  useEffect(() => {
    if (!team) return;
    for (const player of team.players) {
      const account = player.accounts[0];
      if (!account) continue;
      fetch(
        `/api/riot/ranked?gameName=${encodeURIComponent(account.gameName)}&tagLine=${encodeURIComponent(account.tagLine)}`
      )
        .then((r) => r.json())
        .then((data) => {
          setRanks((prev) => ({ ...prev, [player.ign]: data.ranked }));
        })
        .catch(() => {});
    }
  }, [team]);

  if (!team) {
    return <div className="text-center py-12 text-gray-400">팀을 찾을 수 없습니다</div>;
  }

  const sorted = [...team.players].sort(
    (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role)
  );

  function rankLabel(ign: string): string | undefined {
    const r = ranks[ign];
    if (!r) return undefined;
    const short = TIER_SHORT[r.tier] || "?";
    return `${short} ${r.leaguePoints}LP`;
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-2 mb-8">
        <TeamBadge shortName={team.shortName} colorHex={team.colorHex} size={64} />
        <h1 className="text-xl font-bold">{team.name}</h1>
        <p className="text-sm text-gray-500">{team.players.length}명의 선수</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl divide-y divide-gray-100 dark:divide-gray-700">
        {sorted.map((player) => (
          <PlayerRow
            key={player.ign}
            player={player}
            rankLabel={rankLabel(player.ign)}
          />
        ))}
      </div>
    </div>
  );
}
