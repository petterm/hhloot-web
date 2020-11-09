import reservations from '../data/aq40_reservation.json';
import itemIcons from '../data/item_icons.json';
import { ItemScore, Player, PlayerItemEntry, Class, Instance } from '../types';
import { getRaids, getPlayersData, getPlayers } from './async';
import { getBossDrops } from './loot';


const createEntry = (instance: Instance, score: ItemScore, itemName?: string): PlayerItemEntry => {
    const bossDropMap = getBossDrops(instance);
    const playerEntry: PlayerItemEntry = {
        itemBonusEvents: [],
        score: score,
    };
    if (itemName) {
        let bossDrop = bossDropMap[itemName];
        if (bossDrop) {
            playerEntry.item = bossDrop.item;
        } else {
            console.warn(`Invalid item entry ${itemName}`)
        }
    }
    return playerEntry
};

const parsePlayerReservations = (instance: Instance): void => {
    const players = getPlayersData();
    const playerMap = getPlayers();
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

        player.scoreSlots.push(createEntry(instance, 100, playerReservation['100_score']))
        player.scoreSlots.push(createEntry(instance, 90, playerReservation['90_score']))
        player.scoreSlots.push(createEntry(instance, 80, playerReservation['80_score']))
        player.scoreSlots.push(createEntry(instance, 70, playerReservation['70_score']))
        player.scoreSlots.push(createEntry(instance, 65, playerReservation['65_score']))
        player.scoreSlots.push(createEntry(instance, 60, playerReservation['60_score']))
        player.scoreSlots.push(createEntry(instance, 55, playerReservation['55_score']))
        player.scoreSlots.push(createEntry(instance, 54, playerReservation['54_score']))
        player.scoreSlots.push(createEntry(instance, 53, playerReservation['53_score']))
        player.scoreSlots.push(createEntry(instance, 52, playerReservation['52_score']))

        playerMap[playerName] = player;
    })
};

const markReceivedItems = (instance: Instance) => {
    const playerMap = getPlayers();
    const bossDropMap = getBossDrops(instance);
    const raids = getRaids()
    for (let i in raids) {
        const raid = raids[i];
        for (let j in raid.loot) {
            const lootEvent = raid.loot[j];
            const player = playerMap[lootEvent.character];

            // Award item
            if (player) {
                const playerSlots = player.scoreSlots;
                const index = playerSlots.findIndex(
                    entry => !entry.received && entry.item && entry.item.name === lootEvent.item
                );
                if (index !== -1) {
                    playerSlots[index].received = raid.date;
                } else {
                    bossDropMap[lootEvent.item].freeLoot.push(player.name)
                }
            } else {
                console.warn('Loot event for unknown player', lootEvent.character);
            }

            // Add bonus event for player
            for (const k in lootEvent.bonusCharacters) {
                const bonusPlayer = playerMap[lootEvent.bonusCharacters[k]];
                if (bonusPlayer) {
                    const playerSlots = bonusPlayer.scoreSlots;
                    const index = playerSlots.findIndex(
                        entry => !entry.received && entry.item && entry.item.name === lootEvent.item
                    );
                    if (index !== -1) {
                        playerSlots[index].itemBonusEvents.push(raid.date);
                    } else {
                        console.warn('Item bonus for item not on players list', raid.date, bonusPlayer.name, lootEvent.item);
                    }
                } else {
                    console.warn('Item bonus for unknown player', raid.date, lootEvent.bonusCharacters[k], lootEvent.item);
                }
            }
        }
    }
}

const addPlayerReservationsToItems = (instance: Instance) => {
    const playerMap = getPlayers();
    const bossDropMap = getBossDrops(instance);
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


export const getPlayer = (name: string): Player => {
    const players = getPlayers();
    return players[name];
};

export const getItemIcon = (id: number) => (itemIcons as {[key: number]: string})[id];

export const prepareData = (instance: Instance) => {
    parsePlayerReservations(instance);
    markReceivedItems(instance);
    addPlayerReservationsToItems(instance);
};
