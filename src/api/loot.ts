import lootTableAQ40 from '../data/aq40_loot_table.json';
// import lootTableNaxx from '../data/naxx_loot_table.json';
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

type BossDropMap = { [key: string]: BossDrop; };

type InstanceLoot = {
    instance: Instance,
    bossMap: BossMap,
    bossDropMap: BossDropMap,
}
const instanceLoot: { [key: string]: InstanceLoot } = {}

const parseLootTable = (instance: Instance, rawData: LootTable): void => {
    let index = 0;

    const lootTable: InstanceLoot = {
        instance,
        bossMap: {},
        bossDropMap: {}
    }
    instanceLoot[instance] = lootTable;

    rawData.forEach((dropJson) => {
        const bosses = dropJson['Boss'].split(',').map(str => str.trim())
        bosses.forEach(bossName => {
            if (!bossName) return;
    
            const drop: BossDrop = lootTable.bossDropMap[dropJson['Item Name']] || {
                reservations: [],
                freeLoot: [],
                item: {
                    id: parseInt(dropJson['Item ID']),
                    name: dropJson['Item Name'],
                    restricted: dropJson['Restricted'] ? true : false,
                },
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
    
            lootTable.bossDropMap[dropJson['Item Name']] = drop;
        })
    })

    for (const [, boss] of Object.entries(lootTable.bossMap)) {
        boss.drops.sort((a,b) => a.item.name.localeCompare(b.item.name))
    }
};

parseLootTable('aq40', lootTableAQ40)
// parseLootTable('naxx', lootTableNaxx)

export const getBosses = (instance: Instance): BossMap => instanceLoot[instance].bossMap;
export const getBossDrops = (instance: Instance): BossDropMap => instanceLoot[instance].bossDropMap;

export const getBoss = (bossName: string): Boss => {
    const instance = Object.values(instanceLoot).find(instance => bossName in instance.bossMap);
    if (!instance) {
        throw Error(`Unknown boss ${bossName}`);
    }
    return instance.bossMap[bossName];
};

export const getItem = (itemName: string): Item => {
    const instance = Object.values(instanceLoot).find(instance => itemName in instance.bossDropMap);
    if (!instance) {
        throw Error(`Unknown item ${itemName}`);
    }
    return instance.bossDropMap[itemName].item;
};
