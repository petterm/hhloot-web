import reservations from '../data/aq40_reservation.json';
import lootTable from '../data/aq40_loot_table.json';
import itemIcons from '../data/item_icons.json';
import players from '../data/players.json';
import { Boss, BossDrop, ItemScore, Player, PlayerItemEntry, Class } from '../types';

let setup = true;

type BossMap = { [key: string]: Boss; };
const bossMap: BossMap = {};

type BossDropMap = { [key: string]: BossDrop; };
const bossDropMap: BossDropMap = {};

type PlayerMap = { [key: string]: Player };
const playerMap: PlayerMap = {};

const parseLootTable = (): void => {
    let index = 0;

    lootTable.forEach((dropJson) => {
        const bosses = dropJson['Boss'].split(',').map(str => str.trim())
        bosses.forEach(bossName => {
            if (!bossName) return;
    
            const drop: BossDrop = bossDropMap[dropJson['Item Name']] || {
                reservations: [],
                item: {
                    id: parseInt(dropJson['Item ID']),
                    name: dropJson['Item Name'],
                },
            };
            
            if (bossMap[bossName]) {
                bossMap[bossName].drops.push(drop)
            } else {
                bossMap[bossName] = {
                    name: bossName,
                    drops: [drop],
                    index: index++,
                }
            }
    
            bossDropMap[dropJson['Item Name']] = drop;
        })
    })

    for (const [, boss] of Object.entries(bossMap)) {
        boss.drops.sort((a,b) => a.item.name.localeCompare(b.item.name))
    }
};

const createEntry = (score: ItemScore, itemName: string): PlayerItemEntry => {
    const playerEntry: PlayerItemEntry = {
        itemBonusEvents: [],
        received: false,
        score: score,
    };
    if (itemName) {
        let bossDrop = bossDropMap[itemName]
        if (bossDrop) {
            playerEntry.item = bossDrop.item;
        } else {
            console.warn(`Invalid item entry ${itemName}`)
        }
    }
    return playerEntry
};

const parsePlayerReservations = (): void => {
    reservations.forEach(playerReservation => {
        const playerName = playerReservation.character;
        const player: Player = {
            attendedRaids: [],
            name: playerName,
            scoreSlots: [],
        }

        const playerInfo = players.find(info => info.name === playerName)
        if (playerInfo) {
            player.class = playerInfo.class as Class;
            player.guildRank = playerInfo.guildRank
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
};

const addPlayerReservationsToItems = () => {
    for (let name in playerMap) {
        const player: Player = playerMap[name];

        for (let i in player.scoreSlots) {
            const itemEntry: PlayerItemEntry = player.scoreSlots[i];

            if (itemEntry.item) {
                bossDropMap[itemEntry.item.name].reservations.push({
                    playerName: player.name,
                    entry: itemEntry,
                })
            }
        }
    }
};

export const getBosses = (): BossMap => {
    if (setup) {
        parseLootTable();
        parsePlayerReservations();
        addPlayerReservationsToItems()
        setup = false;
    }
    return bossMap;
};

export const getBoss = (name: string) => getBosses()[name];

export const getPlayers = (): PlayerMap => {
    if (setup) {
        parseLootTable();
        parsePlayerReservations();
        addPlayerReservationsToItems()
        setup = false;
    }
    return playerMap;
};

export const getPlayer = (name: string): Player => {
    const players = getPlayers();
    return players[name];
};

export const getItemIcon = (id: number) => (itemIcons as {[key: number]: string})[id];
