import React from 'react';
import { Player } from '../types'
import PlayerName from './PlayerName';
import style from './DropRowPlayer.module.css'
import { Link } from 'react-router-dom';

type DropRowPlayerFreeProps = {
    player: Player,
};

const DropRowPlayerFree = ({ player }: DropRowPlayerFreeProps) => (
        <div
            className={[style.wrap, style.wrapReceivedFree].join(' ')}
        >
            <div className={style.score}>
                {'-'}
            </div>
            <div className={style.name}>
                <Link to={`/players/${player.name}`} style={{ textDecoration: 'none' }}>
                    <PlayerName player={player} />
                </Link>
            </div>
        </div>
    );

export default DropRowPlayerFree;
