import React from 'react';
import { BossDrop, Player } from '../types'
import { getPlayer } from '../api';
import { getEntryScore } from '../api/points';
import DropRowPlayer from './DropRowPlayer';
import ItemLink from './ItemLink';
import styles from './DropRow.module.css'
import DropRowPlayerFree from './DropRowPlayerFree';

type DropRowProps = {
    drop: BossDrop,
    even: boolean,
    hideReceived: boolean,
    masterlooter: boolean,
    onSelectLootPlayer: (x: BossDrop, y: Player) => void,
};
const DropRow = ({ drop, even, hideReceived, masterlooter, onSelectLootPlayer }: DropRowProps) => {
    const scores = drop.reservations
        .map(({ playerName, entry }) => {
            const player = getPlayer(playerName);
            return {
                player,
                playerEntry: entry,
                scores: getEntryScore(entry, player),
            };
        });

    scores.sort((a, b) => b.scores.total - a.scores.total);

    return (
        <div className={styles.wrap}>
            <div className={styles.item}>
                <ItemLink item={drop.item} size='tiny' />
            </div>
            <div className={styles.players}>
                {scores.map(({ player, playerEntry, scores }, index) =>
                    (!hideReceived || !playerEntry.received) && (
                    <DropRowPlayer
                        key={`${player.name}_${index}`}
                        playerEntry={playerEntry}
                        player={player}
                        scores={scores}
                        masterlooter={masterlooter}
                        onSelectLootPlayer={(player: Player) => onSelectLootPlayer(drop, player)}
                    />
                ))}
                {!hideReceived && drop.freeLoot.map(name => (
                    <DropRowPlayerFree key={name} player={getPlayer(name)} />
                ))}
            </div>
        </div>
    );
};

export default DropRow;
