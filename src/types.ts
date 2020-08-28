
export type ItemScore = 100 | 90 | 80 | 70 | 65 | 60 | 55 | 54 | 53 | 52;

export type Class = 'DRUID' | 'HUNTER' | 'MAGE' | 'PALADIN' | 'PRIEST' | 'ROGUE' | 'WARLOCK' | 'WARRIOR';

export type Date = string;
export type GuildRank = string;
export type PlayerName = string;

export interface Item {
    name: string;
    id: number;
}

export interface PlayerItemEntry {
    item?: Item;
    itemBonusEvents: string[];
    score: ItemScore;
    received?: Date;
    calcualtedScore?: EntryScore;
}

interface PlayerRaidEvent {
    date: Date;
    attendanceValue: number;
    attendenceBonus: 0 | 1;
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
    reservations: {
        playerName: PlayerName;
        entry: PlayerItemEntry;
    }[];
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