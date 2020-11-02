import React from 'react';
import { Player } from '../types'
import { classColor } from '../constants';

type PlayerNameProps = { player: Player };
const PlayerName = ({ player }: PlayerNameProps) => {
    const color = player.class ? classColor[player.class] : '#888';

    return (
        <span style={{ color: color }} >
            {player.name}
        </span>
    );
}

export const formatName = (name: string) => name.substr(0, 1).toUpperCase() + name.substr(1).toLowerCase();

export default PlayerName;
