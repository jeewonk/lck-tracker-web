import { TeamData, Team, Player } from "./types";
import data from "@/public/lck_players.json";

const teamData = data as TeamData;

export function getAllTeams(): Team[] {
  return teamData.teams;
}

export function getTeamById(id: string): Team | undefined {
  return teamData.teams.find((t) => t.id === id);
}

export function getPlayerByIgn(ign: string): { player: Player; team: Team } | undefined {
  for (const team of teamData.teams) {
    const player = team.players.find(
      (p) => p.ign.toLowerCase() === ign.toLowerCase()
    );
    if (player) return { player, team };
  }
  return undefined;
}

export function getAllPlayers(): { player: Player; team: Team }[] {
  return teamData.teams.flatMap((team) =>
    team.players.map((player) => ({ player, team }))
  );
}
