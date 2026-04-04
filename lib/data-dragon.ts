const BASE_URL = "https://ddragon.leagueoflegends.com/cdn";
let currentVersion = "16.6.1";

export async function updateVersion() {
  try {
    const res = await fetch(
      "https://ddragon.leagueoflegends.com/api/versions.json",
      { next: { revalidate: 3600 } }
    );
    const versions: string[] = await res.json();
    if (versions[0]) currentVersion = versions[0];
  } catch {}
}

export function championIconURL(championName: string): string {
  return `${BASE_URL}/${currentVersion}/img/champion/${championName}.png`;
}

export function profileIconURL(iconId: number): string {
  return `${BASE_URL}/${currentVersion}/img/profileicon/${iconId}.png`;
}
