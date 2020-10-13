import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayerItemEntry, EntryScore, Player } from '../types'
import PlayerName from './PlayerName';
import style from './DropRowPlayer.module.css'
import { rollPointsWindow } from '../constants';

type DropRowPlayerProps = {
    playerEntry: PlayerItemEntry,
    player: Player,
    scores: EntryScore,
    masterlooter: boolean,
    onSelectLootPlayer: (y: Player) => void,
    setHoverScore: (score: number) => void,
    clearHoverScore: () => void,
    hoverScore?: number,
};

const DropRowPlayer = ({
    playerEntry,
    player,
    scores,
    masterlooter,
    onSelectLootPlayer,
    setHoverScore,
    clearHoverScore,
    hoverScore,
}: DropRowPlayerProps) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const onMouseEnter = () => {
        setHoverScore(scores.total);
        if (!masterlooter) {
            setShowTooltip(true);
        }
    }

    const onMouseLeave = () => {
        setShowTooltip(false);
        clearHoverScore();
    }

    const onClick = () => {
        if (masterlooter && !playerEntry.received) {
            onSelectLootPlayer(player);
        }
    };

    const wrapClasses = [style.wrap];
    if (playerEntry.received) {
        wrapClasses.push(style.wrapReceived);
    } else if (!showTooltip && hoverScore && scores.total <= hoverScore && scores.total >= hoverScore - rollPointsWindow) {
        wrapClasses.push(style.wrapRollRange);
    }
    if (player.guildRank === 'Initiate') {
        wrapClasses.push(style.wrapInitiate);
    }
    
    return (
        <button
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={wrapClasses.join(' ')}
            onClick={onClick}
        >
            <div className={style.score}>
                {scores.total}
            </div>
            <div className={style.name}>
                {masterlooter ? (
                    <PlayerName player={player} />
                ) : (
                    <Link to={`/players/${player.name}`} style={{ textDecoration: 'none' }}>
                        <PlayerName player={player} />
                    </Link>
                )}
            </div>
            {showTooltip && (
                <div className={style.tooltip} onMouseEnter={onMouseLeave}>
                    <table>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: 'right', paddingRight: 5 }}>{scores.base}</td>
                                <td>Weight</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'right', paddingRight: 5 }}>{scores.position}</td>
                                <td>Position bonus</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'right', paddingRight: 5 }}>{scores.item}</td>
                                <td>Item bonus</td>
                            </tr>
                            <tr>
                                <td style={{ textAlign: 'right', paddingRight: 5 }}>{scores.attendance}</td>
                                <td>Attendance bonus</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </button>
    );
}

export default DropRowPlayer;
