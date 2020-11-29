import React from 'react';
import { Boss, BossDrop, Instance, Player } from '../types'
import DropRow from './DropRow';

type BossEntryProps = {
    boss: Boss,
    hideReceived: boolean,
    masterlooter: boolean,
    oldMembers: boolean,
    instance: Instance,
    onSelectLootPlayer: (x: BossDrop, y: Player) => void,
};
const BossEntry: React.FunctionComponent<BossEntryProps> = ({
    boss, hideReceived, masterlooter, oldMembers, instance, onSelectLootPlayer
}) => (
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
                    instance={instance}
                    onSelectLootPlayer={onSelectLootPlayer}
                />
            ))}
        </div>
    </div>
);

export default BossEntry;
