import moment, { Moment } from 'moment';
import { Class, Instance, InstanceData } from "./types";

export const instances: Instance[] = ['aq40', 'naxx', 'tbc1', 'tbc2', 'tbc3', 'tbc5', 'wotlk1', 'wotlk2', 'wotlk3', 'wotlk4'];
export const instanceData: Record<Instance, InstanceData> = {
    'aq40': {
        name: 'AQ40',
        image: 'ui-ej-boss-cthun.png',
        bonusRaidStartDate: moment('2020-08-22'),
        lootSheetID: '1vzK9lPih35GSUPbxLreslyihxPSSIXhS3JW_GWRf7Lw',
        lootSheetTab: 'Loot',
        itemScores: [100, 90, 80, 70, 65, 60, 55, 54, 53, 52],
        scoreGroupEdges: [80, 60],
    },
    'naxx': {
        name: 'Naxxramas',
        image: 'ui-ej-boss-kelthuzad.png',
        bonusRaidStartDate: moment('2020-12-05'),
        lootSheetID: '1vzK9lPih35GSUPbxLreslyihxPSSIXhS3JW_GWRf7Lw',
        lootSheetTab: 'LootNaxx',
        itemScores: [100, 90, 80, 70, 65, 60, 55, 54, 53, 52, 10],
        scoreGroupEdges: [80, 60, 52],
    },
    'tbc1': {
        name: 'Gruuls Lair & Magtheridon',
        image: 'ui-ej-boss-grull-hug-magtheridon.png',
        bonusRaidStartDate: moment('2021-06-13'),
        lootSheetID: '1vzK9lPih35GSUPbxLreslyihxPSSIXhS3JW_GWRf7Lw',
        lootSheetTab: 'LootTBC1',
        itemScores: [100, 90, 80],
        scoreGroupEdges: [],
    },
    'tbc2': {
        name: 'Serpentshrine Cavern & Tempest Keep',
        image: 'ui-ej-boss-vashj-kael.png',
        bonusRaidStartDate: moment('2021-09-15'),
        lootSheetID: '1vzK9lPih35GSUPbxLreslyihxPSSIXhS3JW_GWRf7Lw',
        lootSheetTab: 'LootTBC2',
        itemScores: [100, 90, 80, 70, 65, 60, 55, 54, 53, 52],
        scoreGroupEdges: [80, 60],
    },
    'tbc3': {
        name: 'Black Temple & Mount Hyjal',
        image: 'ui-ej-boss-archimonde-illidan.png',
        bonusRaidStartDate: moment('2022-01-30'),
        lootSheetID: '1vzK9lPih35GSUPbxLreslyihxPSSIXhS3JW_GWRf7Lw',
        lootSheetTab: 'LootTBC3',
        itemScores: [100, 90, 80, 70, 65, 60, 55, 54, 53, 52],
        scoreGroupEdges: [80, 60],
    },
    'tbc5': {
        name: 'Sunwell',
        image: 'ui-ej-boss-kiljaeden.png',
        bonusRaidStartDate: moment('2022-05-22'),
        lootSheetID: '1vzK9lPih35GSUPbxLreslyihxPSSIXhS3JW_GWRf7Lw',
        lootSheetTab: 'LootTBC5',
        itemScores: [100, 90, 80, 70, 65, 60, 55, 54, 53, 52],
        scoreGroupEdges: [80, 60],
    },
    'wotlk1': {
        name: 'Naxx, Obsidian Sanctum & Eye of Eternity',
        image: 'ui-ej-boss-kelthuzad.png',
        bonusRaidStartDate: moment('2022-10-09'),
        lootSheetID: '1vzK9lPih35GSUPbxLreslyihxPSSIXhS3JW_GWRf7Lw',
        lootSheetTab: 'LootWOTLK1',
        itemScores: [100, 90, 80, 70, 65, 60, 55, 54, 53, 52],
        scoreGroupEdges: [80, 60],
    },
    'wotlk2': {
        name: 'Ulduar',
        image: 'wotlk2.png',
        bonusRaidStartDate: moment('2023-01-19'),
        lootSheetID: '1vzK9lPih35GSUPbxLreslyihxPSSIXhS3JW_GWRf7Lw',
        lootSheetTab: 'LootWOTLK2',
        itemScores: [100, 90, 80, 70, 65, 60, 55, 54, 53, 52],
        scoreGroupEdges: [80, 60],
    },
    'wotlk3': {
        name: 'Trial of the Grand Crusader',
        // image: 'wotlk2.png',
        bonusRaidStartDate: moment('2023-06-25'),
        lootSheetID: '1vzK9lPih35GSUPbxLreslyihxPSSIXhS3JW_GWRf7Lw',
        lootSheetTab: 'LootWOTLK3',
        itemScores: [100, 90, 80, 70, 65, 60, 55, 54],
        scoreGroupEdges: [],
    },
    'wotlk4': {
        name: 'Ice Crown Citadel',
        // image: 'wotlk2.png',
        bonusRaidStartDate: moment('2023-10-13'),
        lootSheetID: '1vzK9lPih35GSUPbxLreslyihxPSSIXhS3JW_GWRf7Lw',
        lootSheetTab: 'LootWOTLK4',
        itemScores: [100, 90, 80, 70, 65, 60, 55, 54, 53, 52],
        scoreGroupEdges: [80, 60],
    },
}

export const classes: Class[] = [
    'DEATH KNIGHT', 'DRUID', 'HUNTER', 'MAGE', 'PALADIN', 'PRIEST', 'ROGUE', 'SHAMAN', 'WARLOCK', 'WARRIOR'
]

export const classColor: {[C in Class]: string} = {
    'DEATH KNIGHT': '#C41E3A',
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
export const tbcAttendanceStartDate: Moment = moment('2021-06-13');
export const wotlkAttendanceStartDate: Moment = moment('2022-10-09');
export const attendanceRaidCount = 6;
