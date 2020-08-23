
export type ItemScore = 100 | 90 | 80 | 70 | 65 | 60 | 55 | 54 | 53 | 52;

export interface Item {
    name: string;
    id: number;
}

export interface PlayerItemEntry {
    item?: Item;
    itemBonusEvents: string[];
    score: ItemScore;
    received: boolean;
}

interface PlayerRaidEvent {
    date: string;
    attendanceValue: number;
    attendenceBonus: 0 | 1;
}

export interface Player {
    name: string;
    scoreSlots: PlayerItemEntry[];
    attendedRaids: PlayerRaidEvent[];
}

export interface BossDrop {
    item: Item;
    reservations: {
        playerName: string;
        entry: PlayerItemEntry;
    }[];
}

export interface Boss {
    name: string;
    drops: BossDrop[];
    index: number;
}