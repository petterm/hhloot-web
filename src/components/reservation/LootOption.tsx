import React from 'react';
import { useDrag } from 'react-dnd';
import { Item } from '../../types';
import ItemLink, { hideWowheadTooltip } from '../ItemLink';
import style from './LootOption.module.css';
import { CollectedProps, DragItem, DropResult } from './Reservations';

interface LootOptionProps {
    item: Item
};

const LootOption: React.FunctionComponent<LootOptionProps> = ({ item }) => {
    const [{ isDragging }, dragRef, dragRefPreview] = useDrag<DragItem, DropResult, CollectedProps>({
        type: 'ITEM',
        item: () => {
            hideWowheadTooltip();
            return { item, };
        },
    });

    return isDragging ? (
        <div className={style.wrap} ref={dragRefPreview} style={{ opacity: 0.5 }}>
            <div className={style.itemDragable}>
                <ItemLink item={item} size='small' noTextLink />
            </div>
        </div>

    ) : (
        <div className={style.wrap} ref={dragRef}>
            <div className={style.itemDragable}>
                <ItemLink item={item} size='small' />
            </div>
        </div>
    )
};

export default LootOption;
