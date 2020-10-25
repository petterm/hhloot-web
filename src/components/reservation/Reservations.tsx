import React from 'react';
import { DndProvider, DragObjectWithType } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Item, ItemScore } from '../../types';
import LootOptionsList from './LootOptionsList';
import ReservationList from './ReservationList';
import style from './Reservations.module.css';

const Reservations: React.FunctionComponent = () => {

    return (
        <div className={style.wrap}>
            <DndProvider backend={HTML5Backend}>
                <LootOptionsList />
                <ReservationList />
            </DndProvider>
        </div>
    )
};

export interface DragItem extends DragObjectWithType{
    item: Item,
    sourceScore?: ItemScore,
}

export interface DropResult {
    name: string,
    type: 'SLOT' | 'TRASH',
}

export default Reservations;
