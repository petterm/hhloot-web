import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Item } from '../../types';
import ItemLink from '../ItemLink';
import style from './LootOption.module.css';

interface LootOptionProps {
    item: Item
};

export const LootOption: React.FunctionComponent<LootOptionProps> = ({ item }) => {
    return (
        <div className={style.wrap}>
            <Droppable droppableId={`source-item-${item.id}`} type="ITEM" isDropDisabled={false}>
                {(provided, snapshot)=> (
                    <div
                        ref={provided.innerRef}
                        // style={{ backgroundColor: snapshot.isDraggingOver ? 'blue' : 'grey' }}
                        {...provided.droppableProps}
                    >
                        <Draggable draggableId={`item-${item.id}`} index={0}>
                            {(provided, snapshot) => (
                                <div
                                    className={style.itemDragable}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <ItemLink item={item} size='small' />
                                </div>
                            )}
                        </Draggable>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
};
