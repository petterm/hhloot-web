import moment from "moment";
import { Player, PlayerItemEntry, EntryScore, Instance, PlayerRaidEvent } from "../types";
import { attendanceRaidCount } from "../constants";

const getPlayerPositionBonus = (player: Player, instance: Instance) => 
    player.attendedRaids.reduce((sum, raid) => raid.bonus ? sum + raid.bonus.value : sum, 0);

const getPlayerAttendanceRaids = (player: Player): PlayerRaidEvent[] =>
    player.attendedRaids.slice(-attendanceRaidCount);

const getPlayerAttendance = (player: Player): number => {
    if (typeof(player.calculatedAttendance) === 'undefined') {
        const playerAttendanceList: PlayerRaidEvent[] = getPlayerAttendanceRaids(player);
        let attendanceSum = playerAttendanceList.reduce((sum, attendance) => sum + attendance.attendanceValue, 0);

        // Pad attendance with 100% raids for new players
        if (playerAttendanceList.length < attendanceRaidCount) {
            attendanceSum += attendanceRaidCount - playerAttendanceList.length
        }

        player.calculatedAttendance =  attendanceSum / attendanceRaidCount;

        // Round to 1 digit
        player.calculatedAttendance = Math.round(player.calculatedAttendance * 100) / 100;
    }
    return player.calculatedAttendance
};

export const getFinalScore = (entry: PlayerItemEntry, player: Player, instance: Instance): number =>
    entry.score + getItemBonus(entry, player) + getPositionBonus(player, instance) + getAttendanceBonus(player);

export const getItemBonus = (entry: PlayerItemEntry, player: Player): number =>
    entry.item === null ? 0: entry.itemBonusEvents.length;

export const getPositionBonus = (player: Player, instance: Instance): number => {
    if (!player.positionBonus) {
        player.positionBonus = getPlayerPositionBonus(player, instance);
    }
    return player.positionBonus;
};

export const getAttendanceBonus = (player: Player) => {
    const value = getPlayerAttendance(player) * 10;
    return Math.round(value * 10) / 10;
};

export const getEntryScore = (entry: PlayerItemEntry, player: Player, instance: Instance): EntryScore => {
    if (!entry.calcualtedScore) {
        entry.calcualtedScore = {
            base: entry.score,
            position: getPositionBonus(player, instance),
            item: getItemBonus(entry, player),
            attendance: getAttendanceBonus(player),
            total: getFinalScore(entry, player, instance),
        }
    }
    return entry.calcualtedScore;
};

export const getSortedPaddedRaids = (player: Player) => {
    let attendanceRaids = [...player.attendedRaids];
    attendanceRaids.sort((a, b) => moment(a.date).isAfter(b.date) ? -1 : 1);
    attendanceRaids = attendanceRaids.filter((raid, index) => raid.bonus || index + 1 <= attendanceRaidCount);
    while (attendanceRaids.length < attendanceRaidCount) {
        attendanceRaids.push({
            attendanceValue: 1,
            date: '-',
            instanceName: '-',
        });
    }
    return attendanceRaids;
};
