import React from 'react';
import { useDrop } from 'react-dnd';
import { Instance, Item, ItemScore } from '../../types';
import { DragItem, DropResult } from './Reservations';
import ReservationItem from './ReservationItem';
import style from './ReservationListSlot.module.css';
import { getInstanceData } from '../../api';

interface ReservationListSlotProps {
    slotScore: ItemScore,
    addItem: (item: Item, score: ItemScore) => void,
    moveItem: (sourceScore: ItemScore, targetScore: ItemScore) => void,
    replaceItem: (item: Item, score: ItemScore) => void,
    swapItem: (sourceScore: ItemScore, targetScore: ItemScore) => void,
    instance: Instance,
    item?: Item,
    received?: string,
};

interface CollectedProps {
    canDrop: boolean,
    isOver: boolean,
}

const ReservationListSlot: React.FunctionComponent<ReservationListSlotProps> = ({
    slotScore, item, received, addItem, moveItem, replaceItem, swapItem, instance,
}) => {
    const [{ canDrop, isOver }, dropRef] = useDrop<DragItem, DropResult, CollectedProps>({
        accept: 'ITEM',
        drop: (dropItem, monitor) => {
            if (dropItem.sourceScore) {
                if (item) {
                    swapItem(dropItem.sourceScore, slotScore);
                } else {
                    moveItem(dropItem.sourceScore, slotScore);
                }
            } else {
                if (item) {
                    replaceItem(dropItem.item, slotScore);
                } else {
                    addItem(dropItem.item, slotScore);
                }
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
        canDrop: (dropItem) => !received && dropItem.item !== item,
    });
    const instanceData = getInstanceData(instance);

    const isActive = canDrop && isOver;
    const wrapClass = [style.wrap];

    if (received) {
        wrapClass.push(style.wrapReceived);
    }

    if (isActive) {
        wrapClass.push(style.wrapActive);
    }

    if (canDrop) {
        wrapClass.push(style.wrapDrop);
    }

    if (instanceData.scoreGroupEdges.includes(slotScore)) {
        wrapClass.push(style.wrapScoreRowEdge);
    }

    return (
        <div className={wrapClass.join(' ')}>
            <div className={style.slotScore}>
                {slotScore}
            </div>
            <div className={style.slotItem} ref={dropRef}>
                {item && (
                    <ReservationItem
                        item={item}
                        slotScore={slotScore}
                        locked={!!received}
                    />
                )}
            </div>
        </div>
    )
};

export default ReservationListSlot;
