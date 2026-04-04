export default function TeamBadge({
  shortName,
  colorHex,
  size = 48,
}: {
  shortName: string;
  colorHex: string | null;
  size?: number;
}) {
  const bg = colorHex || "#888";
  const fontSize = size * 0.3;
  const radius = size * 0.25;

  return (
    <div
      className="inline-flex items-center justify-center font-black text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        borderRadius: radius,
        fontSize,
      }}
    >
      {shortName}
    </div>
  );
}

export function TeamBadgeMini({
  shortName,
  colorHex,
}: {
  shortName: string;
  colorHex: string;
}) {
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
      style={{ backgroundColor: colorHex }}
    >
      {shortName}
    </span>
  );
}
