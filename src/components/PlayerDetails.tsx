import React from 'react';
import { Player, PlayerItemEntry } from '../types'
import { useParams } from 'react-router-dom';
import { getPlayer } from '../api';
import ItemLink from './ItemLink';
import PlayerName from './PlayerName';

const PlayerDetails = () => {
    const { playerName } = useParams();
    const player: Player = getPlayer(playerName);

    return (
        <div style={{ margin: "20px auto", width: 370 }}>
            <h3>
                <PlayerName player={player} />
            </h3>
            <table>
                <tbody>
                    {player.scoreSlots.map((entry: PlayerItemEntry) => (
                        <tr key={entry.score}>
                            <td style={{
                                padding: '0 5px',
                                marginRight: 15,
                                textAlign: "right",
                                backgroundColor: entry.received ? 'green' : 'none',
                            }}>
                                {entry.score}
                            </td>
                            <td style={{ padding: '0 5px' }}>
                                {entry.item ? (
                                    <>
                                        <ItemLink item={entry.item} size='tiny' />
                                        {entry.received && (
                                            <span style={{ marginLeft: 5, fontSize: 12 }}>({entry.received})</span>
                                        )}
                                    </>
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
