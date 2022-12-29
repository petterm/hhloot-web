import React from 'react';
import { Player } from '../types'
import { classColor } from '../constants';

type PlayerNameProps = { player: Player };
const PlayerName: React.FunctionComponent<PlayerNameProps> = ({ player }) => {
    const color = player.class ? classColor[player.class] : '#888';

    return (
        <span style={{ color: color }} >
            {player.name}
        </span>
    );
}

export const formatName = (name: string) =>
    name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();

export default PlayerName;
