import reservations from '../data/aq40_reservation.json';
import lootTable from '../data/aq40_loot_table.json';
import { Boss, BossDrop, Item, ItemScore, Player, PlayerItemEntry } from '../types';

let setup = true;

type BossMap = { [key: string]: Boss; };
const bossMap: BossMap = {};

type ItemDrop = Item & { bossName: string };
type ItemDropMap = { [key: string]: ItemDrop; };
const itemDropMap: ItemDropMap = {};

type PlayerMap = { [key: string]: Player };
const playerMap: PlayerMap = {};

const parseLootTable = (): void => {
    let index = 0;

    lootTable.forEach((dropJson) => {
        const bossName = dropJson["Boss"];

        const item: Item = {
            id: parseInt(dropJson['Item ID']),
            name: dropJson['Item Name'],
        }
        const drop: BossDrop = { reservations: [], item };
        
        if (bossMap[bossName]) {
            bossMap[bossName].drops.push(drop)
        } else {
            bossMap[bossName] = {
                name: bossName,
                drops: [drop],
                index: index++,
            }
        }

        itemDropMap[dropJson['Item Name']] = {
            bossName,
            ...item
        };
    })
}

const createEntry = (score: ItemScore, itemName: string): PlayerItemEntry => {
    const playerEntry: PlayerItemEntry = {
        itemBonusEvents: [],
        received: false,
        score: score,
    };
    if (itemName) {
        let rawItem = itemDropMap[itemName]
        if (rawItem) {
            playerEntry.item = rawItem;
        } else {
            console.warn(`Invalid item entry ${itemName}`)
        }
    }
    return playerEntry
}

const parsePlayerReservations = (): void => {
    reservations.forEach(playerReservation => {
        const playerName = playerReservation.character;
        const player: Player = {
            attendedRaids: [],
            name: playerName,
            scoreSlots: [],
        }
        player.scoreSlots.push(createEntry(100, playerReservation['100_score']))
        player.scoreSlots.push(createEntry(90, playerReservation['90_score']))
        player.scoreSlots.push(createEntry(80, playerReservation['80_score']))
        player.scoreSlots.push(createEntry(70, playerReservation['70_score']))
        player.scoreSlots.push(createEntry(65, playerReservation['65_score']))
        player.scoreSlots.push(createEntry(60, playerReservation['60_score']))
        player.scoreSlots.push(createEntry(55, playerReservation['55_score']))
        player.scoreSlots.push(createEntry(54, playerReservation['54_score']))
        player.scoreSlots.push(createEntry(53, playerReservation['53_score']))
        player.scoreSlots.push(createEntry(52, playerReservation['52_score']))

        playerMap[playerName] = player;
    })
}

export const getBosses = (): BossMap => {
    if (setup) {
        parseLootTable();
        parsePlayerReservations();
        setup = false;
    }
    return bossMap;
}

export const getBoss = (name: string) => getBosses()[name];

export const getPlayers = (): PlayerMap => {
    if (setup) {
        parseLootTable();
        parsePlayerReservations();
        setup = false;
    }
    return playerMap;
}

export const getPlayer = (name: string): Player => {
    const players = getPlayers();
    return players[name];
}
