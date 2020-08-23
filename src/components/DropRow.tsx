import React from 'react';
import { BossDrop } from '../types'
import DropRowPlayer from './DropRowPlayer';
import DropRowItem from './DropRowItem';

type DropRowProps = { drop: BossDrop };
const DropRow = ({ drop }: DropRowProps) => (
    <div>
        <div>
            <DropRowItem item={drop.item} />
        </div>
        <div>
            {drop.reservations.map(({ playerName, entry }) => (
                <DropRowPlayer playerEntry={entry} playerName={playerName} />
            ))}
        </div>
    </div>
);

export default DropRow;
