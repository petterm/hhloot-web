import Axios from "axios";
import { itemScores } from "../constants";
import { Class, GuildRank, Player } from "../types";
import { PlayersResponse, ReservationsResponse } from "./apiTypes";
import { getItem } from "./loot";
import { getSheet } from "./sheets";

type Loot = {
    character: string,
    item: string,
    bonusCharacters: string[],
};
type PlayerMap = {
    [key: string]: Player,
};
export type Raid = {
    date: string,
    loot: Loot[],
}

let raids: Raid[];
let players: PlayersResponse = [];
const playerMap: PlayerMap = {};

export const getRaids = (): Raid[] => raids;
export const getPlayers = (): PlayerMap => playerMap;
export const getPlayersData = (): PlayersResponse => players;

export const fetchData = () => Promise.all([
    Axios.get<PlayersResponse>('/api/players')
        .then(({ data }) => {
            const ranks: GuildRank[] = ['Guild Master', 'Officer', 'Member', 'Initiate'];
            players = data.filter((player) => ranks.includes(player.guildRank))
            for (const i in players) {
                const player = players[i];
                playerMap[player.name] = {
                    attendedRaids: [],
                    name: player.name,
                    class: player.class as Class,
                    guildRank: player.guildRank,
                    scoreSlots: itemScores.map(score => ({ score, itemBonusEvents: [] })),
                }
            }
            return playerMap;
        }),
    Axios.get<ReservationsResponse>('/api/reservations/approved')
        .then(({ data }) => data),
    getSheet('1vzK9lPih35GSUPbxLreslyihxPSSIXhS3JW_GWRf7Lw', 'Loot')
        .then((sheetRows) => {
            const raidsRaw: { [date: string]: Raid } = {};
            sheetRows.forEach((value, index) => {
                if (index === 0) return;
                
                const row = sheetRows[index];
                const [date, character, item] = row;
                const bonusPlayers = row.slice(3).filter(val => !!val.length);
                if (date && date.length && character && character.length && item && item.length) {
                    if (!raidsRaw[date]) raidsRaw[date] = { date, loot: [] };

                    const loot: Loot = {
                        character,
                        item,
                        bonusCharacters: [],
                    };
                    for (const y in bonusPlayers) {
                        loot.bonusCharacters.push(bonusPlayers[y]);
                    }
                    raidsRaw[date].loot.push(loot);
                }
            });

            raids = Object.values(raidsRaw);
            return raids;
        }),
]).then(([players, reservations, raids]) => {
    reservations.forEach(({ name, instance, slots: reservationSlots }) => {
        const player = players[name];
        if (player) {
            // TODO add other instances
            if (instance === 'aq40') {
                player.scoreSlots.forEach((playerSlot, index) => {
                    const itemId = reservationSlots[index];
                    if (itemId) {
                        playerSlot.item = getItem(itemId)
                    }
                });
            }
        }
    });
});
