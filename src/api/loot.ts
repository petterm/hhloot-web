import lootTableAQ40 from '../data/aq40_loot_table.json';
import lootTableNaxx from '../data/naxx_loot_table.json';
import lootTableTBC1 from '../data/tbc1_loot_table.json';
import lootTableTBC2 from '../data/tbc2_loot_table.json';
import lootTableTBC3BT from '../data/tbc3_bt_loot_table.json';
import lootTableTBC3MH from '../data/tbc3_mh_loot_table.json';
import lootTableTBC5 from '../data/tbc5_loot_table.json';
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
};

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

const getUnifiedEntry = (instance: Instance, drop: LootTableAq40 | LootTable) => {
    if (instance === 'aq40') {
        const dropAq = drop as LootTableAq40;
        return {
            bosses: dropAq['Boss'].split(',').map(str => str.trim()),
            name: dropAq['Item Name'],
            id: parseInt(dropAq['Item ID']),
            slot: dropAq['Slot'],
            restricted: dropAq['Restricted'] ? true : false,
            hidden: false,
            icon: undefined,
        };
    } else {
        const newDrop = drop as LootTable;
        return {
            bosses: newDrop['source'].split(',').map(str => str.trim()),
            name: newDrop['name'],
            id: newDrop['id'],
            slot: newDrop['slot'],
            restricted: newDrop['restricted'] || false,
            hidden: newDrop['hidden'] || false,
            icon: newDrop['icon'],
        };
    }
}

const parseLootTable = (instance: Instance, rawData: LootTableAq40[] | LootTable[]): void => {
    let index = 0;

    const lootTable: InstanceLoot = {
        instance,
        bossMap: {},
    }
    instanceLoot[instance] = lootTable;

    rawData.forEach((dropJson: LootTableAq40 | LootTable) => {
        const dropUnified = getUnifiedEntry(instance, dropJson);
        
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
                instance,
            };
            
            if (lootTable.bossMap[bossName]) {
                lootTable.bossMap[bossName].drops.push(drop)
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
    if (typeof(item) === 'string' && item in globalBossDropNameMap) {
        return globalBossDropNameMap[item].item;
    }
    if (typeof(item) === 'number' && item in globalBossDropIdMap) {
        return globalBossDropIdMap[item].item;
    }
    throw Error(`Unknown item ${item}`);
};

export const getItemIcon = (id: number) => {
    const iconID = (itemIcons as {[key: number]: string})[id];
    if (iconID) return iconID;
    throw Error(`Missing icon id for item ${id}`);
};
