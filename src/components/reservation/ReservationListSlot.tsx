import React, { Dispatch } from 'react';
import { useDrop } from 'react-dnd';
import { Item, ItemScore } from '../../types';
import { Action } from './ReservationList';
import { DragItem, DropResult } from './Reservations';
import ReservationItem from './ReservationItem';
import style from './ReservationListSlot.module.css';

interface ReservationListSlotProps {
    slotScore: ItemScore,
    item?: Item,
    dispatch: Dispatch<Action>,
    received?: string,
};

interface CollectedProps {
    canDrop: boolean,
    isOver: boolean,
}

const ReservationListSlot: React.FunctionComponent<ReservationListSlotProps> = ({ slotScore, item, received, dispatch }) => {
    const [{ canDrop, isOver }, dropRef] = useDrop<DragItem, DropResult, CollectedProps>({
        accept: 'ITEM',
        drop: (dropItem, monitor) => {
            if (dropItem.sourceScore) {
                dispatch({
                    type: item ? 'SWAP' : 'MOVE',
                    sourceScore: dropItem.sourceScore,
                    targetScore: slotScore
                });
            } else {
                dispatch({
                    type: item ? 'REPLACE' : 'ADD',
                    item: (dropItem as any).item,
                    score: slotScore,
                });
            }

            return {
                name: `Reservation slot ${slotScore}`,
                type: 'SLOT',
            };
        },
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
            isOver: monitor.isOver(),
        }),
        canDrop: () => !received,
    });

    const isActive = canDrop && isOver;
    let backgroundColor = received ? '#1d3d1d' : '#222';
    let border = '1px solid #222';
    if (isActive) {
        border = '1px solid #888';
    } else if (canDrop) {
        backgroundColor = '#333';
    }

    return (
        <div className={style.slotWrap}>
            <div className={style.slotScore}>
                {slotScore}
            </div>
            <div className={style.slotItem} ref={dropRef} style={{ backgroundColor, border }}>
                {item && (
                    <ReservationItem
                        item={item}
                        slotScore={slotScore}
                        dispatch={dispatch}
                        locked={!!received}
                    />
                )}
            </div>
        </div>
    )
};

export default ReservationListSlot;
