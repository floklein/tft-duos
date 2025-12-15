import { getDuos } from "@/lib/getDuos";

const REGION = "europe";
const PLAYERS: [string, string][] = [
  ["FloKmc", "EUW"],
  ["Un mec moyen", "6969"],
  ["Je dois rename", "EUW"],
  ["APAF06", "EUW"],
];

export default async function Home() {
  const duos = await getDuos(REGION, PLAYERS);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <div className="grid gap-6">
        {duos.map((matchHistory) =>
          "error" in matchHistory ? (
            <div className="rounded-lg border p-4" key={matchHistory.error}>
              <p className="text-red-600">{matchHistory.error}</p>
            </div>
          ) : (
            <section
              className="rounded-lg border p-4"
              key={matchHistory.account.puuid}
            >
              <h2 className="mb-2 font-medium">TFT Match History</h2>
              <div className="grid gap-3 text-sm">
                <div className="text-muted-foreground">
                  {matchHistory.account.gameName} #
                  {matchHistory.account.tagLine}
                </div>

                <ul className="grid gap-2">
                  {matchHistory.matches?.map((match) =>
                    "error" in match ? (
                      <li
                        key={match.error}
                        className="rounded border px-3 py-2 font-mono text-xs"
                      >
                        <p className="text-red-600">{match.error}</p>
                      </li>
                    ) : (
                      <li
                        key={match.metadata.match_id}
                        className="rounded border px-3 py-2 font-mono text-xs"
                      >
                        <pre>{JSON.stringify(match, null, 2)}</pre>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </section>
          ),
        )}
      </div>
    </div>
  );
}
