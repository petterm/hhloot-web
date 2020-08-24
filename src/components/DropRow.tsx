import React from 'react';
import { BossDrop } from '../types'
import DropRowPlayer from './DropRowPlayer';
import ItemLink from './ItemLink';

type DropRowProps = { drop: BossDrop };
const DropRow = ({ drop }: DropRowProps) => {
    drop.reservations.sort((a, b) => b.entry.score - a.entry.score)
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ whiteSpace: 'nowrap', width: 250, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {/* <DropRowItem item={drop.item} /> */}
                <ItemLink item={drop.item} size='tiny' />
            </div>
            <div style={{ display: 'flex' }}>
                {drop.reservations.map(({ playerName, entry }, index) => (
                    <DropRowPlayer key={`${playerName}_${index}`} playerEntry={entry} playerName={playerName} />
                ))}
            </div>
        </div>
    );
};

export default DropRow;
