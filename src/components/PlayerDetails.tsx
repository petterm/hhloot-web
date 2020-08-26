import React from 'react';
import { Player, PlayerItemEntry } from '../types'
import { useParams } from 'react-router-dom';
import { getPlayer } from '../api';
import { getFinalScore, getPositionBonus, getItemBonus, getAttendanceBonus } from '../api/points';
import ItemLink from './ItemLink';
import PlayerName from './PlayerName';

const style = (entry: PlayerItemEntry): React.CSSProperties => ({
    padding: '0 5px',
    marginRight: 15,
    textAlign: "right",
    backgroundColor: entry.received ? 'green' : 'none',
    width: 70,
});

const PlayerDetails = () => {
    const { playerName } = useParams();
    const player: Player = getPlayer(playerName);

    return (
        <div style={{ margin: "20px auto", width: 800 }}>
            <h3>
                <PlayerName player={player} />
            </h3>
            <table>
                <thead>
                    <tr>
                        <th>
                            Weight
                        </th>
                        <th>
                            Pos.
                        </th>
                        <th>
                            Item
                        </th>
                        <th>
                            Atte.
                        </th>
                        <th>
                            Total
                        </th>
                        <th>
                            Item
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {player.scoreSlots.map((entry: PlayerItemEntry) => (
                        <tr key={entry.score}>
                            <td style={style(entry)}>
                                {entry.score}
                            </td>
                            <td style={style(entry)}>
                                {getPositionBonus(player)}
                            </td>
                            <td style={style(entry)}>
                                {getItemBonus(entry, player)}
                            </td>
                            <td style={style(entry)}>
                                {getAttendanceBonus(player)}
                            </td>
                            <td style={style(entry)}>
                                {getFinalScore(entry, player)}
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
