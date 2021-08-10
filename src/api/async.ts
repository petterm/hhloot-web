import Axios from "axios";
import moment from 'moment';
import { bonusRaidStartDate, tbcAttendanceStartDate } from "../constants";
import { Class, GuildRank, Instance, Player } from "../types";
import { LoginStatusResponse, PlayersResponse, PlayersResponseRaid, ReservationsResponse } from "./apiTypes";
import { getItem } from "./loot";
import { getItemScores } from "./reservations";
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

const lootSheetTab = (instance: Instance): string => {
    if (instance === 'aq40') return 'Loot';
    if (instance === 'naxx') return 'LootNaxx';
    if (instance === 'tbc1') return 'LootTBC1';
    throw Error(`Unknown instance ${instance}`);
}

const isTBCRaid = (instance: Instance): boolean => ['tbc1'].includes(instance);

const raidBonus = (raid: PlayersResponseRaid, instance: Instance): { value: number } | undefined =>
    moment(raid.date).isSameOrAfter(bonusRaidStartDate[instance]) ?
        { value: raid.attendance >= 0.1 ? 1 : 0 } : undefined;

export const fetchData = (instance: Instance) => Promise.all([
    Axios.get<PlayersResponse>('/api/players')
        .then(({ data }) => {
            const ranks: GuildRank[] = ['Guild Master', 'Officer', 'Member', 'Initiate'];
            players = data.filter((player) => ranks.includes(player.guildRank))
            for (const i in players) {
                const player = players[i];
                playerMap[player.name] = {
                    attendedRaids: player.raidAttendance.filter(raid => !isTBCRaid(instance) || !raid.date || tbcAttendanceStartDate.isBefore(raid.date))
                        .map(raid => ({
                            attendanceValue: raid.attendance,
                            date: raid.date,
                            instanceName: raid.instance,
                            bonus: raidBonus(raid, instance),
                        })),
                    name: player.name,
                    class: player.class as Class,
                    guildRank: player.guildRank,
                    scoreSlots: getItemScores(instance).map(score => ({ score, itemBonusEvents: [] })),
                }
            }
            return playerMap;
        }),
    Axios.get<ReservationsResponse>('/api/reservations/approved')
        .then(({ data }) => data),
    getSheet('1vzK9lPih35GSUPbxLreslyihxPSSIXhS3JW_GWRf7Lw', lootSheetTab(instance))
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
    reservations.forEach(({ name, instance: reservationInstance, slots: reservationSlots }) => {
        const player = players[name];
        if (player && reservationInstance === instance) {
            player.scoreSlots.forEach((playerSlot, index) => {
                const itemId = reservationSlots[index];
                if (itemId) {
                    playerSlot.item = getItem(itemId);
                }
            });
        }
    });
});

export const checkLogin = () =>
    process.env.NODE_ENV === 'development' ? Promise.resolve('Meche') :
    Axios.get<LoginStatusResponse>('/api/loginstatus')
        .then(({ data }) => data.authenticated ? data.character : undefined)
        .catch(() => undefined)
