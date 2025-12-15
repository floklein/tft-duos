import { Card, CardContent } from "@/components/ui/card";
import type { Duo } from "@/types/duo";

export function RankingRow({ duo, rank }: { duo: Duo; rank: number }) {
  return (
    <Card className="transition-all hover:bg-accent/50">
      <CardContent className="flex items-center gap-4 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-lg">
          {rank}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">
            {duo.players[0].gameName}{" "}
            <span className="font-normal text-muted-foreground">&</span>{" "}
            {duo.players[1].gameName}
          </div>
          <div className="text-muted-foreground text-sm">
            {duo.matchesAsDuo.length} parties jouées
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-2xl">
            {Number.isFinite(duo.averagePlacement)
              ? duo.averagePlacement.toFixed(2)
              : "N/A"}
          </div>
          <div className="text-muted-foreground text-xs">placement moy.</div>
        </div>
      </CardContent>
    </Card>
  );
}
