import React, { useReducer } from 'react';
import Select, { StylesConfig, ValueType } from 'react-select';
import { classColor, itemScores } from '../../constants';
import { Item, ItemScore, Player } from '../../types';
import ReservationListSlot from './ReservationListSlot';
import style from './ReservationList.module.css';
import { getPlayers } from '../../api/async';
import { ThemeConfig } from 'react-select/src/theme';

type ActionChangePlayer = { type: 'CHANGE_PLAYER', player?: Player };
type ActionAdd = { type: 'ADD', score: ItemScore, item: Item };
type ActionReplace = { type: 'REPLACE', score: ItemScore, item: Item };
type ActionMove = { type: 'MOVE', targetScore: ItemScore, sourceScore: ItemScore };
type ActionSwap = { type: 'SWAP', targetScore: ItemScore, sourceScore: ItemScore };
export type Action = ActionChangePlayer | ActionAdd | ActionReplace | ActionMove | ActionSwap;

type ItemSlot = {
    item?: Item,
    received?: string,
};

type State = {
    player?: Player,
    slots: { [score in ItemScore]: ItemSlot },
};
const initialState: State = {
    slots: { 100: {}, 90: {}, 80: {}, 70: {},
        65: {}, 60: {}, 55: {}, 54: {}, 53: {}, 52: {} },
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'ADD':
        case 'REPLACE':
            return {
                player: state.player,
                slots: {
                    ...state.slots,
                    [action.score]: { item: action.item },
                }
            }
        case 'MOVE':
            return {
                player: state.player,
                slots: {
                    ...state.slots,
                    [action.sourceScore]: undefined,
                    [action.targetScore]: state.slots[action.sourceScore],
                }
            }
        case 'SWAP':
            return {
                player: state.player,
                slots: {
                    ...state.slots,
                    [action.sourceScore]: state.slots[action.targetScore],
                    [action.targetScore]: state.slots[action.sourceScore],
                }
            }
        case 'CHANGE_PLAYER':
            if (action.player) {
                return {
                    player: action.player,
                    slots: action.player.scoreSlots.reduce((slots, slot) => ({
                        ...slots,
                        [slot.score]: {
                            received: slot.received,
                            item: slot.item
                        },
                    }), { ...initialState.slots })
                }
            }
            return initialState;
        default:
            throw new Error('Reservations action missing type');
    }
};

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

const logReducer = (state: State, action: Action) => {
    const newState = reducer(state, action);
    console.log(state, action, newState);
    return newState;
}

const ReservationList: React.FunctionComponent = () => {
    const [state, dispatch] = useReducer(logReducer, initialState);

    if (state.player) {
        
    }

    return (
        <div className={style.wrap}>
            <div className={style.playerSelect}>
                <Select
                    options={getOptions()}
                    styles={optionStyles}
                    theme={themeStyles}
                    onChange={(option: ValueType<{value: Player, label: string}>) => {
                        dispatch({ type: 'CHANGE_PLAYER', player: option && !('length' in option) ? option.value : undefined });
                    }}
                />
            </div>
            <div className={style.slotListWrap}>
                {itemScores.map(score => (
                    <ReservationListSlot
                        slotScore={score}
                        item={state.slots[score].item}
                        received={state.slots[score].received}
                        dispatch={dispatch}
                        key={`score-${score}`}
                    />
                ))}
            </div>
        </div>
    )
};

export default ReservationList;
