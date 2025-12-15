import type { Account } from "@/types/account";
import type { Match } from "@/types/match";
import { mapWithConcurrency, riotFetchJson } from "./utils";

export async function getDuos(region: string, players: [string, string][]) {
  const playersMatches = await Promise.all(
    players.map(async ([gameName, tagLine]) => {
      const url = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
        gameName,
      )}/${encodeURIComponent(tagLine)}`;
      const res = await riotFetchJson<Account>(url);
      if (!res.ok) {
        return {
          error: res.errorText ?? "Failed to resolve Riot ID.",
        };
      }
      const account = {
        gameName: res.data.gameName,
        tagLine: res.data.tagLine,
        puuid: res.data.puuid,
      };
      const idsUrl = `https://${region}.api.riotgames.com/tft/match/v1/matches/by-puuid/${encodeURIComponent(
        account.puuid,
      )}/ids?start=0&count=10`;
      const idsRes = await riotFetchJson<string[]>(idsUrl);
      if (!idsRes.ok) {
        return {
          error: idsRes.errorText ?? "Failed to fetch match IDs.",
        };
      }
      const matches = await mapWithConcurrency(
        idsRes.data,
        5,
        async (matchId) => {
          const matchUrl = `https://${region}.api.riotgames.com/tft/match/v1/matches/${encodeURIComponent(
            matchId,
          )}`;
          const matchRes = await riotFetchJson<Match>(matchUrl);
          if (!matchRes.ok) {
            return {
              error: matchRes.errorText ?? "Failed to fetch match details.",
            };
          }
          return matchRes.data;
        },
      );
      const doubleUpMatches = matches.filter(
        (match) =>
          !("error" in match) &&
          match.info.tft_game_type === "pairs" &&
          match.info.tft_set_number === 16,
      );
      return {
        region,
        account,
        matches: doubleUpMatches,
      };
    }),
  );
  return playersMatches;
}
