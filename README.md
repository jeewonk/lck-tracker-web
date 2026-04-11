# 프로 솔랭 트래커 — Web

> Renamed from "LCK Tracker" on 2026-04-07 due to App Store guideline 4.1(c). Do NOT use "LCK" in any user-facing string or metadata.

A web application that tracks Korean pro players' solo queue ranked performance in real-time using the official Riot Games API.

**Live:** https://lck-tracker-web.vercel.app

## Features

### Team List (Home)
- Displays all 10 Korean pro teams in a grid layout
- Search bar to find teams or players by name
- Each team card shows the team badge, name, and role composition

### Team Detail
- Full roster with each player's current solo queue rank and LP
- Players sorted by role (Top → Jungle → Mid → ADC → Support)
- Click any player to view their detailed profile

### Player Profile
- **Ranked Info** — Current tier, LP, wins/losses, and win rate from the solo queue ladder
- **Daily Recap ("어젯밤 전적")** — Date-navigable summary of a player's solo queue activity within a 6AM-6AM KST window:
  - Total games, win rate, and average KDA
  - Win/loss bar visualization
  - Champion breakdown with per-champion win/loss dots
  - Individual match list with champion, position, KDA, and result
  - Rest day display when no games were played
- **Recent Match History** — Last 10 solo queue games with champion, KDA, CS, and result
- **Stats Summary** — Aggregated win rate, average KDA, and W/L record from recent games

### Leaderboard
- All Korean pro players ranked by solo queue LP
- Displays profile icon, team badge, tier badge, LP, and win rate
- Click any row to navigate to the player's full profile

## User Flow

```
Home (Team Grid)
  ├── Search → Filter teams/players
  ├── Click team → Team Detail (Roster)
  │     └── Click player → Player Profile
  │           ├── Ranked Info (Tier, LP, Win Rate)
  │           ├── Daily Recap (date navigation, champion stats, match list)
  │           └── Recent Match History
  └── 🏆 Leaderboard → All pros ranked by LP
        └── Click player → Player Profile
```

## Riot Games API Usage

This application uses the following Riot Games API endpoints:

| Endpoint | Purpose |
|----------|---------|
| **Account V1** (`/riot/account/v1/accounts/by-riot-id`) | Resolve player Riot ID to PUUID |
| **Summoner V4** (`/lol/summoner/v4/summoners/by-puuid`) | Fetch profile icon and summoner level |
| **League V4** (`/lol/league/v4/entries/by-puuid`) | Fetch ranked tier, LP, wins, losses |
| **Match V5** (`/lol/match/v5/matches/by-puuid/.../ids`) | Fetch recent match IDs and match IDs by time window |
| **Match V5** (`/lol/match/v5/matches/{matchId}`) | Fetch match details (champion, KDA, CS, result) |

All API calls are made **server-side** via Next.js API routes. The API key is never exposed to the browser.

### Rate Limiting
- API calls include a 150ms delay between sequential requests to respect Riot's rate limits
- In-memory caching (5-minute TTL) prevents redundant calls for the same data
- The leaderboard loads players sequentially to avoid bursts

### Data Sources
- **Riot Games API** — Real-time ranked and match data
- **Data Dragon CDN** — Champion portraits and summoner profile icons (auto-updated version)
- **Bundled roster data** (`lck_players.json`) — Korean pro team/player information with Riot account IDs

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (free tier)
- **API Key Management:** Server-side only (Vercel env var + GitHub Gist fallback)

## Teams Covered (2026 Season)

| Team | Players |
|------|---------|
| T1 | Doran, Oner, Faker, Peyz, Keria |
| Gen.G | Kiin, Canyon, Chovy, Ruler, Duro |
| Hanwha Life Esports | Zeus, Kanavi, Zeka, Gumayusi, Delight |
| Dplus KIA | Siwoo, Lucid, ShowMaker, Smash, Career |
| Kiwoom DRX | Rich, Vincenzo, Willer, Ucal, Jiwoo, Andil |
| KT Rolster | PerfecT, Cuzz, Bdd, Aiming, Ghost, Pollu, Effort |
| BNK FearX | Clear, Raptor, VicLa, Diable, Kellin |
| Hanjin Brion | Casting, Gideon, Roamer, Teddy, Namgung |
| NS RedForce | Kingen, Sponge, Scout, Calix, Taeyoon, Lehends |
| DN SOOPers | DuDu, Pyosik, Clozer, deokdam, Life, Peter |

## Related Projects

- **iOS App:** [LCKTracker](https://github.com/jeewonk/LCKTracker) — SwiftUI native app (submitted to App Store)
- **Android App:** [LCKTracker-Android](https://github.com/jeewonk/LCKTracker-Android) — Jetpack Compose native app

## Privacy Policy

https://sites.google.com/view/lck-tracker-privacy/home

## Legal

프로 솔랭 트래커 (KR Pro Rank Tracker) is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
