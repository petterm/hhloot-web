import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Reservations from './Reservations';
import style from './ReservationsStart.module.css';
import PlayerSelect from '../PlayerSelect';
import InvalidPlayerHandler from '../InvalidPlayerHandler';
import { Instance, Player } from '../../types';
import { getPlayer } from '../../api';

type ReservationsStartProps = {
    instance: Instance,
    loginPlayer?: Player,
}

const ReservationsStart: React.FunctionComponent<ReservationsStartProps> = ({ instance, loginPlayer }) => {
    const navigate = useNavigate();
    let savedPlayer: Player | undefined;
    try {
        const value = window.localStorage.getItem('selectedPlayer');
        if (value) savedPlayer = getPlayer(value);
    } catch (error) {
        console.error(error);
    }

    const onPlayerSelect = (player: Player | undefined) => {
        if (player) {
            window.localStorage.setItem('selectedPlayer', player.name);
            navigate(player.name);
        } else {
            window.localStorage.removeItem('selectedPlayer');
            navigate('.');
        }
    };

    return (
        <div className={style.wrap}>
            <Routes>
                <Route path={':playerName'} element={
                    <InvalidPlayerHandler path={'/'}>
                        <Reservations
                            instance={instance}
                            onChangePlayer={() => onPlayerSelect(undefined)}
                            loginPlayer={loginPlayer}
                        />
                    </InvalidPlayerHandler>
                } />
                <Route path={'/'} element={
                    savedPlayer === undefined ? (
                        <div className={style.selectPlayer}>
                            <p>Select your character:</p>
                            <PlayerSelect onChange={onPlayerSelect} />
                        </div>
                    ) : (
                        <Navigate to={savedPlayer.name} />
                    )
                } />
            </Routes>
        </div>
    )
};

export default ReservationsStart;
