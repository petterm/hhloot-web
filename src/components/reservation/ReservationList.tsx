import React from 'react';
import { Instance, Item, ItemScore, Player } from '../../types';
import PlayerName from '../PlayerName';
import ReservationListSlot from './ReservationListSlot';
import { ItemSlot, State } from './state';
import style from './ReservationList.module.css';
import { getItemScores } from '../../api/reservations';

interface ReservationListProps {
    player: Player,
    instance: Instance,
    state: State,
    addItem: (item: Item, score: ItemScore) => void,
    moveItem: (sourceScore: ItemScore, targetScore: ItemScore) => void,
    replaceItem: (item: Item, score: ItemScore) => void,
    swapItem: (sourceScore: ItemScore, targetScore: ItemScore) => void,
    onChangePlayer: () => void,
};

const ReservationList: React.FunctionComponent<ReservationListProps> = ({
    player, instance, state, addItem, moveItem, replaceItem, swapItem, onChangePlayer
}) => (
    <div className={style.wrap}>
        <h3 className={style.playerSelect}>
            <PlayerName player={player} />
            <button className={style.changePlayer} onClick={onChangePlayer}>
                Change player
            </button>
        </h3>
        <div className={style.slotListWrap}>
            {getItemScores(instance).map(score => (
                <ReservationListSlot
                    key={`score-${score}`}
                    slotScore={score}
                    item={state[score] ? (state[score] as ItemSlot).item : undefined}
                    received={state[score] ? (state[score] as ItemSlot).received : undefined}
                    instance={instance}
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
