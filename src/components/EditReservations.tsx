import React from 'react';
import style from './EditReservations.module.css';
import ItemLink from './ItemLink';

export const EditReservations: React.FunctionComponent = () => {
    return (
        <div className={style.wrap}>
            <div className={style.lootList}>
                {Array(5).map((v, index) => (
                    <div className={style.bossEntry} key={index}>
                        <h3>Boss Name</h3>
                        <div className={style.bossEntryLoot}>
                            <div className={style.bossEntryLoot}>
                                {Array(8).map((v, index) => (
                                    <ItemLink item={{ id: 21650, name: 'test', restricted: false }} size='medium' key={index} />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={style.reservations}>
                <div className={style.group}>
                    <div className={style.slot}>
                        <div className={style.slotScore}>100</div>
                        <div className={style.slotItem}></div>
                    </div>
                    <div className={style.slot}>
                        <div className={style.slotScore}>90</div>
                        <div className={style.slotItem}>
                            <ItemLink item={{ id: 21650, name: 'test', restricted: false }} size='medium' />
                        </div>
                    </div>
                    <div className={style.slot}>
                        <div className={style.slotScore}>80</div>
                        <div className={style.slotItem}>
                            <ItemLink item={{ id: 21650, name: 'test', restricted: false }} size='medium' />
                        </div>
                    </div>
                </div>
                <div className={style.group}>
                    <div className={style.slot}>
                        <div className={style.slotScore}>70</div>
                        <div className={style.slotItem}></div>
                    </div>
                    <div className={style.slot}>
                        <div className={style.slotScore}>65</div>
                        <div className={style.slotItem}></div>
                    </div>
                    <div className={style.slot}>
                        <div className={style.slotScore}>60</div>
                        <div className={style.slotItem}></div>
                    </div>
                </div>
                <div className={style.group}>
                    <div className={style.slot}>
                        <div className={style.slotScore}>55</div>
                        <div className={style.slotItem}></div>
                    </div>
                    <div className={style.slot}>
                        <div className={style.slotScore}>54</div>
                        <div className={style.slotItem}></div>
                    </div>
                    <div className={style.slot}>
                        <div className={style.slotScore}>53</div>
                        <div className={style.slotItem}></div>
                    </div>
                    <div className={style.slot}>
                        <div className={style.slotScore}>52</div>
                        <div className={style.slotItem}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
