import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { PlayerItemEntry, EntryScore, Player } from '../types'
import PlayerName from './PlayerName';
import style from './DropRowPlayer.module.css'

type DropRowPlayerProps = {
    playerEntry: PlayerItemEntry,
    player: Player,
    scores: EntryScore,
    masterlooter: boolean,
    onSelectLootPlayer: (y: Player) => void,
};
type DropRowPlayerState = { showTooltip: boolean }

const DropRowPlayer = ({ playerEntry, player, scores, masterlooter, onSelectLootPlayer }: DropRowPlayerProps) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const history = useHistory();

    const onMouseEnter = () => {
        if (!masterlooter) {
            setShowTooltip(true);
        }
    }

    const onMouseLeave = () => setShowTooltip(false);

    const onClick = () => {
        if (masterlooter) {
            if (!playerEntry.received) {
                onSelectLootPlayer(player);
            }
        } else {
            history.push(`/players/${player.name}`);
        }
    };

    return (
        <button
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={[style.wrap, (playerEntry.received ? style.wrapReceived : '')].join(' ')}
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
                <div className={style.tooltip}>
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
