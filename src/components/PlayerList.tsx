import React from 'react';
import { Instance, Player } from '../types'
import { Link } from 'react-router-dom';
import ItemLink from './ItemLink';
import PlayerName from './PlayerName';
import { getAttendanceBonus } from '../api/points';
import { getInstanceData } from '../api';
import style from './PlayerList.module.css';

type PlayerListProps = { players: Player[], instance: Instance };
const PlayerList = ({ players, instance }: PlayerListProps) => {
    const instanceData = getInstanceData(instance);
    players.sort((a, b) => a.name.localeCompare(b.name))
    return (
        <div>
            <h1>Player list</h1>
            <table className={style.mainTable}>
                <tbody>
                    {players.map((player, index) => (
                        <tr
                            key={player.name}
                            className={style.row}
                        >
                            <td className={[
                                style.cell,
                                style.cellName,
                                player.guildRank === 'Initiate' ? style.cellNameInitiate : ''
                            ].join(' ')}>
                                <Link to={`/players/${player.name}`} style={{ textDecoration: 'none' }}>
                                    <PlayerName player={player} />
                                </Link>
                            </td>
                            {player.scoreSlots.map(slot => (
                                <td key={slot.score} className={[
                                    style.cell,
                                    style.cellSlot,
                                    slot.received ? style.cellSlotReceived : '',
                                    instanceData.scoreGroupEdges.includes(slot.score) ? style.cellSlotGroupEdge : ''
                                ].join(' ')}>
                                    {slot.item ? (
                                        <ItemLink item={slot.item} noText size='small' />
                                    ) : '-'}
                                </td>
                            ))}
                            <td className={[style.cell, style.cellAttendance].join(' ')}>
                                {getAttendanceBonus(player) * 10} %
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlayerList;
