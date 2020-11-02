import React from 'react';
import { Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';
import Select, { StylesConfig, ValueType } from 'react-select';
import { classColor } from '../../constants';
import Reservations from './Reservations';
import style from './ReservationsStart.module.css';
import { getPlayers } from '../../api/async';
import { ThemeConfig } from 'react-select/src/theme';
import { Player } from '../../types';

const getOptions = () => {
    const players = Object.values(getPlayers());
    players.sort((a, b) => a.name.localeCompare(b.name));
    return players.map(player => ({
        value: player,
        label: player.name,
    }));
}

const optionStyles: StylesConfig = {
    option: (styles, { data }: { data: { label: string, value: Player }}) => ({
        ...styles,
        color: data.value.class ? classColor[data.value.class] : '#888'
    }),
    singleValue: (styles, { data }: { data: { label: string, value: Player }}) => ({
        ...styles,
        color: data.value.class ? classColor[data.value.class] : '#888'
    }),
}

const themeStyles: ThemeConfig = (theme) => ({
    ...theme,
    colors: {
        ...theme.colors,
        primary: 'hsl(214, 40%, 40%)',
        primary75: 'hsl(214, 40%, 35%)',
        primary50: 'hsl(214, 40%, 30%)',
        primary25: 'hsl(216, 40%, 20%)',
        danger: theme.colors.dangerLight,
        dangerLight: theme.colors.danger,
        neutral0: 'hsl(0, 0%, 10%)',
        neutral5: 'hsl(0, 0%, 15%)',
        neutral10: 'hsl(0, 0%, 20%)',
        neutral20: 'hsl(0, 0%, 25%)',
        neutral30: 'hsl(0, 0%, 30%)',
        neutral40: 'hsl(0, 0%, 35%)',
        neutral50: 'hsl(0, 0%, 40%)',
        neutral60: 'hsl(0, 0%, 45%)',
        neutral70: 'hsl(0, 0%, 50%)',
        neutral80: 'hsl(0, 0%, 55%)',
        neutral90: 'hsl(0, 0%, 600%)',
    },

});

const ReservationsStart: React.FunctionComponent = () => {
    const history = useHistory();
    const match = useRouteMatch();

    const selectPlayer = (option: ValueType<{value: Player, label: string}>) => {
        if (option && !('length' in option)) {
            history.push(`${match.url}/aq40/${option.value.name}`);
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
                        <Select
                            options={getOptions()}
                            styles={optionStyles}
                            theme={themeStyles}
                            onChange={selectPlayer}
                        />
                    </div>
                </Route>
            </Switch>
        </div>
    )
};

export default ReservationsStart;
