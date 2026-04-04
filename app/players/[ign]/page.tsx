"use client";

import { use, useEffect, useState } from "react";
import { getPlayerByIgn } from "@/lib/players";
import { RankedInfo, MatchSummary, DailySummary, ROLE_EMOJI, TIER_COLOR } from "@/lib/types";
import ProfileIcon from "@/components/ProfileIcon";
import RankBadge from "@/components/RankBadge";
import MatchRow from "@/components/MatchRow";
import ChampionImage from "@/components/ChampionImage";

export default function PlayerDetailPage({
  params,
}: {
  params: Promise<{ ign: string }>;
}) {
  const { ign } = use(params);
  const decoded = decodeURIComponent(ign);
  const result = getPlayerByIgn(decoded);

  const [ranked, setRanked] = useState<RankedInfo | null>(null);
  const [profileIconId, setProfileIconId] = useState<number | null>(null);
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [daily, setDaily] = useState<DailySummary | null>(null);
  const [loadingRank, setLoadingRank] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingDaily, setLoadingDaily] = useState(true);
  const [dailyDate, setDailyDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  });

  const player = result?.player;
  const team = result?.team;
  const account = player?.accounts[0];

  useEffect(() => {
    if (!account) return;
    setLoadingRank(true);
    fetch(
      `/api/riot/ranked?gameName=${encodeURIComponent(account.gameName)}&tagLine=${encodeURIComponent(account.tagLine)}`
    )
      .then((r) => r.json())
      .then((data) => {
        setRanked(data.ranked);
        setProfileIconId(data.profileIconId);
      })
      .catch(() => {})
      .finally(() => setLoadingRank(false));
  }, [account?.gameName, account?.tagLine]);

  useEffect(() => {
    if (!account) return;
    setLoadingMatches(true);
    fetch(
      `/api/riot/matches?gameName=${encodeURIComponent(account.gameName)}&tagLine=${encodeURIComponent(account.tagLine)}`
    )
      .then((r) => r.json())
      .then((data) => setMatches(data))
      .catch(() => {})
      .finally(() => setLoadingMatches(false));
  }, [account?.gameName, account?.tagLine]);

  useEffect(() => {
    if (!account) return;
    setLoadingDaily(true);
    setDaily(null);
    fetch(
      `/api/riot/daily?gameName=${encodeURIComponent(account.gameName)}&tagLine=${encodeURIComponent(account.tagLine)}&date=${dailyDate}`
    )
      .then((r) => r.json())
      .then((data) => setDaily(data))
      .catch(() => {})
      .finally(() => setLoadingDaily(false));
  }, [account?.gameName, account?.tagLine, dailyDate]);

  if (!player || !team) {
    return <div className="text-center py-12 text-gray-400">선수를 찾을 수 없습니다</div>;
  }

  const winCount = matches.filter((m) => m.win).length;
  const lossCount = matches.length - winCount;
  const recentWinRate =
    matches.length > 0
      ? ((winCount / matches.length) * 100).toFixed(0)
      : "-";

  function changeDate(delta: number) {
    const d = new Date(dailyDate);
    d.setDate(d.getDate() + delta);
    if (d >= new Date()) return;
    setDailyDate(d.toISOString().split("T")[0]);
  }

  const dateLabel = new Date(dailyDate + "T12:00:00").toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  return (
    <div className="space-y-4">
      {/* Player Header */}
      <div className="flex flex-col items-center gap-2 py-4">
        <ProfileIcon iconId={profileIconId} size={72} />
        <h1 className="text-2xl font-bold">{player.ign}</h1>
        <p className="text-sm text-gray-500">{player.realName}</p>
        <p className="text-xs text-gray-400">
          {team.name} · {player.role}
        </p>
      </div>

      {/* Rank Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold">솔로랭크</h2>
          {account && (
            <span className="text-xs text-gray-400">
              {account.gameName}#{account.tagLine}
            </span>
          )}
        </div>
        {loadingRank ? (
          <div className="text-center py-4 text-sm text-gray-400">불러오는 중...</div>
        ) : ranked ? (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <RankBadge tier={ranked.tier} />
              <span className="text-xs text-gray-500">
                {ranked.tier.charAt(0) + ranked.tier.slice(1).toLowerCase()}
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold">{ranked.leaguePoints.toLocaleString()} LP</div>
              <div className="flex gap-3 text-xs mt-1">
                <span className="text-blue-500">{ranked.wins}승</span>
                <span className="text-red-500">{ranked.losses}패</span>
              </div>
              <div
                className={`text-sm mt-1 font-medium ${ranked.winRate >= 50 ? "text-blue-500" : "text-red-500"}`}
              >
                승률 {ranked.winRate.toFixed(1)}%
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-gray-400">
            배치 중이거나 데이터를 불러올 수 없습니다
          </div>
        )}
      </div>

      {/* Daily Recap */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5">
        <h2 className="font-bold mb-3">어젯밤 전적</h2>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeDate(-1)} className="text-blue-500 text-lg px-2">&lt;</button>
          <div className="text-center">
            <div className="font-medium">{dateLabel}</div>
            <div className="text-xs text-gray-400">오전 6시 ~ 다음날 오전 6시</div>
          </div>
          <button onClick={() => changeDate(1)} className="text-blue-500 text-lg px-2">&gt;</button>
        </div>

        {loadingDaily ? (
          <div className="text-center py-6 text-sm text-gray-400">불러오는 중...</div>
        ) : daily && daily.totalGames > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 text-center">
              <div>
                <div className="text-xl font-bold text-blue-500">{daily.totalGames}</div>
                <div className="text-xs text-gray-500">게임</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-500">
                  {daily.winRate.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500">승률</div>
              </div>
              <div>
                <div className="text-xl font-bold">{daily.averageKDA.split("/").map(s => s.trim()).join(" / ")}</div>
                <div className="text-xs text-gray-500">KDA</div>
              </div>
            </div>

            <div className="flex gap-1">
              <div
                className="h-8 bg-blue-500 rounded-l-lg flex items-center justify-center text-white text-xs font-bold"
                style={{
                  width: `${(daily.wins / daily.totalGames) * 100}%`,
                }}
              >
                {daily.wins}W
              </div>
              <div
                className="h-8 bg-red-500 rounded-r-lg flex items-center justify-center text-white text-xs font-bold"
                style={{
                  width: `${((daily.totalGames - daily.wins) / daily.totalGames) * 100}%`,
                }}
              >
                {daily.totalGames - daily.wins}L
              </div>
            </div>

            {/* Champion breakdown */}
            <div>
              <h3 className="text-sm font-semibold mb-2">챔피언</h3>
              {Object.entries(
                daily.matches.reduce(
                  (acc, m) => {
                    if (!acc[m.championName]) acc[m.championName] = { games: 0, wins: 0 };
                    acc[m.championName].games++;
                    if (m.win) acc[m.championName].wins++;
                    return acc;
                  },
                  {} as Record<string, { games: number; wins: number }>
                )
              )
                .sort((a, b) => b[1].games - a[1].games)
                .map(([champ, stats]) => (
                  <div key={champ} className="flex items-center gap-3 py-1.5">
                    <ChampionImage name={champ} size={28} />
                    <span className="text-sm font-medium flex-1">{champ}</span>
                    <span className="text-xs text-gray-500">{stats.games}판</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: stats.wins }).map((_, i) => (
                        <span key={`w${i}`} className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      ))}
                      {Array.from({ length: stats.games - stats.wins }).map((_, i) => (
                        <span key={`l${i}`} className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 w-12 text-right">
                      {stats.wins}W {stats.games - stats.wins}L
                    </span>
                  </div>
                ))}
            </div>

            {/* Match list */}
            <div>
              <h3 className="text-sm font-semibold mb-2">게임 목록</h3>
              {daily.matches.map((m) => (
                <MatchRow key={m.matchId} match={m} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🛏️</div>
            <div className="font-bold">푹 쉬었어요 😴</div>
            <div className="text-sm text-gray-500 mt-1">솔로랭크 기록이 없는 날이에요</div>
          </div>
        )}
      </div>

      {/* Recent Stats */}
      {matches.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5">
          <h2 className="font-bold mb-3">최근 전적 요약</h2>
          <div className="grid grid-cols-3 text-center divide-x divide-gray-200 dark:divide-gray-700">
            <div>
              <div className="text-sm text-gray-500">승률</div>
              <div className="font-semibold text-blue-500">{recentWinRate}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">평균 KDA</div>
              <div className="font-semibold">
                {(matches.reduce((s, m) => s + m.kills, 0) / matches.length).toFixed(1)} /{" "}
                {(matches.reduce((s, m) => s + m.deaths, 0) / matches.length).toFixed(1)} /{" "}
                {(matches.reduce((s, m) => s + m.assists, 0) / matches.length).toFixed(1)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">전적</div>
              <div className="font-semibold">{winCount}W {lossCount}L</div>
            </div>
          </div>
        </div>
      )}

      {/* Match History */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5">
        <h2 className="font-bold mb-3">최근 게임</h2>
        {loadingMatches ? (
          <div className="text-center py-4 text-sm text-gray-400">불러오는 중...</div>
        ) : matches.length > 0 ? (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {matches.map((m) => (
              <MatchRow key={m.matchId} match={m} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-gray-400">
            최근 솔로랭크 기록이 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
