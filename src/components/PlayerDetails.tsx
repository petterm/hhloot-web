import React from 'react';
import { Player, PlayerItemEntry } from '../types'
import { useParams } from 'react-router-dom';
import { getPlayer } from '../api';
import { getFinalScore, getPositionBonus, getItemBonus, getAttendanceBonus } from '../api/points';
import ItemLink from './ItemLink';
import PlayerName from './PlayerName';

const style = (entry: PlayerItemEntry, index: number): React.CSSProperties => ({
    padding: '0 8px',
    marginRight: 15,
    textAlign: "right",
    backgroundColor: entry.received ? '#1d3d1d' : 'none',
    minWidth: 30,
    borderBottom: '1px solid #333',
    borderTop: index ? 'none' : '1px solid #333',
});

const PlayerDetails = () => {
    const { playerName } = useParams();
    const player: Player = getPlayer(playerName);

    return (
        <div>
            <h1>
                <PlayerName player={player} />
            </h1>
            <p>Attendance bonus: {getAttendanceBonus(player)}</p>
            <p>Position bonus: {getPositionBonus(player)}</p>
            <table style={{ borderSpacing: 0 }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left' }}>
                            Item
                        </th>
                        <th>
                            Weight
                        </th>
                        <th>
                            Item
                        </th>
                        <th>
                            Total
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {player.scoreSlots.map((entry: PlayerItemEntry, index: number) => (
                        <tr
                            key={entry.score}
                            style={{
                                backgroundColor: index % 2 === 0 ? 'none' : '#222',
                            }}
                        >
                            <td style={{
                                padding: '5px 20px 5px 5px',
                                borderBottom: '1px solid #333',
                                borderTop: index ? 'none' : '1px solid #333',
                            }}>
                                {entry.item ? (
                                    <>
                                        <ItemLink item={entry.item} size='small' />
                                        {entry.received && (
                                            <span style={{ marginLeft: 5, fontSize: 12 }}>({entry.received})</span>
                                        )}
                                    </>
                                ) : '--'}
                            </td>
                            <td style={style(entry, index)}>
                                {entry.score}
                            </td>
                            <td style={style(entry, index)}>
                                {getItemBonus(entry, player)}
                            </td>
                            <td style={style(entry, index)}>
                                {getFinalScore(entry, player)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlayerDetails;
