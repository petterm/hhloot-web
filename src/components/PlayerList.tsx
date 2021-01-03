import React from 'react';
import { Instance, Player } from '../types'
import { Link } from 'react-router-dom';
import ItemLink from './ItemLink';
import PlayerName from './PlayerName';
import { getScoreGroupEdges } from '../api/reservations';
import { getAttendanceBonus } from '../api/points';

type PlayerListProps = { players: Player[], instance: Instance };
const PlayerList = ({ players, instance }: PlayerListProps) => {
    players.sort((a, b) => a.name.localeCompare(b.name))
    return (
        <div>
            <h1>Player list</h1>
            <table style={{ borderSpacing: 0 }}>
                <tbody>
                    {players.map((player, index) => (
                        <tr
                            key={player.name}
                            style={{
                                backgroundColor: index % 2 === 0 ? 'none' : '#222',
                            }}
                        >
                            <td style={{
                                padding: '5px 20px 5px 5px',
                                borderBottom: '1px solid #333',
                                borderTop: index ? 'none' : '1px solid #333',
                                fontStyle: player.guildRank === 'Initiate' ? 'italic' : '',
                            }}>
                                <Link to={`/players/${player.name}`} style={{ textDecoration: 'none' }}>
                                    <PlayerName player={player} />
                                </Link>
                            </td>
                            {player.scoreSlots.map(slot => (
                                <td key={slot.score} style={{
                                    textAlign: 'center',
                                    backgroundColor: slot.received ? '#1d3d1d' : 'none',
                                    padding: '0 8px',
                                    borderBottom: '1px solid #333',
                                    borderTop: index ? 'none' : '1px solid #333',
                                    borderRight: getScoreGroupEdges(instance).includes(slot.score) ? '2px solid #333' : 'none',
                                }}>
                                    {slot.item ? (
                                        <ItemLink item={slot.item} noText size='small' />
                                    ) : '-'}
                                </td>
                            ))}
                            <td style={{
                                    padding: '0 8px',
                                    borderBottom: '1px solid #333',
                                    borderTop: index ? 'none' : '1px solid #333',
                                    borderLeft: '2px solid #333',
                                    fontSize: 12,
                                    color: '#aaa',
                                    textAlign: 'right',
                                    paddingLeft: 10,
                            }}>
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
