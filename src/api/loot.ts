import lootTableAQ40_untyped from '../data/aq40_loot_table.json';
import lootTableNaxx_untyped from '../data/naxx_loot_table.json';
import lootTableTBC1_untyped from '../data/tbc1_loot_table.json';
import lootTableTBC2_untyped from '../data/tbc2_loot_table.json';
import lootTableTBC3BT_untyped from '../data/tbc3_bt_loot_table.json';
import lootTableTBC3MH_untyped from '../data/tbc3_mh_loot_table.json';
import lootTableTBC5_untyped from '../data/tbc5_loot_table.json';
import itemIcons from '../data/item_icons.json';
import { Boss, BossDrop, Instance, Item } from '../types';

type LootTableAq40 = {
    "Item Name": string,
    "Item ID": string,
    "Slot": string,
    "Prio": string,
    "Boss": string,
    "Linktext": string,
    "Link": string,
    "Restricted": string,
};
type LootTable = {
    "name": string,
    "id": number,
    "slot": string,
    "source": string,
    "icon": string,
    "restricted"?: boolean,
    "hidden"?: boolean,
    "groupedWith"?: number,
};
type DropUnified = {
    "bosses": string[];
    "name": string;
    "id": number;
    "slot": string;
    "restricted": boolean;
    "hidden": boolean;
    "icon"?: string;
    "groupedWith"?: number;
}

const lootTableAQ40: LootTableAq40[] = lootTableAQ40_untyped;
const lootTableNaxx: LootTable[] = lootTableNaxx_untyped;
const lootTableTBC1: LootTable[] = lootTableTBC1_untyped;
const lootTableTBC2: LootTable[] = lootTableTBC2_untyped;
const lootTableTBC3BT: LootTable[] = lootTableTBC3BT_untyped;
const lootTableTBC3MH: LootTable[] = lootTableTBC3MH_untyped;
const lootTableTBC5: LootTable[] = lootTableTBC5_untyped;

type BossMap = { [key: string]: Boss; };

type BossDropNameMap = { [key: string]: BossDrop; };
type BossDropIdMap = { [key: number]: BossDrop; };

type InstanceLoot = {
    instance: Instance,
    bossMap: BossMap,
}
const instanceLoot: { [key: string]: InstanceLoot } = {}
const globalBossDropNameMap: BossDropNameMap = {};
const globalBossDropIdMap: BossDropIdMap = {};

const getUnifiedEntryAq40 = (drop: LootTableAq40): DropUnified => {
    const dropAq = drop as LootTableAq40;
    return {
        bosses: dropAq['Boss'].split(',').map(str => str.trim()),
        name: dropAq['Item Name'],
        id: parseInt(dropAq['Item ID']),
        slot: dropAq['Slot'],
        restricted: dropAq['Restricted'] ? true : false,
        hidden: false,
    };
}

const getUnifiedEntryDefault = (drop: LootTable): DropUnified => {
    const newDrop = drop as LootTable;
    return {
        bosses: newDrop['source'].split(',').map(str => str.trim()),
        name: newDrop['name'],
        id: newDrop['id'],
        slot: newDrop['slot'],
        restricted: newDrop['restricted'] || false,
        hidden: newDrop['hidden'] || false,
        icon: newDrop['icon'],
        groupedWith: newDrop['groupedWith'],
    };
}

const includesDrop = (boss: Boss, newDrop: BossDrop): boolean => {
    for (let i = 0; i < boss.drops.length; i++) {
        if (boss.drops[i].item.id === newDrop.item.id) {
            return true;
        }
    }
    return false;
}

const parseLootTable = (instance: Instance, rawData: LootTableAq40[] | LootTable[]): void => {
    let index = 0;

    const lootTable: InstanceLoot = {
        instance,
        bossMap: {},
    }
    instanceLoot[instance] = lootTable;

    let unifiedData: DropUnified[];
    if (instance === 'aq40') {
        unifiedData = (rawData as LootTableAq40[]).map(getUnifiedEntryAq40)
    } else {
        unifiedData = (rawData as LootTable[]).map(getUnifiedEntryDefault)
    }

    const mainItems = unifiedData.filter((drop) => typeof(drop.groupedWith) !== 'number')
    const groupedItems = unifiedData.filter((drop) => typeof(drop.groupedWith) === 'number')

    mainItems.forEach((dropUnified: DropUnified) => {
        dropUnified.bosses.forEach(bossName => {
            if (!bossName) return;
    
            const drop: BossDrop = globalBossDropNameMap[dropUnified.name] || {
                reservations: [],
                freeLoot: [],
                item: {
                    id: dropUnified.id,
                    name: dropUnified.name,
                    restricted: dropUnified.restricted,
                    hidden: dropUnified.hidden,
                    icon: dropUnified.icon,
                },
                groupedItems: [],
                instance,
            };
            
            if (lootTable.bossMap[bossName]) {
                // Check for duplicates
                if (!includesDrop(lootTable.bossMap[bossName], drop)) {
                    lootTable.bossMap[bossName].drops.push(drop)
                }
            } else {
                lootTable.bossMap[bossName] = {
                    name: bossName,
                    drops: [drop],
                    index: index++,
                }
            }
    
            globalBossDropNameMap[dropUnified.name] = drop;
            globalBossDropIdMap[dropUnified.id] = drop;
        })
    })

    groupedItems.forEach((dropUnified: DropUnified) => {
        if (dropUnified.groupedWith === undefined) {
            return;
        }

        const item: Item = {
            id: dropUnified.id,
            name: dropUnified.name,
            restricted: dropUnified.restricted,
            hidden: dropUnified.hidden,
            icon: dropUnified.icon,
        };

        const parentDrop = globalBossDropIdMap[dropUnified.groupedWith];
        parentDrop.groupedItems.push(item);

        globalBossDropIdMap[dropUnified.id] = parentDrop;
        globalBossDropNameMap[dropUnified.name] = parentDrop;
    });

    for (const [, boss] of Object.entries(lootTable.bossMap)) {
        boss.drops.sort((a,b) => a.item.name.localeCompare(b.item.name))
    }
};

parseLootTable('aq40', lootTableAQ40);
parseLootTable('naxx', lootTableNaxx);
parseLootTable('tbc1', lootTableTBC1);
parseLootTable('tbc2', lootTableTBC2);
parseLootTable('tbc3', lootTableTBC3MH.concat(lootTableTBC3BT));
parseLootTable('tbc5', lootTableTBC5);

export const getBosses = (instance: Instance): BossMap => instanceLoot[instance].bossMap;
export const getBossDrops = (instance?: Instance): BossDropNameMap => {
    if (instance) {
        const filteredBossDrops: BossDropNameMap = {};
        for (const itemName in globalBossDropNameMap) {
            const item = globalBossDropNameMap[itemName];
            if (item.instance === instance) {
                filteredBossDrops[itemName] = item;
            }
        }
        return filteredBossDrops;
    }
    return globalBossDropNameMap;
};

export const getBoss = (bossName: string): Boss => {
    const instance = Object.values(instanceLoot).find(instance => bossName in instance.bossMap);
    if (!instance) {
        throw Error(`Unknown boss ${bossName}`);
    }
    return instance.bossMap[bossName];
};

export const getItem = (item: string | number): Item => {
    const drop = globalBossDropNameMap[item];
    if (typeof(item) === 'string' && item in globalBossDropNameMap) {
        if (drop.item.name === item) {
            return drop.item;
        }
        const groupedItem = drop.groupedItems.find((grouped) => grouped.name === item);
        if (groupedItem) {
            return groupedItem;
        }
        throw Error(`Missing grouped item ${item} inside ${drop.item.name}`);
    }
    if (typeof(item) === 'number' && item in globalBossDropIdMap) {
        if (drop.item.id === item) {
            return drop.item;
        }
        const groupedItem = drop.groupedItems.find((grouped) => grouped.id === item);
        if (groupedItem) {
            return groupedItem;
        }
        throw Error(`Missing grouped item ${item} inside ${drop.item.name}`);
    }
    throw Error(`Unknown item ${item}`);
};

export const getItemIcon = (id: number) => {
    const iconID = (itemIcons as {[key: number]: string})[id];
    if (iconID) return iconID;
    throw Error(`Missing icon id for item ${id}`);
};
