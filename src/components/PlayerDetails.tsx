import React from 'react';
import { Player, PlayerItemEntry } from '../types'
import { useParams } from 'react-router-dom';
import { getPlayer } from '../api';
import ItemLink from './ItemLink';

const PlayerDetails = () => {
    const { playerName } = useParams();
    const player: Player = getPlayer(playerName);

    return (
        <div style={{ margin: "20px auto", width: 350 }}>
            <h3>{player.name}</h3>
            <table>
                <tbody>
                    {player.scoreSlots.map((entry: PlayerItemEntry) => (
                        <tr key={entry.score}>
                            <td style={{ paddingRight: 20, textAlign: "right" }}>
                                {entry.score}
                            </td>
                            <td>
                                {entry.item ? (
                                    <ItemLink item={entry.item} size='tiny' />
                                ) : '--'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlayerDetails;
