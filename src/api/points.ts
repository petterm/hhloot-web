import { Player, PlayerItemEntry, EntryScore, Instance } from "../types";
import attendanceData from '../data/attendance.json';
import { nonBonusRaidCount, attendanceRaidCount } from "../constants";

export type Attendance = {
    key: string,
    value: number,
    raid?: string,
    date?: string,
};

type AttendanceData = {
    [key: string]: Attendance[]
}

const hasBonusAttendance = (attendance: Attendance) => attendance.date && attendance.value >= 0.1;

const filterBonusRaids = (raids: Attendance[], instance: Instance): Attendance[] =>
    raids.slice(nonBonusRaidCount[instance]);

const getPlayerBonusRaids = (player: Player, instance: Instance): Attendance[] => {
    const attendanceList = attendanceData as AttendanceData;
    if (player.name in attendanceList) {
        return filterBonusRaids(attendanceList[player.name], instance);
    }
    return [];
};

const getPlayerPositionBonus = (player: Player, instance: Instance) => {
    let bonus = 0;
    const bonusRaids = getPlayerBonusRaids(player, instance);
    for (const i in bonusRaids) {
        const value = bonusRaids[i];
        if (hasBonusAttendance(value)) {
            bonus += 1;
        }
    }

    return bonus;
}

const getPlayerAttendanceRaids = (player: Player): Attendance[] => {
    const attendanceList = attendanceData as AttendanceData;
    if (player.name in attendanceList) {
        return attendanceList[player.name].slice(-attendanceRaidCount);
    }
    return [];
};

const getPlayerAttendance = (player: Player): number => {
    if (typeof(player.calculatedAttendance) === 'undefined') {
        const playerAttendanceList: Attendance[] = getPlayerAttendanceRaids(player);
        if (playerAttendanceList.length) {
            player.calculatedAttendance = playerAttendanceList.reduce((sum, attendance) => sum + attendance.value, 0) / playerAttendanceList.length;
            // Round to 1 digit
            player.calculatedAttendance = Math.round(player.calculatedAttendance * 100) / 100;
        } else {
            player.calculatedAttendance = 0;
        }
    }
    return player.calculatedAttendance
}

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
}

export type CombinedPlayerAttendance = {
    info: Attendance,
    bonus?: number,
    attendance?: number,
};

export const getCombinedPlayerAttendanceList = (player: Player, instance: Instance): CombinedPlayerAttendance[] => {
    const attendanceRaids = getPlayerAttendanceRaids(player);
    const bonusRaids = getPlayerBonusRaids(player, instance);

    const combined: { [key: string]: CombinedPlayerAttendance } = {};
    for (const i in bonusRaids) {
        const attendance = bonusRaids[i];
        combined[attendance.key] = {
            info: attendance,
            bonus: hasBonusAttendance(attendance) ? 1 : undefined,
        }
    }

    for (const i in attendanceRaids) {
        const attendance = attendanceRaids[i];
        if (!combined[attendance.key]) {
            combined[attendance.key] = {
                info: attendance
            };
        }
        combined[attendance.key].attendance = attendance.value;
    }

    return Object.values(combined);
}