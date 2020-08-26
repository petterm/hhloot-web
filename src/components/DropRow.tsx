import React from 'react';
import { BossDrop } from '../types'
import DropRowPlayer from './DropRowPlayer';
import ItemLink from './ItemLink';
import { getPlayer } from '../api';
import { getPositionBonus, getItemBonus, getAttendanceBonus, getFinalScore } from '../api/points';

type DropRowProps = { drop: BossDrop, even: boolean };
const DropRow = ({ drop, even }: DropRowProps) => {
    const scores = drop.reservations.map(({ playerName, entry }) => {
        const player = getPlayer(playerName);
        return {
            player,
            playerEntry: entry,
            scores: {
                base: entry.score,
                position: getPositionBonus(player),
                item: getItemBonus(entry, player),
                attendance: getAttendanceBonus(player),
                total: getFinalScore(entry, player),
            },
        };
    })
    scores.sort((a, b) => b.scores.total - a.scores.total)
    return (
        <div style={{ padding: '3px 5px', display: 'flex', backgroundColor: even ? '#222' : 'none' }}>
            <div style={{ whiteSpace: 'nowrap', width: 250, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {/* <DropRowItem item={drop.item} /> */}
                <ItemLink item={drop.item} size='tiny' />
            </div>
            <div style={{ display: 'flex' }}>
                {scores.map(({ player, playerEntry, scores }, index) => (
                    <DropRowPlayer key={`${player.name}_${index}`} playerEntry={playerEntry} player={player} scores={scores} />
                ))}
            </div>
        </div>
    );
};

export default DropRow;
