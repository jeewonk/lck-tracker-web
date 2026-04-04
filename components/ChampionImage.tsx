"use client";

import Image from "next/image";
import { championIconURL } from "@/lib/data-dragon";

export default function ChampionImage({
  name,
  size = 32,
}: {
  name: string;
  size?: number;
}) {
  return (
    <Image
      src={championIconURL(name)}
      alt={name}
      width={size}
      height={size}
      className="rounded-lg"
      unoptimized
    />
  );
}
