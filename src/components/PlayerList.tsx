import React from 'react';
import { Player } from '../types'
import { Link } from 'react-router-dom';
import ItemLink from './ItemLink';

type PlayerListProps = { players: Player[] };
const PlayerList = ({ players }: PlayerListProps) => {
    players.sort((a, b) => a.name.localeCompare(b.name))
    return (
        <div style={{ margin: "20px auto", width: 350 }}>
            <table>
                <tbody>
                    {players.map(player => (
                        <tr key={player.name}>
                            <td style={{ paddingRight: 20 }}>
                                <Link to={`/players/${player.name}`}>
                                    {player.name}
                                </Link>
                            </td>
                            {player.scoreSlots.map(slot => (
                                <td key={slot.score}>
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
