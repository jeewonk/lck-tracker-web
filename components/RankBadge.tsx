import { TIER_COLOR, TIER_SHORT } from "@/lib/types";

export default function RankBadge({
  tier,
  compact = false,
}: {
  tier: string;
  compact?: boolean;
}) {
  const bg = TIER_COLOR[tier] || "#888";
  const label = TIER_SHORT[tier] || "?";
  const size = compact ? "w-7 h-7 text-xs" : "w-10 h-10 text-sm";

  return (
    <span
      className={`${size} inline-flex items-center justify-center rounded-lg font-bold text-white`}
      style={{ backgroundColor: bg }}
    >
      {label}
    </span>
  );
}
