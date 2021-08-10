import { instanceData } from '../constants';
import { Instance, InstanceData, Player, PlayerItemEntry } from '../types';
import { getRaids, getPlayers } from './async';
import { getBossDrops } from './loot';

const markReceivedItems = () => {
    const playerMap = getPlayers();
    const bossDropMap = getBossDrops();
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
                    bossDropMap[lootEvent.item].freeLoot.push({
                        playerName: player.name,
                        date: raid.date,
                    });
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

const addPlayerReservationsToItems = () => {
    const playerMap = getPlayers();
    const bossDropMap = getBossDrops();
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
    if (name in players) {
        return players[name];
    }
    throw Error(`Unknown player ${name}`);
};

export const prepareData = () => {
    markReceivedItems();
    addPlayerReservationsToItems();
};

export const getInstanceData = (instance: Instance): InstanceData => {
    const data = instanceData[instance];
    if (!data) {
        throw Error(`Unknown instance ${instance}`);
    }
    return data;
}
