import React, { useState } from 'react';
import { DndProvider, DragObjectWithType } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Redirect, useParams } from 'react-router-dom';
import { getPlayer } from '../../api';
import { ReservationsList, submitReservations } from '../../api/reservations';
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

    const [submitting, setSubmitting] = useState(false);
    const onSubmit = (entries: ReservationsList) => {
        if (!submitting) {
            submitReservations(player, instance, entries)
                .then(() => setSubmitting(false));
            setSubmitting(true);
        }
    };


    if (!player) {
        return (<Redirect to={'/reservations'} />)
    }

    return (
        <div className={style.wrap}>
            <DndProvider backend={HTML5Backend}>
                <LootOptionsList instance={instance} />
                <ReservationList player={player} onSubmit={onSubmit} />
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
