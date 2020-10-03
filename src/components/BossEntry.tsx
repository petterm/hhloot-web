import React from 'react';
import { Boss, BossDrop, Player } from '../types'
import DropRow from './DropRow';

type BossEntryProps = {
    boss: Boss,
    hideReceived: boolean,
    masterlooter: boolean,
    oldMembers: boolean,
    onSelectLootPlayer: (x: BossDrop, y: Player) => void,
};
const BossEntry = ({ boss, hideReceived, masterlooter, oldMembers, onSelectLootPlayer }: BossEntryProps) => (
    <div>
        <h3>
            {boss.name}
        </h3>
        <div>
            {boss.drops.map((drop, index) => (
                <DropRow
                    key={drop.item.name}
                    drop={drop}
                    hideReceived={hideReceived}
                    masterlooter={masterlooter}
                    oldMembers={oldMembers}
                    onSelectLootPlayer={onSelectLootPlayer}
                />
            ))}
        </div>
    </div>
);

export default BossEntry;
