import Link from "next/link";
import { Team, ROLE_EMOJI } from "@/lib/types";
import TeamBadge from "./TeamBadge";

export default function TeamCard({ team }: { team: Team }) {
  return (
    <Link
      href={`/teams/${team.id}`}
      className="flex flex-col items-center gap-2 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
    >
      <TeamBadge
        shortName={team.shortName}
        colorHex={team.colorHex}
        size={48}
      />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {team.name}
      </span>
      <div className="flex gap-0.5 text-xs">
        {team.players
          .filter(
            (p, i, arr) =>
              arr.findIndex((x) => x.role === p.role) === i
          )
          .sort(
            (a, b) =>
              ["TOP", "JNG", "MID", "ADC", "SUP"].indexOf(a.role) -
              ["TOP", "JNG", "MID", "ADC", "SUP"].indexOf(b.role)
          )
          .map((p) => (
            <span key={p.role}>{ROLE_EMOJI[p.role]}</span>
          ))}
      </div>
    </Link>
  );
}
