import React from 'react';
import { getBosses } from '../../api';
import LootOption from './LootOption';
import style from './LootOptionsList.module.css';

const LootOptionsList: React.FunctionComponent = () => {
    const bosses = Object.values(getBosses());

    return (
        <div className={style.wrap}>
            {bosses.map(boss => (
                <div className={style.boss} key={boss.index}>
                    <h3>{boss.name}</h3>
                    <div className={style.bossItems}>
                        {boss.drops.map(drop => (
                            <LootOption item={drop.item} key={drop.item.id}/>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
};

export default LootOptionsList;
