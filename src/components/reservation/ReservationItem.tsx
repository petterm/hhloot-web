import React from 'react';
import { useDrag } from 'react-dnd';
import { Item, ItemScore } from '../../types';
import ItemLink, { hideWowheadTooltip } from '../ItemLink';
import { DragItem, DropResult, CollectedProps } from './Reservations';
import style from './ReservationItem.module.css';

interface ReservationItemProps {
    slotScore: ItemScore,
    item: Item,
    locked: boolean,
};


const ReservationItem: React.FunctionComponent<ReservationItemProps> = ({ slotScore, item, locked }) => {
    const [{ isDragging }, dragRef, dragRefPreview] = useDrag<DragItem, DropResult, CollectedProps>({
        type: 'ITEM',
        canDrag: (monitor) => !locked,
        item: () => {
            hideWowheadTooltip();
            return { item, sourceScore: slotScore };
        },
    });

    return isDragging ? (
        <div className={style.wrap} ref={dragRefPreview} style={{ opacity: 0.5 }}>
            <ItemLink item={item} size='small' noTextLink />
        </div>
    ) : (
        <div className={style.wrap} ref={dragRef}>
            <ItemLink item={item} size='small' />
        </div>
    )
};

export default ReservationItem;
