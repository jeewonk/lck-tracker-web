export interface RiotAccount {
  gameName: string;
  tagLine: string;
}

export interface Player {
  ign: string;
  realName: string;
  role: "TOP" | "JNG" | "MID" | "ADC" | "SUP";
  accounts: RiotAccount[];
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  colorHex: string | null;
  players: Player[];
}

export interface TeamData {
  teams: Team[];
}

export interface RankedInfo {
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  winRate: number;
}

export interface MatchSummary {
  matchId: string;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  gameDuration: number;
  gameCreation: number;
  cs: number;
  position: string;
}

export interface DailySummary {
  playerIgn: string;
  date: string;
  matches: MatchSummary[];
  totalGames: number;
  wins: number;
  winRate: number;
  averageKDA: string;
}

export const ROLE_EMOJI: Record<string, string> = {
  TOP: "🛡️",
  JNG: "🌿",
  MID: "⚡",
  ADC: "🏹",
  SUP: "💚",
};

export const ROLE_NAME: Record<string, string> = {
  TOP: "Top",
  JNG: "Jungle",
  MID: "Mid",
  ADC: "ADC",
  SUP: "Support",
};

export const TIER_COLOR: Record<string, string> = {
  CHALLENGER: "#FFD700",
  GRANDMASTER: "#CC3333",
  MASTER: "#9B59B6",
  DIAMOND: "#4589E0",
  EMERALD: "#00B888",
  PLATINUM: "#4FC8C8",
  GOLD: "#D9A613",
  SILVER: "#A0A8B0",
  BRONZE: "#A37348",
  IRON: "#706360",
};

export const TIER_SHORT: Record<string, string> = {
  CHALLENGER: "C",
  GRANDMASTER: "GM",
  MASTER: "M",
  DIAMOND: "D",
  EMERALD: "E",
  PLATINUM: "P",
  GOLD: "G",
  SILVER: "S",
  BRONZE: "B",
  IRON: "I",
};
