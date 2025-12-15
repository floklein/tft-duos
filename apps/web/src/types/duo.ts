import type { Account } from "./account";
import type { Match } from "./match";

export interface Duo {
  players: [Account, Account];
  matchIds: string[];
  matchesAsDuo: Match[];
  averagePlacement: number;
}
