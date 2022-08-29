import { Moment } from "moment";

export type ItemScore = 100 | 90 | 80 | 70 | 65 | 60 | 55 | 54 | 53 | 52 | 10;

export type CamelCasedClass =
  | "Druid"
  | "Hunter"
  | "Mage"
  | "Paladin"
  | "Priest"
  | "Rogue"
  | "Shaman"
  | "Warlock"
  | "Warrior";

export type Class =
  | "DRUID"
  | "HUNTER"
  | "MAGE"
  | "PALADIN"
  | "PRIEST"
  | "ROGUE"
  | "SHAMAN"
  | "WARLOCK"
  | "WARRIOR";

export type Date = string;
export type GuildRank =
  | "Guild Master"
  | "Officer"
  | "Officer alt"
  | "Member"
  | "Initiate"
  | "Social"
  | "Alt";
export type PlayerName = string;
export type Instance = "aq40" | "naxx" | "tbc1" | "tbc2" | "tbc3" | "tbc5";

export interface InstanceData {
  name: string;
  image: string;
  bonusRaidStartDate: Moment;
  lootSheetID: string;
  lootSheetTab: string;
  itemScores: ItemScore[];
  scoreGroupEdges: ItemScore[];
}

export interface Item {
  name: string;
  id: number;
  restricted: boolean;
  hidden: boolean;
  icon?: string;
}

export interface PlayerItemEntry {
  item?: Item;
  itemBonusEvents: string[];
  score: ItemScore;
  received?: Date;
  calcualtedScore?: EntryScore;
}

export interface PlayerRaidEvent {
  date: Date;
  instanceName: string;
  attendanceValue: number;
  bonus?: {
    value: number;
  };
}

export interface Player {
  name: PlayerName;
  class?: Class;
  guildRank?: GuildRank;
  scoreSlots: PlayerItemEntry[];
  attendedRaids: PlayerRaidEvent[];
  calculatedAttendance?: number;
  positionBonus?: number;
}

export interface BossDrop {
  item: Item;
  groupedItems: Item[];
  instance: Instance;
  reservations: {
    playerName: PlayerName;
    entry: PlayerItemEntry;
  }[];
  freeLoot: {
    playerName: PlayerName;
    date: string;
  }[];
}

export interface Boss {
  name: string;
  drops: BossDrop[];
  index: number;
}

export interface EntryScore {
  base: number;
  position: number;
  item: number;
  attendance: number;
  total: number;
}

// Softres.it payloads and responses

export interface SoftresitRaidPayload {
  allowDuplicate: boolean;
  amount: number;
  banned: number[];
  characterNotes: boolean;
  discord: boolean;
  edition: "tbc";
  faction: "Alliance";
  hideReserves: boolean;
  instance: "sunwellplateau";
  itemLimit: 0;
  plusModifier: 1;
  restrictByClass: boolean;
}

/**
 * This response is considerably larger, but we only care about these two fields.
 */
export interface SoftresitRaidResponse {
  raidId: string;
  token: string;
}

export interface SoftresitPlayerPayload {
  payload: {
    class: string;
    items: number[];
    name: string;
  };
  token: string;
}
