import React, { useReducer } from 'react';
import { itemScores, itemScoresMap } from '../../constants';
import { Item, ItemScore, Player } from '../../types';
import PlayerName from '../PlayerName';
import ReservationListSlot from './ReservationListSlot';
import Trashcan from './Trashcan';
import SubmitList from './SubmitList';
import style from './ReservationList.module.css';
import { submitReservations } from '../../api/reservations';

type ActionAdd = { type: 'ADD', score: ItemScore, item: Item };
type ActionRemove = { type: 'REMOVE', score: ItemScore };
type ActionReplace = { type: 'REPLACE', score: ItemScore, item: Item };
type ActionMove = { type: 'MOVE', targetScore: ItemScore, sourceScore: ItemScore };
type ActionSwap = { type: 'SWAP', targetScore: ItemScore, sourceScore: ItemScore };
export type Action = ActionAdd | ActionRemove | ActionReplace | ActionMove | ActionSwap;

type ItemSlot = {
    item?: Item,
    received?: string,
};

type State = { [score in ItemScore]: ItemSlot };
const initialState = (player: Player): State => player.scoreSlots.reduce((slots, slot) => ({
    ...slots,
    [slot.score]: {
        received: slot.received,
        item: slot.item
    },
}), itemScoresMap);

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'ADD':
        case 'REPLACE':
            return {
                ...state,
                [action.score]: { item: action.item },
            }
        case 'REMOVE':
            return {
                ...state,
                [action.score]: {},
            }
        case 'MOVE':
            return {
                ...state,
                [action.sourceScore]: undefined,
                [action.targetScore]: state[action.sourceScore],
            }
        case 'SWAP':
            return {
                ...state,
                [action.sourceScore]: state[action.targetScore],
                [action.targetScore]: state[action.sourceScore],
            }
        default:
            throw new Error('Reservations action missing type');
    }
};

const logReducer = (state: State, action: Action) => {
    const newState = reducer(state, action);
    console.log(state, action, newState);
    return newState;
}

interface ReservationListProps {
    player: Player,
};

const ReservationList: React.FunctionComponent<ReservationListProps> = ({ player }) => {
    const [state, dispatch] = useReducer(logReducer, initialState(player));
    const onSubmit = () => {
        submitReservations(player, itemScores.reduce((slots, score) => ({
            ...slots,
            [score]: state[score].item,
        }), itemScoresMap))
    };

    return (
        <div className={style.wrap}>
            <div className={style.playerSelect}>
                <PlayerName player={player} />
            </div>
            <div className={style.slotListWrap}>
                {itemScores.map(score => (
                    <ReservationListSlot
                        slotScore={score}
                        item={state[score].item}
                        received={state[score].received}
                        dispatch={dispatch}
                        key={`score-${score}`}
                    />
                ))}
            </div>
            <Trashcan dispatch={dispatch} />
            <SubmitList onSubmit={onSubmit} validList={true} />
        </div>
    )
};

export default ReservationList;
