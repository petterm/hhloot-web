import React from 'react';
import { Player, PlayerItemEntry } from '../types'
import { useParams } from 'react-router-dom';
import { getPlayer } from '../api';

const PlayerDetails = () => {
    const { playerName } = useParams();
    const player: Player = getPlayer(playerName);

    return (
        <div>
            <h3>{player.name}</h3>
            <table>
                {player.scoreSlots.map((entry: PlayerItemEntry) => (
                    <tr>
                        <td>
                            {entry.score}
                        </td>
                        <td>
                            {entry.item ? entry.item.name : '--'}
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );
};

export default PlayerDetails;
