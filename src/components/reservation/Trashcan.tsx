import React, { Dispatch } from 'react';
import { useDrop } from 'react-dnd';
import style from './Trashcan.module.css';
import { Action } from './ReservationList';
import { DragItem, DropResult } from './Reservations';

interface TrascanProps {
    dispatch: Dispatch<Action>,
};

interface CollectedProps {
    canDrop: boolean,
    isOver: boolean,
}

const Trashcan: React.FunctionComponent<TrascanProps> = ({ dispatch }) => {
    const [{ canDrop, isOver }, dropRef] = useDrop<DragItem, DropResult, CollectedProps>({
        accept: 'ITEM',
        drop: (dropItem, monitor) => {
            if (dropItem.sourceScore) {
                dispatch({
                    type: 'REMOVE',
                    score: dropItem.sourceScore,
                });
            } else {
                // Dropped item taken from droplist
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
        // canDrop: () => !received,
    });

    const isActive = canDrop && isOver;
    let backgroundColor = '#222';
    let border = '1px solid #222';
    if (isActive) {
        border = '1px solid #888';
    } else if (canDrop) {
        backgroundColor = '#333';
    }

    return (
        <div className={style.wrap} ref={dropRef} style={{ backgroundColor, border }}>
            Remove item
        </div>
    )
};

export default Trashcan;
