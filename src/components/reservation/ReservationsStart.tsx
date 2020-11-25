import React from 'react';
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import Reservations from './Reservations';
import style from './ReservationsStart.module.css';
import PlayerSelect from '../PlayerSelect';
import InvalidPlayerHandler from '../InvalidPlayerHandler';
import { Instance, Player } from '../../types';

type ReservationsStartProps = {
    instance: Instance,
}

const ReservationsStart: React.FunctionComponent<ReservationsStartProps> = ({ instance }) => {
    const history = useHistory();
    const match = useRouteMatch();

    const onPlayerSelect = (player: Player | undefined) => {
        if (player) {
            history.push(`${match.url}/${player.name}`);
        } else {
            history.push(`${match.url}`);
        }
    };

    return (
        <div className={style.wrap}>
            <Switch>
                <Route path={`${match.path}/:playerName`}>
                    <InvalidPlayerHandler path={match.path}>
                        <Reservations instance={instance} />
                    </InvalidPlayerHandler>
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
