import { ItemScore, Class } from "./types";

export const itemScores: ItemScore[] = [
    100, 90, 80, 70, 65, 60, 55, 54, 53, 52,
];

export const classes: Class[] = [
    'DRUID', 'HUNTER', 'MAGE', 'PALADIN', 'PRIEST', 'ROGUE', 'WARLOCK', 'WARRIOR'
]

export const classColor: {[C in Class]: string} = {
    DRUID: '#FF7D0A',
    HUNTER: '#A9D271',
    MAGE: '#40C7EB',
    PALADIN: '#F58CBA',
    PRIEST: '#FFFFFF',
    ROGUE: '#FFF569',
    WARLOCK: '#8787ED',
    WARRIOR: '#C79C6E',
};
