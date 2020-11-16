import React, { useReducer, useState } from 'react';
import { itemScores } from '../../constants';
import { Instance, Item, ItemScore, Player } from '../../types';
import PlayerName from '../PlayerName';
import ReservationListSlot from './ReservationListSlot';
import Trashcan from './Trashcan';
import style from './ReservationList.module.css';
import { ReservationsList, submitReservations } from '../../api/reservations';
import Button from '../Button';

type ActionAdd = { type: 'ADD', score: ItemScore, item: Item };
type ActionRemove = { type: 'REMOVE', score: ItemScore };
type ActionReplace = { type: 'REPLACE', score: ItemScore, item: Item };
type ActionMove = { type: 'MOVE', targetScore: ItemScore, sourceScore: ItemScore };
type ActionSwap = { type: 'SWAP', targetScore: ItemScore, sourceScore: ItemScore };
export type Action = ActionAdd | ActionRemove | ActionReplace | ActionMove | ActionSwap;

type ItemSlot = { item: Item, received?: string };
type State = Partial<Record<ItemScore, ItemSlot>>;

const initialState = (player: Player): State => player.scoreSlots.reduce((slots, slot) => ({
    ...slots,
    [slot.score]: slot.item ? {
        item: slot.item,
        received: slot.received,
    } : undefined,
}), {});

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
                [action.score]: undefined,
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
    instance: Instance,
};

const ReservationList: React.FunctionComponent<ReservationListProps> = ({ player, instance }) => {
    const [state, dispatch] = useReducer(logReducer, initialState(player));
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<Error>();

    const onSubmit = () => {
        if (!submitting) {
            setSubmitting(true);
            setError(undefined);

            const entries: ReservationsList = {};
            itemScores.forEach(score => entries[score] = state[score] ? (state[score] as ItemSlot).item : undefined)

            submitReservations(player, instance, entries)
                .then(() => {
                    setSubmitting(false);
                    setSubmitted(true);
                })
                .catch(e => {
                    console.error(e);
                    setSubmitting(false);
                    setError(e);
                });
        }
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
                        item={state[score] ? (state[score] as ItemSlot).item : undefined}
                        received={state[score] ? (state[score] as ItemSlot).received : undefined}
                        dispatch={dispatch}
                        key={`score-${score}`}
                    />
                ))}
            </div>
            <Trashcan dispatch={dispatch} />
            <div className={style.submitWrap}>
                {submitting ? (
                    <div className={style.submitting}>
                        Submitting...
                    </div>
                ) : submitted ? (
                    <div className={style.submitted}>
                        Submitted!
                    </div>
                ) : (
                    <>
                        <Button onClick={onSubmit} >
                            Submit
                        </Button>
                        {!!error && (
                            <div className={style.errorWrap}>
                                <div className={style.errorTitle}>
                                    Error submitting:
                                </div>
                                <pre className={style.errorMessage}>
                                    {error.message}
                                </pre>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
};

export default ReservationList;
