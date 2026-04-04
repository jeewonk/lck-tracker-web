const ASIA_BASE = "https://asia.api.riotgames.com";
const KR_BASE = "https://kr.api.riotgames.com";

const GIST_URL =
  "https://gist.githubusercontent.com/jeewonk/2a6dba83e60b5d46fa4e1658049442dc/raw/gistfile0.txt";

let cachedKey: string | null = null;
let keyFetchedAt = 0;

async function getAPIKey(): Promise<string> {
  if (process.env.RIOT_API_KEY) return process.env.RIOT_API_KEY;

  if (cachedKey && Date.now() - keyFetchedAt < 300_000) return cachedKey;

  try {
    const res = await fetch(GIST_URL, { cache: "no-store" });
    const json = await res.json();
    cachedKey = json.riotAPIKey;
    keyFetchedAt = Date.now();
    return cachedKey!;
  } catch {
    return cachedKey || "";
  }
}

async function riotFetch<T>(url: string): Promise<T> {
  const key = await getAPIKey();
  const res = await fetch(url, {
    headers: { "X-Riot-Token": key },
    cache: "no-store",
  });

  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 2000));
    const retry = await fetch(url, {
      headers: { "X-Riot-Token": key },
      cache: "no-store",
    });
    return retry.json();
  }

  if (!res.ok) throw new Error(`Riot API ${res.status}: ${url}`);
  return res.json();
}

interface AccountResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
}

interface LeagueEntry {
  queueType: string;
  tier?: string;
  rank?: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

interface SummonerResponse {
  profileIconId?: number;
  summonerLevel?: number;
}

interface MatchResponse {
  metadata: { matchId: string };
  info: {
    gameDuration: number;
    gameCreation: number;
    queueId: number;
    participants: MatchParticipant[];
  };
}

interface MatchParticipant {
  puuid: string;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  teamPosition?: string;
}

export async function getAccount(
  gameName: string,
  tagLine: string
): Promise<AccountResponse> {
  const name = encodeURIComponent(gameName);
  const tag = encodeURIComponent(tagLine);
  return riotFetch(
    `${ASIA_BASE}/riot/account/v1/accounts/by-riot-id/${name}/${tag}`
  );
}

export async function getSummoner(puuid: string): Promise<SummonerResponse> {
  return riotFetch(
    `${KR_BASE}/lol/summoner/v4/summoners/by-puuid/${puuid}`
  );
}

export async function getLeagueEntries(
  puuid: string
): Promise<LeagueEntry[]> {
  return riotFetch(
    `${KR_BASE}/lol/league/v4/entries/by-puuid/${puuid}`
  );
}

export async function getMatchIds(
  puuid: string,
  count = 10,
  queue?: number
): Promise<string[]> {
  let url = `${ASIA_BASE}/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`;
  if (queue) url += `&queue=${queue}`;
  return riotFetch(url);
}

export async function getMatch(matchId: string): Promise<MatchResponse> {
  return riotFetch(
    `${ASIA_BASE}/lol/match/v5/matches/${matchId}`
  );
}

function normalizePosition(pos?: string): string {
  switch (pos?.toUpperCase()) {
    case "TOP": return "TOP";
    case "JUNGLE": return "JNG";
    case "MIDDLE": return "MID";
    case "BOTTOM": return "ADC";
    case "UTILITY": return "SUP";
    default: return "?";
  }
}

export async function getPlayerRankedInfo(gameName: string, tagLine: string) {
  try {
    const account = await getAccount(gameName, tagLine);
    const [summoner, entries] = await Promise.all([
      getSummoner(account.puuid).catch(() => null),
      getLeagueEntries(account.puuid),
    ]);

    const solo = entries.find((e) => e.queueType === "RANKED_SOLO_5x5");
    const totalGames = solo ? solo.wins + solo.losses : 0;

    return {
      puuid: account.puuid,
      profileIconId: summoner?.profileIconId ?? null,
      ranked: solo
        ? {
            tier: solo.tier || "UNRANKED",
            rank: solo.rank || "",
            leaguePoints: solo.leaguePoints,
            wins: solo.wins,
            losses: solo.losses,
            winRate: totalGames > 0 ? (solo.wins / totalGames) * 100 : 0,
          }
        : null,
    };
  } catch {
    return { puuid: null, profileIconId: null, ranked: null };
  }
}

export async function getRecentMatches(gameName: string, tagLine: string) {
  try {
    const account = await getAccount(gameName, tagLine);
    const matchIds = await getMatchIds(account.puuid, 10, 420);

    const matches = [];
    for (const id of matchIds.slice(0, 10)) {
      try {
        const match = await getMatch(id);
        const p = match.info.participants.find(
          (pp) => pp.puuid === account.puuid
        );
        if (!p) continue;

        matches.push({
          matchId: match.metadata.matchId,
          championName: p.championName,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          win: p.win,
          gameDuration: match.info.gameDuration,
          gameCreation: match.info.gameCreation,
          cs: p.totalMinionsKilled + p.neutralMinionsKilled,
          position: normalizePosition(p.teamPosition),
        });
      } catch {
        continue;
      }
    }
    return matches;
  } catch {
    return [];
  }
}

export async function getDailySummary(
  gameName: string,
  tagLine: string,
  dateStr: string
) {
  try {
    const account = await getAccount(gameName, tagLine);
    const date = new Date(dateStr);
    const start = new Date(date);
    start.setHours(6, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const startEpoch = Math.floor(start.getTime() / 1000);
    const endEpoch = Math.floor(end.getTime() / 1000);

    const matchIds = await riotFetch<string[]>(
      `${ASIA_BASE}/lol/match/v5/matches/by-puuid/${account.puuid}/ids?startTime=${startEpoch}&endTime=${endEpoch}&count=100&queue=420`
    );

    const matches = [];
    for (const id of matchIds) {
      try {
        const match = await getMatch(id);
        const p = match.info.participants.find(
          (pp) => pp.puuid === account.puuid
        );
        if (!p) continue;
        matches.push({
          matchId: match.metadata.matchId,
          championName: p.championName,
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          win: p.win,
          gameDuration: match.info.gameDuration,
          gameCreation: match.info.gameCreation,
          cs: p.totalMinionsKilled + p.neutralMinionsKilled,
          position: normalizePosition(p.teamPosition),
        });
      } catch {
        continue;
      }
    }

    matches.sort((a, b) => a.gameCreation - b.gameCreation);

    const wins = matches.filter((m) => m.win).length;
    const totalGames = matches.length;
    const avgK = matches.reduce((s, m) => s + m.kills, 0) / (totalGames || 1);
    const avgD = matches.reduce((s, m) => s + m.deaths, 0) / (totalGames || 1);
    const avgA = matches.reduce((s, m) => s + m.assists, 0) / (totalGames || 1);

    return {
      playerIgn: gameName,
      date: dateStr,
      matches,
      totalGames,
      wins,
      winRate: totalGames > 0 ? (wins / totalGames) * 100 : 0,
      averageKDA: `${avgK.toFixed(1)} / ${avgD.toFixed(1)} / ${avgA.toFixed(1)}`,
    };
  } catch {
    return {
      playerIgn: gameName,
      date: dateStr,
      matches: [],
      totalGames: 0,
      wins: 0,
      winRate: 0,
      averageKDA: "0 / 0 / 0",
    };
  }
}
