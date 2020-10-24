import React, { useCallback } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { LootOptionsList } from './LootOptionsList';
import { ReservationList } from './ReservationList';
import style from './Reservations.module.css';

export const Reservations: React.FunctionComponent = () => {
    // using useCallback is optional
    const onBeforeCapture = useCallback(() => {
        /*...*/
    }, []);
    const onBeforeDragStart = useCallback(() => {
        /*...*/
    }, []);
    const onDragStart = useCallback(() => {
        /*...*/
    }, []);
    const onDragUpdate = useCallback(() => {
        /*...*/
    }, []);
    const onDragEnd = useCallback(() => {
        // the only one that is required
    }, []);

    return (
        <DragDropContext
            onBeforeCapture={onBeforeCapture}
            onBeforeDragStart={onBeforeDragStart}
            onDragStart={onDragStart}
            onDragUpdate={onDragUpdate}
            onDragEnd={onDragEnd}
        >
            <div className={style.wrap}>
                <div className={style.lootList}>
                    <LootOptionsList />
                </div>
                <div className={style.reservationList}>
                    <ReservationList />
                </div>
            </div>
        </DragDropContext>
    )
};
