import moment, { Moment } from 'moment';
import { ItemScore, Class, Instance, ItemScoreAq40, ItemScoreNaxx, ItemScoreTBC1 } from "./types";

export const itemScoresAq40: ItemScoreAq40[] = [
    100, 90, 80, 70, 65, 60, 55, 54, 53, 52,
];
export const scoreGroupEdgesAq40: ItemScore[] = [80, 60];

export const itemScoresNaxx: ItemScoreNaxx[] = [
    100, 90, 80, 70, 65, 60, 55, 54, 53, 52, 10,
];
export const scoreGroupEdgesNaxx: ItemScore[] = [80, 60, 52];

export const itemScoresTBC1: ItemScoreTBC1[] = [
    100, 90, 80,
];
export const scoreGroupEdgesTBC1: ItemScore[] = [];

export const instances: Instance[] = ['aq40', 'naxx', 'tbc1'];
export const instanceName: Record<Instance, string> = {
    aq40: 'AQ 40',
    naxx: 'Naxxramas',
    tbc1: 'Gruuls Lair & Magtheridon',
};

export const classes: Class[] = [
    'DRUID', 'HUNTER', 'MAGE', 'PALADIN', 'PRIEST', 'ROGUE', 'SHAMAN', 'WARLOCK', 'WARRIOR'
]

export const classColor: {[C in Class]: string} = {
    DRUID: '#FF7D0A',
    HUNTER: '#A9D271',
    MAGE: '#40C7EB',
    PALADIN: '#F58CBA',
    PRIEST: '#FFFFFF',
    ROGUE: '#FFF569',
    SHAMAN: '#0070DD',
    WARLOCK: '#8787ED',
    WARRIOR: '#C79C6E',
};

export const rollPointsWindow = 3;
export const bonusRaidStartDate: Record<Instance, Moment> = {
    aq40: moment('2020-08-22'),
    naxx: moment('2020-12-05'),
    tbc1: moment('2021-06-13'),
};
export const tbcAttendanceStartDate: Moment = moment('2021-06-13');
export const attendanceRaidCount = 6;
