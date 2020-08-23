import React from 'react';
import { Player } from '../types'
import { Link } from 'react-router-dom';

type PlayerListProps = { players: Player[] };
const PlayerList = ({ players }: PlayerListProps) => {
    players.sort((a, b) => a.name.localeCompare(b.name))
    return (
        <div>
            <ul>
            {players.map(player => (
                <li>
                    <Link to={`/players/${player.name}`}>
                        {player.name}
                    </Link>
                </li>
            ))}
            </ul>
        </div>
    );
};

export default PlayerList;
