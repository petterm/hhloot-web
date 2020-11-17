import lootTableAQ40 from '../data/aq40_loot_table.json';
// import lootTableNaxx from '../data/naxx_loot_table.json';
import itemIcons from '../data/item_icons.json';
import { Boss, BossDrop, Instance, Item } from '../types';

type LootTable = {
    "Item Name": string,
    "Item ID": string,
    "Slot": string,
    "Prio": string,
    "Boss": string,
    "Linktext": string,
    "Link": string,
    "Restricted": string,
}[];

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

const parseLootTable = (instance: Instance, rawData: LootTable): void => {
    let index = 0;

    const lootTable: InstanceLoot = {
        instance,
        bossMap: {},
    }
    instanceLoot[instance] = lootTable;

    rawData.forEach((dropJson) => {
        const bosses = dropJson['Boss'].split(',').map(str => str.trim())
        bosses.forEach(bossName => {
            if (!bossName) return;
    
            const drop: BossDrop = globalBossDropNameMap[dropJson['Item Name']] || {
                reservations: [],
                freeLoot: [],
                item: {
                    id: parseInt(dropJson['Item ID']),
                    name: dropJson['Item Name'],
                    restricted: dropJson['Restricted'] ? true : false,
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
    
            globalBossDropNameMap[dropJson['Item Name']] = drop;
            globalBossDropIdMap[parseInt(dropJson['Item ID'])] = drop;
        })
    })

    for (const [, boss] of Object.entries(lootTable.bossMap)) {
        boss.drops.sort((a,b) => a.item.name.localeCompare(b.item.name))
    }
};

parseLootTable('aq40', lootTableAQ40)
// parseLootTable('naxx', lootTableNaxx)

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

export const getItemIcon = (id: number) => (itemIcons as {[key: number]: string})[id];
