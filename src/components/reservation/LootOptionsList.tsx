import React from 'react';
import { getBosses } from '../../api/loot';
import { instanceName } from '../../constants';
import { Instance, Player } from '../../types';
import LootOption from './LootOption';
import style from './LootOptionsList.module.css';

interface LootOptionsListProps {
    instance: Instance,
    loginPlayer?: Player,
}

const LootOptionsList: React.FunctionComponent<LootOptionsListProps> = ({ instance, loginPlayer }) => {
    const bosses = Object.values(getBosses(instance));

    return (
        <div className={style.wrap}>
            <h3 className={style.header}>
                {instanceName[instance]} Loot
            </h3>
            <div className={style.list}>
                {bosses.map(boss => (
                    <div className={style.boss} key={boss.index}>
                        <h4>{boss.name}</h4>
                        <div className={style.bossItems}>
                            {boss.drops.filter(drop => !drop.item.hidden || loginPlayer).map(drop => (
                                <LootOption item={drop.item} key={drop.item.id}/>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default LootOptionsList;
