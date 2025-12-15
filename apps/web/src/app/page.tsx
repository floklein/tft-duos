import { getDuos } from "@/lib/getDuos";

const REGION = "europe";
const PLAYERS: [string, string][] = [
  ["FloKmc", "EUW"],
  ["Un mec moyen", "6969"],
  ["Je dois rename", "EUW"],
  ["APAF06", "EUW"],
];

export default async function Home() {
  const duos = (await getDuos(REGION, PLAYERS)).sort(
    (a, b) => a.averagePlacement - b.averagePlacement,
  );

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <pre className="grid gap-6">
        {duos.map((duo) => (
          <div key={duo.players[0].puuid + duo.players[1].puuid}>
            <h2 className="font-bold text-xl">
              {duo.players[0].gameName} & {duo.players[1].gameName}{" "}
              <span className="text-gray-500">
                - {duo.averagePlacement.toLocaleString()}
              </span>
            </h2>
            <p className="text-gray-500 text-sm">
              {duo.matchesAsDuo.length.toLocaleString()} parties
            </p>
          </div>
        ))}
      </pre>
    </div>
  );
}
