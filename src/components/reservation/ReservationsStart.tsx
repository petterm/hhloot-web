import React from 'react';
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import Reservations from './Reservations';
import style from './ReservationsStart.module.css';
import PlayerSelect from '../PlayerSelect';
import { Player } from '../../types';

const ReservationsStart: React.FunctionComponent = () => {
    const history = useHistory();
    const match = useRouteMatch();

    const onPlayerSelect = (player: Player | undefined) => {
        if (player) {
            history.push(`${match.url}/aq40/${player.name}`);
        } else {
            history.push(`${match.url}`);
        }
    };

    return (
        <div className={style.wrap}>
            <Switch>
                <Route path={`${match.path}/:instance/:playerName`}>
                    <Reservations />
                </Route>
                <Route path={match.path}>
                    <div className={style.selectPlayer}>
                        <p>Select your character:</p>
                        <PlayerSelect onChange={onPlayerSelect} />
                    </div>
                </Route>
            </Switch>
        </div>
    )
};

export default ReservationsStart;
