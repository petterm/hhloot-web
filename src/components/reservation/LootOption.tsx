import React from 'react';
import { DragSourceMonitor, useDrag } from 'react-dnd';
import { Item } from '../../types';
import ItemLink, { hideWowheadTooltip } from '../ItemLink';
import style from './LootOption.module.css';

interface LootOptionProps {
    item: Item
};

const LootOption: React.FunctionComponent<LootOptionProps> = ({ item }) => {
    const [{ isDragging }, dragRef] = useDrag({
        item: { type: 'ITEM', item },
        collect: (monitor) => {
            hideWowheadTooltip();
            return {
                isDragging: monitor.isDragging(),
            };
        },
        end: (item: { item: Item } | undefined, monitor: DragSourceMonitor) => {
            const dropResult = monitor.getDropResult();
            if (item  && dropResult) {
                console.log('Drop success', item, dropResult.name)
            }
        }
    });
    return (
        <div className={style.wrap} ref={dragRef} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <div className={style.itemDragable}>
                <ItemLink item={item} size='small' />
            </div>
        </div>
    )
};

export default LootOption;
