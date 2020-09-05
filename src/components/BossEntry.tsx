import React from 'react';
import { Boss, BossDrop, Player } from '../types'
import DropRow from './DropRow';

type BossEntryProps = {
    boss: Boss,
    hideReceived: boolean,
    masterlooter: boolean,
    onSelectLootPlayer: (x: BossDrop, y: Player) => void,
};
const BossEntry = ({ boss, hideReceived, masterlooter, onSelectLootPlayer }: BossEntryProps) => (
    <div>
        <h3>
            {boss.name}
        </h3>
        <div>
            {boss.drops.map((drop, index) => (
                <DropRow
                    key={drop.item.name}
                    drop={drop}
                    even={index % 2 === 1}
                    hideReceived={hideReceived}
                    masterlooter={masterlooter}
                    onSelectLootPlayer={onSelectLootPlayer}
                />
            ))}
        </div>
    </div>
);

export default BossEntry;
