export interface Match {
  metadata: Metadata;
  info: Info;
}

export interface Metadata {
  data_version: string;
  match_id: string;
  participants: string[];
}

export interface Info {
  endOfGameResult: string;
  gameCreation: number;
  gameId: number;
  game_datetime: number;
  game_length: number;
  game_version: string;
  game_variation?: string;
  mapId: number;
  participants: Participant[];
  queue_id: number;
  queueId?: number;
  tft_game_type: string;
  tft_set_core_name: string;
  tft_set_number: number;
}

export interface Participant {
  companion: Companion;
  gold_left: number;
  last_round: number;
  level: number;
  placement: number;
  players_eliminated: number;
  puuid: string;
  riotIdGameName: string;
  riotIdTagline: string;
  time_eliminated: number;
  total_damage_to_players: number;
  traits: Trait[];
  units: Unit[];
  win: boolean;
  partner_group_id?: number;
}

export interface Companion {
  content_ID: string;
  item_ID: number;
  skin_ID: number;
  species: string;
}

export interface Trait {
  name: string;
  num_units: number;
  style: number;
  tier_current: number;
  tier_total: number;
}

export interface Unit {
  items: number[];
  character_id: string;
  itemNames: string[];
  chosen?: string;
  name: string;
  rarity: number;
  tier: number;
}
