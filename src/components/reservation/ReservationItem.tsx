import React, { Dispatch } from 'react';
import { useDrag } from 'react-dnd';
import { Item, ItemScore } from '../../types';
import style from './ReservationItem.module.css';
import { Action } from './ReservationList';
import ItemLink, { hideWowheadTooltip } from '../ItemLink';
import { DragItem, DropResult } from './Reservations';

interface ReservationItemProps {
    slotScore: ItemScore,
    item: Item,
    dispatch: Dispatch<Action>,
};

interface CollectedProps {
    isDragging: boolean
};

const ReservationItem: React.FunctionComponent<ReservationItemProps> = ({ slotScore, item, dispatch }) => {
    const [{ isDragging }, dragRef] = useDrag<DragItem, DropResult, CollectedProps>({
        item: { type: 'ITEM', item, sourceScore: slotScore },
        collect: (monitor) => {
            hideWowheadTooltip();
            return {
                isDragging: monitor.isDragging(),
            };
        },
    });

    return (
        <div className={style.wrap} ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <ItemLink item={item} size='small' />
        </div>
    )
};

export default ReservationItem;
