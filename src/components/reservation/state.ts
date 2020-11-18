import { Dispatch } from "react";
import { Item, ItemScore, Player } from "../../types";

export type ItemSlot = { item: Item, received?: string };
export type State = Partial<Record<ItemScore, ItemSlot>>;

type ActionAdd = { type: 'ADD', score: ItemScore, item: Item };
type ActionRemove = { type: 'REMOVE', score: ItemScore };
type ActionReplace = { type: 'REPLACE', score: ItemScore, item: Item };
type ActionMove = { type: 'MOVE', targetScore: ItemScore, sourceScore: ItemScore };
type ActionSwap = { type: 'SWAP', targetScore: ItemScore, sourceScore: ItemScore };
export type Action = ActionAdd | ActionRemove | ActionReplace | ActionMove | ActionSwap;

export const initialState = (player: Player): State => player.scoreSlots.reduce((slots, slot) => ({
    ...slots,
    [slot.score]: slot.item ? {
        item: slot.item,
        received: slot.received,
    } : undefined,
}), {});

export const reducer = (state: State, action: Action): State => {
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

export const logReducer = (state: State, action: Action) => {
    const newState = reducer(state, action);
    console.log(state, action, newState);
    return newState;
}

export const addItem = (dispatch: Dispatch<Action>) =>
    (item: Item, score: ItemScore) => dispatch({ type: 'ADD', item, score });

export const replaceItem = (dispatch: Dispatch<Action>) =>
    (item: Item, score: ItemScore) => dispatch({ type: 'REPLACE', item, score });

export const moveItem = (dispatch: Dispatch<Action>) =>
    (sourceScore: ItemScore, targetScore: ItemScore) => dispatch({ type: 'MOVE', sourceScore, targetScore });

export const swapItem = (dispatch: Dispatch<Action>) =>
    (sourceScore: ItemScore, targetScore: ItemScore) => dispatch({ type: 'SWAP', sourceScore, targetScore });

export const removeItem = (dispatch: Dispatch<Action>) => (score: ItemScore) => dispatch({ type: 'REMOVE', score });
