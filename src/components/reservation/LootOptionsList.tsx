import React from 'react';
import { getInstanceData } from '../../api';
import { getBosses } from '../../api/loot';
import { Boss, Instance, Item, Player } from '../../types';
import LootOption from './LootOption';
import style from './LootOptionsList.module.css';

interface LootOptionsListProps {
    instance: Instance,
    loginPlayer?: Player,
}

const dropsIncludingGrouped = (boss: Boss): Item[] => {
    const items: Item[] = [];
    boss.drops.forEach((drop) => {
        items.push(drop.item);
        drop.groupedItems.forEach(item => items.push(item));
    });
    items.sort((a,b) => a.heroic == b.heroic ? a.name.localeCompare(b.name) : a.heroic ? 1 : -1)

    return items;
}

const LootOptionsList: React.FunctionComponent<LootOptionsListProps> = ({ instance, loginPlayer }) => {
    const instanceData = getInstanceData(instance);
    const bosses = Object.values(getBosses(instance));

    return (
        <div className={style.wrap}>
            <h3 className={style.header}>
                {instanceData.name} Loot
            </h3>
            <div className={style.list}>
                {bosses.map(boss => (
                    <div className={style.boss} key={boss.index}>
                        <h4>{boss.name}</h4>
                        <div className={style.bossItems}>
                            {dropsIncludingGrouped(boss).filter(item => !item.hidden || loginPlayer).map(item => (
                                <LootOption item={item} key={item.id}/>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default LootOptionsList;
