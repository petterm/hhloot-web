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
            <table>
                <tbody>
                    {players.map((player, index) => (
                        <tr key={player.name} style={{ backgroundColor: index % 2 === 0 ? 'none' : '#222'}}>
                            <td style={{ paddingRight: 20 }}>
                                <Link to={`/players/${player.name}`} style={{ textDecoration: 'none' }}>
                                    <PlayerName player={player} />
                                </Link>
                            </td>
                            {player.scoreSlots.map(slot => (
                                <td key={slot.score} style={{
                                    textAlign: 'center',
                                    backgroundColor: slot.received ? 'green' : 'none',
                                    padding: '0 5px',
                                }}>
                                    {slot.item ? (
                                        <ItemLink item={slot.item} noText size='tiny' />
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
