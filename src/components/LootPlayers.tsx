import React from 'react';
import { Player, BossDrop, Instance } from '../types'
import PlayerName from './PlayerName';
import { getEntryScore } from '../api/points';
import { getPlayer } from '../api';
import { rollPointsWindow } from '../constants';

type LootPlayersProps = { loot: BossDrop, player: Player, instance: Instance };
const LootPlayers: React.FunctionComponent<LootPlayersProps> = ({ loot, player, instance }) => {
    const scores = loot.reservations
        .map(({ playerName, entry }) => {
            const player = getPlayer(playerName);
            return {
                player,
                playerEntry: entry,
                scores: getEntryScore(entry, player, instance),
            };
        });

    scores.sort((a, b) => b.scores.total - a.scores.total);

    let selectedPlayerScore: number;
    const eligiblePlayers = scores.filter((entry) => {
        if (entry.playerEntry.received) {
            return false;
        }
        if (entry.player.name === player.name && !selectedPlayerScore) {
            selectedPlayerScore = entry.scores.total;
            return true;
        }
        if (selectedPlayerScore && entry.scores.total >= selectedPlayerScore - rollPointsWindow) {
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
                            <td style={{ width: 300 }}><PlayerName player={player} /></td>
                            <td style={{ width: 100 }}>{total}</td>
                            <td style={{ width: 200 }}>{player.guildRank}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default LootPlayers;
