import React from 'react';
import { Player } from '../types'
import { classColor } from '../constants';
import { getPlayers } from '../api/async';
import Select, { ActionMeta, StylesConfig, ValueType } from 'react-select';
import { ThemeConfig } from 'react-select/src/theme';

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

const selectPlayer = (callback: (player: Player | undefined) => void) =>
    (option: ValueType<{value: Player, label: string}>, action: ActionMeta<{value: Player, label: string}>) => {
        if (action.action === "select-option" && option && !('length' in option)) {
            callback(option.value);
        } else {
            callback(undefined);
        }
    };

type PlayerSelectProps = { onChange: (player: Player | undefined) => void };
const PlayerSelect: React.FunctionComponent<PlayerSelectProps> = ({ onChange }) => (
    <Select
        options={getOptions()}
        styles={optionStyles}
        theme={themeStyles}
        onChange={selectPlayer(onChange)}
        isClearable
    />
);

export default PlayerSelect;
