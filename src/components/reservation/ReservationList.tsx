import React from 'react';
import { itemScores } from '../../constants';
import { Droppable } from 'react-beautiful-dnd';
import style from './ReservationList.module.css';

export const ReservationList: React.FunctionComponent = () => {
    return (
        <div className={style.wrap}>
            {itemScores.map(score => (
                <div className={style.slotWrap}>
                    <div className={style.slotScore}>
                        {score}
                    </div>
                    <div className={style.slotItem}>
                        <Droppable droppableId={`slot-${score}`} type="ITEM">
                            {(provided, snapshot)=> (
                                <div
                                    className={style.slotDroppable}
                                    ref={provided.innerRef}
                                    style={{
                                        // backgroundColor: snapshot.isDraggingOver ? 'darkgray' : 'none',
                                        height: 22,
                                        padding: 10,
                                    }}
                                    {...provided.droppableProps}
                                >
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            ))}
        </div>
    )
};
