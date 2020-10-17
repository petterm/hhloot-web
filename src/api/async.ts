import Axios from "axios";
import { itemScores } from "../constants";
import { Class, GuildRank, Player } from "../types";
import { getSheet } from "./sheets";

type Loot = {
    character: string,
    item: string,
    bonusCharacters: string[],
};

export interface Raid {
    date: string,
    loot: Loot[],
}
let raids: Raid[];

type PlayerRaw = {
    name: string,
    class: Class,
    guildRank: GuildRank,
};
let players: PlayerRaw[];

type PlayerMap = { [key: string]: Player };
const playerMap: PlayerMap = {};

export const getRaids = (): Raid[] => raids;
export const getPlayers = (): PlayerMap => playerMap;
export const getPlayersData = (): PlayerRaw[] => players;

export const fetchData = () =>
    Axios.get('/Api/Players')
        .then((response) => {
            const ranks: GuildRank[] = ['Guild Master', 'Officer', 'Member', 'Initiate'];
            players = response.data.filter((player: PlayerRaw) => ranks.includes(player.guildRank))
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
        })
        .then(() => 
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
                })
        );
