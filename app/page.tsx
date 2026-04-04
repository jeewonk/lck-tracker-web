"use client";

import { useState } from "react";
import { getAllTeams } from "@/lib/players";
import TeamCard from "@/components/TeamCard";

const teams = getAllTeams();

export default function HomePage() {
  const [search, setSearch] = useState("");

  const filtered = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.shortName.toLowerCase().includes(search.toLowerCase()) ||
      t.players.some((p) =>
        p.ign.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-1">LCK 프로 솔로랭크</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          프로게이머 솔로랭크 실시간 전적
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="팀 또는 선수 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filtered.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          검색 결과가 없습니다
        </div>
      )}
    </div>
  );
}
