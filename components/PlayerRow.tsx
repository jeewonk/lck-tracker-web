import Link from "next/link";
import { Player, ROLE_EMOJI } from "@/lib/types";

export default function PlayerRow({
  player,
  rankLabel,
}: {
  player: Player;
  rankLabel?: string;
}) {
  return (
    <Link
      href={`/players/${encodeURIComponent(player.ign)}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-xl"
    >
      <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg">
        {ROLE_EMOJI[player.role]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm">{player.ign}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {player.realName}
        </div>
        {player.accounts[0] && (
          <div className="text-[11px] text-gray-400 dark:text-gray-500">
            {player.accounts[0].gameName}#{player.accounts[0].tagLine}
          </div>
        )}
      </div>

      {rankLabel && (
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {rankLabel}
        </span>
      )}

      <svg
        className="w-4 h-4 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  );
}
