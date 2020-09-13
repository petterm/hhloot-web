import raids from '../data/aq40_raids.json'

export interface Raid {
    date: string,
    loot: {
        character: string,
        item: string,
    }[],
    itemBonus: {
        character: string,
        item: string
    }[],
}

export const getRaids = (): Raid[] => raids;

export const isBonusRaid = (raid: Raid) => true;
