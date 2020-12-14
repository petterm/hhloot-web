export type ItemScoreAq40 = 100 | 90 | 80 | 70 | 65 | 60 | 55 | 54 | 53 | 52;
export type ItemScoreNaxx = 100 | 90 | 80 | 70 | 65 | 60 | 55 | 54 | 53 | 52;
export type ItemScore = ItemScoreAq40 | ItemScoreNaxx;

export type Class = 'DRUID' | 'HUNTER' | 'MAGE' | 'PALADIN' | 'PRIEST' | 'ROGUE' | 'WARLOCK' | 'WARRIOR';

export type Date = string;
export type GuildRank = 'Guild Master' | 'Officer' | 'Officer alt' | 'Member' | 'Initiate' | 'Social' | 'Alt';
export type PlayerName = string;
export type Instance = 'aq40' | 'naxx';

export interface Item {
    name: string;
    id: number;
    restricted: boolean;
    hidden: boolean;
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
    instanceName: string,
    attendanceValue: number;
    bonus?: {
        value: number,
    },
}

export interface Player {
    name: PlayerName;
    class?: Class,
    guildRank?: GuildRank,
    scoreSlots: PlayerItemEntry[];
    attendedRaids: PlayerRaidEvent[];
    calculatedAttendance?: number;
    positionBonus?: number;
}

export interface BossDrop {
    item: Item;
    instance: Instance,
    reservations: {
        playerName: PlayerName;
        entry: PlayerItemEntry;
    }[];
    freeLoot: PlayerName[];
}

export interface Boss {
    name: string;
    drops: BossDrop[];
    index: number;
}

export interface EntryScore {
    base: number,
    position: number,
    item: number,
    attendance: number,
    total: number,
}
