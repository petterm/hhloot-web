import React from 'react';
import { Player, BossDrop } from '../types'
import PlayerName from './PlayerName';
import { getEntryScore } from '../api/points';
import { getPlayer } from '../api';

type LootPlayersProps = { loot: BossDrop, player: Player };
const LootPlayers = ({ loot, player }: LootPlayersProps) => {
    const scores = loot.reservations
        .map(({ playerName, entry }) => {
            const player = getPlayer(playerName);
            return {
                player,
                playerEntry: entry,
                scores: getEntryScore(entry, player),
            };
        });

    scores.sort((a, b) => b.scores.total - a.scores.total);

    let selectedPlayerScore: number;
    const eligiblePlayers = scores.filter((entry) => {
        if (entry.player.name === player.name) {
            selectedPlayerScore = entry.scores.total;
            return true;
        }
        if (selectedPlayerScore && entry.scores.total > selectedPlayerScore - 3) {
            return true;
        }
        return false;
    });

    const playersText = eligiblePlayers.map(({ player }) => player.name).join(', ');

    return (
        <>
            <textarea value={playersText} onChange={() => undefined} />
            <table>
                <tbody>
                    {eligiblePlayers.map(({player, scores: { total } }) => (
                        <tr key={player.name}>
                            <td><PlayerName player={player} /></td>
                            <td>{total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default LootPlayers;
