import React from 'react';
import { itemScores } from '../../constants';
import { Instance, Item, ItemScore, Player } from '../../types';
import PlayerName from '../PlayerName';
import ReservationListSlot from './ReservationListSlot';
import { ItemSlot, State } from './state';
import style from './ReservationList.module.css';

interface ReservationListProps {
    player: Player,
    instance: Instance,
    state: State,
    addItem: (item: Item, score: ItemScore) => void,
    moveItem: (sourceScore: ItemScore, targetScore: ItemScore) => void,
    replaceItem: (item: Item, score: ItemScore) => void,
    swapItem: (sourceScore: ItemScore, targetScore: ItemScore) => void,
};

const ReservationList: React.FunctionComponent<ReservationListProps> = ({
    player, instance, state, addItem, moveItem, replaceItem, swapItem,
}) => (
    <div className={style.wrap}>
        <h3 className={style.playerSelect}>
            <PlayerName player={player} />
        </h3>
        <div className={style.slotListWrap}>
            {itemScores.map(score => (
                <ReservationListSlot
                    slotScore={score}
                    item={state[score] ? (state[score] as ItemSlot).item : undefined}
                    received={state[score] ? (state[score] as ItemSlot).received : undefined}
                    key={`score-${score}`}
                    addItem={addItem}
                    moveItem={moveItem}
                    replaceItem={replaceItem}
                    swapItem={swapItem}
                />
            ))}
        </div>

    </div>
);

export default ReservationList;
