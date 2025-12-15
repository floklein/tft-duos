import type { Account } from "@/types/account";
import type { Duo } from "@/types/duo";
import type { Match } from "@/types/match";
import { riotFetchJson } from "./utils";

export async function getDuos(region: string, playerNames: [string, string][]) {
  const players = await Promise.all(
    playerNames.map(async ([gameName, tagLine]) => {
      const url = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
        gameName,
      )}/${encodeURIComponent(tagLine)}`;
      const res = await riotFetchJson<Account>(url);
      if (!res.ok) {
        console.error(res.errorText ?? "Failed to resolve Riot ID.");
        return null;
      }
      const account = {
        gameName: res.data.gameName,
        tagLine: res.data.tagLine,
        puuid: res.data.puuid,
      };
      const idsUrl = `https://${region}.api.riotgames.com/tft/match/v1/matches/by-puuid/${encodeURIComponent(
        account.puuid,
      )}/ids?start=0&count=25`;
      const idsRes = await riotFetchJson<string[]>(idsUrl);
      if (!idsRes.ok) {
        console.error(idsRes.errorText ?? "Failed to fetch match IDs.");
        return null;
      }
      return {
        account,
        matchIds: idsRes.data,
      };
    }),
  );
  const definedPlayers = players.filter((player) => player !== null);
  const duos: Duo[] = definedPlayers.flatMap((player1, index1) =>
    definedPlayers.slice(index1 + 1).map((player2) => ({
      players: [player1.account, player2.account],
      matchIds: player1.matchIds.filter((matchId) =>
        player2.matchIds.includes(matchId),
      ),
      matchesAsDuo: [],
      averagePlacement: Number.POSITIVE_INFINITY,
    })),
  );
  const matches: Match[] = [];
  for (const matchId of Array.from(
    new Set(duos.flatMap((duo) => duo.matchIds)),
  )) {
    const matchUrl = `https://${region}.api.riotgames.com/tft/match/v1/matches/${encodeURIComponent(
      matchId,
    )}`;
    const matchRes = await riotFetchJson<Match>(matchUrl);
    if (!matchRes.ok) {
      console.error(matchRes.errorText ?? "Failed to fetch match details.");
      continue;
    }
    matches.push(matchRes.data);
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  const definedMatches = matches.filter((match) => match !== null);
  const doubleUpMatches = definedMatches.filter(
    (match) =>
      match.info.tft_game_type === "pairs" && match.info.tft_set_number === 16,
  );
  duos.forEach((duo) => {
    duo.matchesAsDuo = doubleUpMatches.filter(
      (match) =>
        match.metadata.participants.includes(duo.players[0].puuid) &&
        match.metadata.participants.includes(duo.players[1].puuid) &&
        match.info.participants.find(
          (participant) => participant.puuid === duo.players[0].puuid,
        )?.partner_group_id ===
          match.info.participants.find(
            (participant) => participant.puuid === duo.players[1].puuid,
          )?.partner_group_id,
    );
    if (duo.matchesAsDuo.length > 0) {
      duo.averagePlacement =
        duo.matchesAsDuo.reduce(
          (acc, match) =>
            acc +
            Math.ceil(
              (match.info.participants.find(
                (participant) => participant.puuid === duo.players[0].puuid,
              )?.placement ?? 0) / 2,
            ),
          0,
        ) / duo.matchesAsDuo.length;
    }
  });
  return duos;
}
