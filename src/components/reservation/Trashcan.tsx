import React from 'react';
import { useDrop } from 'react-dnd';
import { DragItem, DropResult } from './Reservations';
import { ItemScore } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import style from './Trashcan.module.css';

interface TrascanProps {
    removeItem: (score: ItemScore) => void,
};

interface CollectedProps {
    canDrop: boolean,
    isOver: boolean,
}

const Trashcan: React.FunctionComponent<TrascanProps> = ({ removeItem }) => {
    const [{ canDrop, isOver }, dropRef] = useDrop<DragItem, DropResult, CollectedProps>({
        accept: 'ITEM',
        drop: (dropItem, monitor) => {
            if (dropItem.sourceScore) {
                removeItem(dropItem.sourceScore);
            }
            return {
                name: `Trashcan ${dropItem.item.name}`,
                type: 'TRASH',
            };
        },
        collect: (monitor) => ({
            canDrop: monitor.canDrop(),
            isOver: monitor.isOver(),
        }),
    });

    const isActive = canDrop && isOver;
    const wrapClass = [style.wrap];

    if (isActive) {
        wrapClass.push(style.wrapActive);
    }

    if (canDrop) {
        wrapClass.push(style.wrapDrop);
    }

    return (
        <div className={wrapClass.join(' ')} ref={dropRef}>
            <FontAwesomeIcon icon={faTrash} /> Remove
        </div>
    )
};

export default Trashcan;
