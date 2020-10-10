import React from 'react';
import { Player } from '../types'
import { Link } from 'react-router-dom';
import ItemLink from './ItemLink';
import PlayerName from './PlayerName';

type PlayerListProps = { players: Player[] };
const PlayerList = ({ players }: PlayerListProps) => {
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
                                }}>
                                    {slot.item ? (
                                        <ItemLink item={slot.item} noText size='small' />
                                    ) : '-'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlayerList;
