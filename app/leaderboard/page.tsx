"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProfileIcon from "@/components/ProfileIcon";
import RankBadge from "@/components/RankBadge";
import { TeamBadgeMini } from "@/components/TeamBadge";
import { ROLE_EMOJI } from "@/lib/types";

interface LeaderboardEntry {
  rank: number;
  ign: string;
  role: string;
  teamName: string;
  teamFullName: string;
  teamColorHex: string;
  profileIconId: number | null;
  tier: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  winRate: number;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/riot/leaderboard")
      .then((r) => r.json())
      .then((data) => setEntries(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">솔로랭크 순위</h1>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm text-gray-500">프로 선수 순위를 불러오는 중...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          순위 데이터를 불러올 수 없습니다
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[40px_1fr_40px_64px_56px] gap-2 px-4 py-2 text-[11px] text-gray-400 border-b border-gray-100 dark:border-gray-700">
            <span className="text-center">#</span>
            <span>선수</span>
            <span className="text-center">티어</span>
            <span className="text-right">LP</span>
            <span className="text-right">승률</span>
          </div>

          {entries.map((entry) => (
            <Link
              key={entry.ign}
              href={`/players/${encodeURIComponent(entry.ign)}`}
              className="grid grid-cols-[40px_1fr_40px_64px_56px] gap-2 px-4 py-2.5 items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0"
            >
              <span className="text-center font-semibold text-sm text-gray-500">
                {entry.rank <= 3
                  ? ["🥇", "🥈", "🥉"][entry.rank - 1]
                  : entry.rank}
              </span>

              <div className="flex items-center gap-2 min-w-0">
                <ProfileIcon iconId={entry.profileIconId} size={36} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold truncate">
                      {entry.ign}
                    </span>
                    <span className="text-xs">{ROLE_EMOJI[entry.role]}</span>
                  </div>
                  <TeamBadgeMini
                    shortName={entry.teamName}
                    colorHex={entry.teamColorHex}
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <RankBadge tier={entry.tier} compact />
              </div>

              <span className="text-right text-sm font-bold tabular-nums">
                {entry.leaguePoints.toLocaleString()}
              </span>

              <span
                className={`text-right text-xs tabular-nums ${entry.winRate >= 50 ? "text-blue-500" : "text-red-500"}`}
              >
                {entry.winRate.toFixed(0)}%
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
