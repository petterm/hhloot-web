import Axios, { AxiosResponse } from "axios";
import moment from 'moment';
import { getInstanceData } from ".";
import { wotlkAttendanceStartDate } from "../constants";
import { Class, GuildRank, Instance, InstanceData, Player } from "../types";
import { LoginStatusResponse, PlayersResponse, PlayersResponseRaid, ReservationsResponse } from "./apiTypes";
import { getItem } from "./loot";
import { getSheet } from "./sheets";
import reservationsDevApproved from "../data/reservations_approved.json";

type Loot = {
    character?: string,
    item: string,
    bonusCharacters: string[],
};
type PlayerMap = {
    [key: string]: Player,
};
export type Raid = {
    date: string,
    loot: Loot[],
    stats: {
        reserved: number,
        free: number,
        total: number,
    }
}

let raids: Raid[];
let players: PlayersResponse = [];
const playerMap: PlayerMap = {};

export const getRaids = (): Raid[] => raids;
export const getPlayers = (): PlayerMap => playerMap;
export const getPlayersData = (): PlayersResponse => players;

const isTBCRaid = (instance: Instance): boolean => ['tbc1'].includes(instance);

const raidBonus = (raid: PlayersResponseRaid, instanceData: InstanceData): { value: number } | undefined =>
    moment(raid.date).isSameOrAfter(instanceData.bonusRaidStartDate) ?
        { value: raid.attendance >= 0.1 ? 1 : 0 } : undefined;

const saveAndFormatPlayers: (instance: Instance, instanceData: InstanceData) => (response: AxiosResponse<PlayersResponse>) => PlayerMap =
    (instance, instanceData) => ({ data }) => {
        const ranks: GuildRank[] = ['Guild Master', 'Officer', 'Member', 'Initiate'];
        players = data.filter((player) => ranks.includes(player.guildRank))
        for (const i in players) {
            const player = players[i];
            playerMap[player.name] = {
                attendedRaids: player.raidAttendance.filter(raid => !isTBCRaid(instance) || !raid.date || wotlkAttendanceStartDate.isBefore(raid.date))
                    .map(raid => ({
                        attendanceValue: raid.attendance,
                        date: raid.date,
                        instanceName: raid.instance,
                        bonus: raidBonus(raid, instanceData),
                    })),
                name: player.name,
                class: player.class as Class,
                guildRank: player.guildRank,
                scoreSlots: instanceData.itemScores.map(score => ({ score, itemBonusEvents: [] })),
            }
        }
        return playerMap;
    }

const saveAndFormatReceivedLoot: (instance: Instance, instanceData: InstanceData) => (sheetRows: string[][]) => Raid[] =
    (instance, instanceData) => (sheetRows) => {
        const raidsRaw: { [date: string]: Raid } = {};
        sheetRows.forEach((value, index) => {
            if (index === 0) return;
            
            const row = sheetRows[index];
            const [date, character, item] = row;
            const bonusPlayers = row.slice(3).filter(val => !!val.length);
            if (date && date.length && item && item.length) {
                if (!raidsRaw[date]) raidsRaw[date] = { date, loot: [], stats: { free: 0, reserved: 0, total: 0} };

                const loot: Loot = {
                    character: character && character.length ? character : undefined,
                    item,
                    bonusCharacters: [],
                };
                for (const y in bonusPlayers) {
                    loot.bonusCharacters.push(bonusPlayers[y]);
                }
                raidsRaw[date].loot.push(loot);
                raidsRaw[date].stats.total++;
            }
        });

        raids = Object.values(raidsRaw);
        return raids;
    }

const fetchReservations = (instance: Instance): Promise<ReservationsResponse> => 
    process.env.NODE_ENV === 'development' && instance === 'wotlk1' ?
    Promise.resolve(reservationsDevApproved as ReservationsResponse) :
    Axios.get<ReservationsResponse>('/api/reservations/approved', {
        params: { instance }
    })
        .then(({ data }) => data)
        .catch(({ error }) => {
            console.error(error);
            return [];
        });

export const fetchData = (instance: Instance, skipReservations: Boolean) => {
    const instanceData = getInstanceData(instance);
    return Promise.all([
        // Fetch player data and format
        Axios.get<PlayersResponse>('/api/players').then(saveAndFormatPlayers(instance, instanceData)),
        // Get reservations
        skipReservations ? [] : fetchReservations(instance),
        // Get received loot
        getSheet(instanceData.lootSheetID, instanceData.lootSheetTab).then(saveAndFormatReceivedLoot(instance, instanceData)),
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
}

export const checkLogin = () =>
    // process.env.NODE_ENV === 'development' ? Promise.resolve(undefined) :
    process.env.NODE_ENV === 'development' ? Promise.resolve('Calavera') :
    Axios.get<LoginStatusResponse>('/api/loginstatus')
        .then(({ data }) => data.authenticated ? data.character : undefined)
        .catch(() => undefined)
