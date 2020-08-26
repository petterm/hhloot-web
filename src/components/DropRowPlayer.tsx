import React from 'react';
import { PlayerItemEntry, EntryScore, Player } from '../types'
import { Link } from 'react-router-dom';
import PlayerName from './PlayerName';
import { v4 as uuid } from 'uuid';
import ReactTooltip from 'react-tooltip';

type DropRowPlayerProps = { playerEntry: PlayerItemEntry, player: Player, scores: EntryScore };
const DropRowPlayer = ({ playerEntry, player, scores }: DropRowPlayerProps) => {
    const tooltipId = uuid();
    return (
        <>
            <div data-tip data-for={tooltipId} style={{ display: 'flex', marginRight: 5, backgroundColor: playerEntry.received ? '#1d3d1d' : 'none' }}>
                <div style={{
                    marginRight: 5,
                    padding: '0 5px',
                    width: 27,
                    textAlign: 'right',
                }}>
                    {scores.total}
                </div>
                <div style={{ width: 90, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <Link to={`/players/${player.name}`} style={{ textDecoration: 'none' }}>
                        <PlayerName player={player} />
                    </Link>
                </div>
            </div>
            <ReactTooltip id={tooltipId} type='light' effect='solid' place='bottom'>
                <table>
                    <tbody>
                        <tr>
                            <td>Weight</td>
                            <td style={{ textAlign: 'right', paddingRight: 5 }}>{scores.base}</td>
                        </tr>
                        <tr>
                            <td>Position</td>
                            <td style={{ textAlign: 'right', paddingRight: 5 }}>{scores.position}</td>
                        </tr>
                        <tr>
                            <td>Item</td>
                            <td style={{ textAlign: 'right', paddingRight: 5 }}>{scores.item}</td>
                        </tr>
                        <tr>
                            <td>Attendance</td>
                            <td style={{ textAlign: 'right', paddingRight: 5 }}>{scores.attendance}</td>
                        </tr>
                    </tbody>
                </table>
            </ReactTooltip>
        </>
    );
}

export default DropRowPlayer;
