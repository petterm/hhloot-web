import React from 'react';
import { Player } from '../types'
import { classColor } from '../constants';
import { getPlayers } from '../api/async';
import Select, { ActionMeta, StylesConfig, ThemeConfig } from 'react-select';

type PlayerOption = {value: Player, label: string};

const getOptions = (officers: boolean) => {
    let players = Object.values(getPlayers());
    if (officers) {
        players = players.filter(a => a.guildRank && ['Guild Master', 'Officer'].includes(a.guildRank));
    }

    players.sort((a, b) => a.name.localeCompare(b.name));

    return players.map(player => ({
        value: player,
        label: player.name,
    }));
}

const optionStyles: StylesConfig<PlayerOption> = {
    option: (baseStyles, { data: { value }}) => ({
        ...baseStyles,
        color: value.class ? classColor[value.class] : '#888',
    }),
    singleValue: (baseStyles, { data: { value }}) => ({
        ...baseStyles,
        color: value.class ? classColor[value.class] : '#888',
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
    (option: PlayerOption | null, action: ActionMeta<PlayerOption>) => {
        if (action.action === "select-option" && option && !('length' in option)) {
            callback(option.value);
        } else {
            callback(undefined);
        }
    };

type PlayerSelectProps = {
    value?: Player,
    onChange: (player: Player | undefined) => void,
    officers?: boolean,
    isClearable?: boolean,
    placeholder?: string,
};
const PlayerSelect: React.FunctionComponent<PlayerSelectProps> = ({
    value, onChange, officers, isClearable, placeholder,
}) => (
    <Select
        isClearable={isClearable}
        isMulti={false}
        onChange={selectPlayer(onChange)}
        options={getOptions(officers || false)}
        placeholder={placeholder}
        styles={optionStyles}
        theme={themeStyles}
        value={value ? { value: value, label: value.name } : undefined}
    />
);

export default PlayerSelect;
