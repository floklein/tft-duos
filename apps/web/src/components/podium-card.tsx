import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Duo } from "@/types/duo";

export function PodiumCard({
  duo,
  rank,
  variant,
}: {
  duo: Duo;
  rank: number;
  variant: "gold" | "silver" | "bronze";
}) {
  const colors = {
    gold: {
      bg: "from-amber-400/20 to-yellow-500/10",
      border: "border-amber-400/50",
      medal: "🥇",
      height: "h-48",
    },
    silver: {
      bg: "from-slate-300/20 to-slate-400/10",
      border: "border-slate-400/50",
      medal: "🥈",
      height: "h-40",
    },
    bronze: {
      bg: "from-orange-400/20 to-orange-600/10",
      border: "border-orange-400/50",
      medal: "🥉",
      height: "h-32",
    },
  };

  const style = colors[variant];

  return (
    <div
      className={`flex flex-col items-center ${variant === "gold" ? "order-2" : variant === "silver" ? "order-1" : "order-3"}`}
    >
      <Card
        className={`w-full rounded-b-none border-b-0 bg-linear-to-b ${style.bg} ${style.border} border-2 transition-all hover:scale-105 hover:rounded-b-xl hover:border-b-2`}
      >
        <CardHeader className="pb-2 text-center">
          <div className="mb-2 text-4xl">{style.medal}</div>
          <CardTitle className="text-lg">{duo.players[0].gameName}</CardTitle>
          <CardTitle className="text-lg">{duo.players[1].gameName}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 text-center">
          <div className="font-bold text-3xl text-foreground">
            {duo.averagePlacement.toFixed(2)}
          </div>
          <div className="mt-1 text-muted-foreground text-sm">
            placement moy.
          </div>
          <div className="mt-3 text-muted-foreground text-sm">
            <span className="font-semibold text-foreground">
              {duo.matchesAsDuo.length}
            </span>{" "}
            parties jouées
          </div>
        </CardContent>
      </Card>
      <div
        className={`w-full ${style.height} bg-linear-to-t ${style.bg} rounded-b-xl border-2 border-t-0 ${style.border} flex items-center justify-center`}
      >
        <span className="font-black text-5xl text-muted-foreground/50">
          {rank}
        </span>
      </div>
    </div>
  );
}
