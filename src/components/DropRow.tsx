import React, { useState } from 'react';
import { BossDrop, Player } from '../types'
import { getPlayer } from '../api';
import { getEntryScore } from '../api/points';
import DropRowPlayer from './DropRowPlayer';
import ItemLink from './ItemLink';
import styles from './DropRow.module.css'
import DropRowPlayerFree from './DropRowPlayerFree';

type DropRowProps = {
    drop: BossDrop,
    hideReceived: boolean,
    masterlooter: boolean,
    oldMembers: boolean,
    onSelectLootPlayer: (x: BossDrop, y: Player) => void,
};

const DropRow = ({ drop, hideReceived, masterlooter, oldMembers, onSelectLootPlayer }: DropRowProps) => {
    const [hoverScore, setHoverScore] = useState<number | undefined>();

    const scores = drop.reservations
        .map(({ playerName, entry }) => {
            const player = getPlayer(playerName);
            return {
                player,
                playerEntry: entry,
                scores: getEntryScore(entry, player),
            };
        })
        .filter(({ player, playerEntry: { received } }) => {
            if (hideReceived && received) return false;
            if (!oldMembers && !player.class) return false;
            return true;
        });

    scores.sort((a, b) => b.scores.total - a.scores.total);

    return (
        <div className={styles.wrap}>
            <div className={styles.item}>
                <ItemLink item={drop.item} size='tiny' />
            </div>
            <div className={styles.players}>
                {scores.map(({ player, playerEntry, scores }, index) => (
                    <DropRowPlayer
                        key={`${player.name}_${index}`}
                        playerEntry={playerEntry}
                        player={player}
                        scores={scores}
                        masterlooter={masterlooter}
                        onSelectLootPlayer={(player: Player) => onSelectLootPlayer(drop, player)}
                        setHoverScore={(score: number) => setHoverScore(score)}
                        clearHoverScore={() => setHoverScore(undefined)}
                        hoverScore={hoverScore}
                    />
                ))}
                {!hideReceived && drop.freeLoot.map(name => (
                    (oldMembers || getPlayer(name).class) && (
                        <DropRowPlayerFree key={name} player={getPlayer(name)} />
                    )
                ))}
            </div>
        </div>
    );
};

export default DropRow;
