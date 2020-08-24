import React from 'react';
import { PlayerItemEntry } from '../types'

type DropRowPlayerProps = { playerEntry: PlayerItemEntry, playerName: string };
const DropRowPlayer = ({ playerEntry, playerName }: DropRowPlayerProps) => (
    <div style={{ display: 'flex', marginRight: 5 }}>
        <div style={{ marginRight: 10, width: 30, textAlign: 'right' }}>
            {playerEntry.score}
        </div>
        <div style={{ width: 90, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {playerName}
        </div>
    </div>
);

export default DropRowPlayer;
