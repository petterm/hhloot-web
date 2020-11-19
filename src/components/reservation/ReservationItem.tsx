import React from 'react';
import { useDrag } from 'react-dnd';
import { Item, ItemScore } from '../../types';
import ItemLink, { hideWowheadTooltip } from '../ItemLink';
import { DragItem, DropResult } from './Reservations';
import style from './ReservationItem.module.css';

interface ReservationItemProps {
    slotScore: ItemScore,
    item: Item,
    locked: boolean,
};

interface CollectedProps {
    isDragging: boolean
};

const ReservationItem: React.FunctionComponent<ReservationItemProps> = ({ slotScore, item, locked }) => {
    const [{ isDragging }, dragRef] = useDrag<DragItem, DropResult, CollectedProps>({
        item: { type: 'ITEM', item, sourceScore: slotScore },
        collect: (monitor) => {
            hideWowheadTooltip();
            return {
                isDragging: monitor.isDragging(),
            };
        },
        canDrag: (monitor) => !locked,
    });

    return (
        <div className={style.wrap} ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <ItemLink item={item} size='small' noTextLink />
        </div>
    )
};

export default ReservationItem;
