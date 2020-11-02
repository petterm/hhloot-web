import React from 'react';
import { DndProvider, DragObjectWithType } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Redirect, useParams } from 'react-router-dom';
import { getPlayer } from '../../api';
import { Instance, Item, ItemScore, Player } from '../../types';
import { formatName } from '../PlayerName';
import LootOptionsList from './LootOptionsList';
import ReservationList from './ReservationList';
import style from './Reservations.module.css';

type ReservationsParams = {
    instance: Instance,
    playerName: string,
}

const Reservations: React.FunctionComponent = () => {
    const { instance, playerName } = useParams<ReservationsParams>();
    const player: Player = getPlayer(formatName(playerName));

    if (!player) {
        return (<Redirect to={'/reservations'} />)
    }

    return (
        <div className={style.wrap}>
            <DndProvider backend={HTML5Backend}>
                <LootOptionsList instance={instance} />
                <ReservationList player={player} />
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
