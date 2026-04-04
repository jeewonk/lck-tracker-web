"use client";

import Image from "next/image";
import { profileIconURL } from "@/lib/data-dragon";

export default function ProfileIcon({
  iconId,
  size = 40,
}: {
  iconId: number | null;
  size?: number;
}) {
  if (!iconId) {
    return (
      <div
        className="rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-gray-400">?</span>
      </div>
    );
  }

  return (
    <Image
      src={profileIconURL(iconId)}
      alt="Profile"
      width={size}
      height={size}
      className="rounded-full border border-gray-300 dark:border-gray-600"
      unoptimized
    />
  );
}
