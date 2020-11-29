import React, { useReducer, useState } from 'react';
import { DndProvider, DragObjectWithType } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom';
import { getPlayer } from '../../api';
import { Instance, Item, ItemScore, Player } from '../../types';
import { formatName } from '../PlayerName';
import LootOptionsList from './LootOptionsList';
import ReservationList from './ReservationList';
import { getItemScores, getScoreGroupEdges, ReservationsList, submitReservations } from '../../api/reservations';
import { initialState, ItemSlot, addItem, moveItem,
        replaceItem, swapItem, removeItem, reducer } from './state';
import Trashcan from './Trashcan';
import Button from '../Button';
import style from './Reservations.module.css';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type ReservationsProps = {
    instance: Instance,
    onChangePlayer: () => void,
}

type ReservationsParams = {
    playerName: string,
}

const invalidStateMessage = (state: Partial<Record<ItemScore, ItemSlot>>, instance: Instance): string | undefined => {
    const edgeScores = getScoreGroupEdges(instance);
    let invalidSections = 0;
    let currentCount = 0;
    console.log(edgeScores, state);
    for (const score of getItemScores(instance)) {
        if (state[score] && state[score]?.item.restricted) {
            currentCount++;
        }
        if (edgeScores.includes(score)) {
            if (currentCount > 1) invalidSections++;
            currentCount = 0;
        }
        console.log(state[score], currentCount, invalidSections);
    }
    if (currentCount > 1) invalidSections++;

    if (invalidSections) return `${invalidSections} ${invalidSections > 1 ? 'sections' : 'section'} contain too many restricted items!`
    return undefined;
}

const Reservations: React.FunctionComponent<ReservationsProps> = ({ instance, onChangePlayer }) => {
    const { playerName } = useParams<ReservationsParams>();
    const player: Player = getPlayer(formatName(playerName));
    const [state, dispatch] = useReducer(reducer, initialState(player));
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<Error>();

    const onSubmit = () => {
        if (!submitting) {
            setSubmitting(true);
            setError(undefined);

            const entries: ReservationsList = {};
            getItemScores(instance).forEach(score => entries[score] = state[score] ? (state[score] as ItemSlot).item : undefined)

            submitReservations(player, instance, entries)
                .then(() => {
                    setSubmitting(false);
                    setSubmitted(true);
                })
                .catch(e => {
                    console.error(e);
                    setSubmitting(false);
                    setError(e);
                });
        }
    };

    const invalidMessage = invalidStateMessage(state, instance);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={style.wrap}>
                <div className={style.loot}>
                    <LootOptionsList instance={instance} />
                </div>
                <div className={style.reservations}>
                    <ReservationList
                        player={player}
                        instance={instance}
                        state={state}
                        addItem={addItem(dispatch)}
                        moveItem={moveItem(dispatch)}
                        replaceItem={replaceItem(dispatch)}
                        swapItem={swapItem(dispatch)}
                        onChangePlayer={onChangePlayer}
                    />
                </div>
                <div className={style.trash}>
                    <Trashcan removeItem={removeItem(dispatch)} />
                </div>
                <div className={style.submit}>
                    {submitting ? (
                        <div className={style.submitting}>
                            Submitting...
                        </div>
                    ) : submitted ? (
                        <div className={style.submitted}>
                            <FontAwesomeIcon icon={faCheck} /> Submitted
                        </div>
                    ) : (
                        <>
                            {invalidMessage ? (
                                <p className={style.invalidStateMessage}>
                                    {invalidMessage}
                                </p>
                            ) : (
                                <Button onClick={onSubmit} >
                                    Submit
                                </Button>
                            )}
                            {!!error && (
                                <div className={style.errorWrap}>
                                    <div className={style.errorTitle}>
                                        Error:
                                    </div>
                                    <pre className={style.errorMessage}>
                                        {error.message}
                                    </pre>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </DndProvider>
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
