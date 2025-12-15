import { PodiumCard } from "@/components/podium-card";
import { RankingRow } from "@/components/ranking-row";
import { Card, CardContent } from "@/components/ui/card";
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

  const topThree = duos.slice(0, 3);
  const rest = duos.slice(3);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="mb-2 font-bold text-4xl tracking-tight">
          Classement TFT Double Up
        </h1>
        <p className="text-muted-foreground">
          Qui est le meilleur duo ? Les stats décident.
        </p>
      </div>
      {topThree.length >= 3 && (
        <div className="mb-12 grid grid-cols-3 items-end gap-4">
          <PodiumCard duo={topThree[1]} rank={2} variant="silver" />
          <PodiumCard duo={topThree[0]} rank={1} variant="gold" />
          <PodiumCard duo={topThree[2]} rank={3} variant="bronze" />
        </div>
      )}
      {rest.length > 0 && (
        <div className="space-y-3">
          {rest.map((duo, index) => (
            <RankingRow
              key={duo.players[0].puuid + duo.players[1].puuid}
              duo={duo}
              rank={index + 4}
            />
          ))}
        </div>
      )}
      {duos.length === 0 && (
        <Card className="py-12 text-center">
          <CardContent>
            <p className="text-muted-foreground">
              Aucune partie en duo trouvée. Jouez des parties Double Up ensemble
              !
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
