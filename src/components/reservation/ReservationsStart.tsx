import React from 'react';
import { Switch, Route, useHistory, useRouteMatch, Redirect } from 'react-router-dom';
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
    const history = useHistory();
    const match = useRouteMatch();
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
            history.push(`${match.url}/${player.name}`);
        } else {
            window.localStorage.removeItem('selectedPlayer');
            history.push(`${match.url}`);
        }
    };

    return (
        <div className={style.wrap}>
            <Switch>
                <Route path={`${match.path}/:playerName`}>
                    <InvalidPlayerHandler path={match.path}>
                        <Reservations
                            instance={instance}
                            onChangePlayer={() => onPlayerSelect(undefined)}
                            loginPlayer={loginPlayer}
                        />
                    </InvalidPlayerHandler>
                </Route>
                <Route path={match.path}>
                    {savedPlayer === undefined ? (
                        <div className={style.selectPlayer}>
                            <p>Select your character:</p>
                            <PlayerSelect onChange={onPlayerSelect} />
                        </div>
                    ) : (
                        <Redirect to={`${match.path}/${savedPlayer.name}`} />
                    )}
                </Route>
            </Switch>
        </div>
    )
};

export default ReservationsStart;
