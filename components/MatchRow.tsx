"use client";

import ChampionImage from "./ChampionImage";
import { MatchSummary } from "@/lib/types";

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return "방금 전";
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

function durationStr(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MatchRow({ match }: { match: MatchSummary }) {
  const kda = `${match.kills}/${match.deaths}/${match.assists}`;
  const kdaRatio =
    match.deaths === 0
      ? "Perfect"
      : ((match.kills + match.assists) / match.deaths).toFixed(2);

  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className={`w-1 h-12 rounded-full ${match.win ? "bg-blue-500" : "bg-red-500"}`}
      />
      <ChampionImage name={match.championName} size={36} />

      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{match.championName}</div>
        <div className="flex gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
          <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
            {match.position}
          </span>
          <span>{durationStr(match.gameDuration)}</span>
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm font-semibold tabular-nums">{kda}</div>
        <div className="text-[11px] text-gray-500">
          {kdaRatio} · CS {match.cs}
        </div>
      </div>

      <div className="w-12 text-right">
        <div
          className={`text-xs font-bold ${match.win ? "text-blue-500" : "text-red-500"}`}
        >
          {match.win ? "승리" : "패배"}
        </div>
        <div className="text-[11px] text-gray-400">
          {timeAgo(match.gameCreation)}
        </div>
      </div>
    </div>
  );
}
