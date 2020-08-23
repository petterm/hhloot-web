import React from 'react';
import { PlayerItemEntry } from '../types'

type DropRowPlayerProps = { playerEntry: PlayerItemEntry, playerName: string };
const DropRowPlayer = ({ playerEntry, playerName }: DropRowPlayerProps) => (
    <div >
        <div>{playerEntry.score}</div>
        <div>{playerName}</div>
    </div>
);

export default DropRowPlayer;
