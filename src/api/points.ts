import { Player, PlayerItemEntry, EntryScore } from "../types";
import { getRaids } from "./async";
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

const filterBonusRaids = (raids: Attendance[]): Attendance[] => raids.slice(nonBonusRaidCount);

const getPlayerBonusRaids = (player: Player): Attendance[] => {
    const attendanceList = attendanceData as AttendanceData;
    if (player.name in attendanceList) {
        return filterBonusRaids(attendanceList[player.name]);
    }
    return [];
};

const getPlayerPositionBonus = (player: Player) => {
    let bonus = 0;
    const bonusRaids = getPlayerBonusRaids(player);
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

export const getFinalScore = (entry: PlayerItemEntry, player: Player ): number => {
    return entry.score + getItemBonus(entry, player) + getPositionBonus(player) + getAttendanceBonus(player);
};

// TODO: Handle bonus on item that exists more than once in a players list.
// Bonus should only count for the top entry when gained, but additional
// bonuses after fulfilling the first slot should still add to the second.
export const getItemBonus = (entry: PlayerItemEntry, player: Player): number => {
    const raids = getRaids();
    let bonus = 0;

    if (entry.item === null) return bonus;

    for (const raidIndex in raids) {
        const raid = raids[raidIndex];
        const bonusEntry = raid.itemBonus.find(
            item => item.character === player.name && entry.item && entry.item.name === item.item
        );
        if (bonusEntry) bonus += 1;
    }

    return bonus;
};

export const getPositionBonus = (player: Player): number => {
    if (!player.positionBonus) {
        player.positionBonus = getPlayerPositionBonus(player);
    }
    return player.positionBonus;
};

export const getAttendanceBonus = (player: Player) => {
    const value = getPlayerAttendance(player) * 10;
    return Math.round(value * 10) / 10;
};

export const getEntryScore = (entry: PlayerItemEntry, player: Player): EntryScore => {
    if (!entry.calcualtedScore) {
        entry.calcualtedScore = {
            base: entry.score,
            position: getPositionBonus(player),
            item: getItemBonus(entry, player),
            attendance: getAttendanceBonus(player),
            total: getFinalScore(entry, player),
        }
    }
    return entry.calcualtedScore;
}

export type CombinedPlayerAttendance = {
    info: Attendance,
    bonus?: number,
    attendance?: number,
};

export const getCombinedPlayerAttendanceList = (player: Player): CombinedPlayerAttendance[] => {
    const attendanceRaids = getPlayerAttendanceRaids(player);
    const bonusRaids = getPlayerBonusRaids(player);

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