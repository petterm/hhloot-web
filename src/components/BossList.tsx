import React, { useState } from 'react';
import { instanceName } from '../constants';
import { Boss, Player, BossDrop, Instance } from '../types'
import BossEntry from './BossEntry';
import style from './BossList.module.css';
import LootPlayers from './LootPlayers';

type BossListProps = { bosses: Boss[], instance: Instance };
type LootPlayer = {
    player: Player,
    loot: BossDrop,
};

const localStorageSet = (key: string, value: boolean) => {
    if (value) {
        localStorage.setItem(key, "true");
    } else {
        localStorage.removeItem(key);
    }
}

const BossList = ({ bosses, instance }: BossListProps) => {
    const [hideReceived, setHideReceivedInner] = useState(localStorage.getItem("hideReceived") ? true : false);
    const setHideReceived = (value: boolean) => {
        setHideReceivedInner(value);
        localStorageSet("hideReceived", value);
    }

    const [masterLooter, setMasterLooterInner] = useState(localStorage.getItem("masterLooter") ? true : false);
    const setMasterLooter = (value: boolean) => {
        setMasterLooterInner(value);
        localStorageSet("masterLooter", value);
    }

    const [oldMembers, setOldMembersInner] = useState(localStorage.getItem("oldMembers") ? true : false);
    const setOldMembers = (value: boolean) => {
        setOldMembersInner(value);
        localStorageSet("oldMembers", value);
    }


    const [lootPlayer, setLootPlayer] = useState<LootPlayer>();

    const onSelectLootPlayer = (loot: BossDrop, player: Player) => {
        if (lootPlayer && lootPlayer.loot === loot && lootPlayer.player === player) {
            setLootPlayer(undefined);
        } else {
            setLootPlayer({ player, loot });
        }
    }

    const onClosePopup = () => setLootPlayer(undefined);

    bosses.sort((a, b) => a.index - b.index);
    return (
        <div className={style.wrapper}>
            <div>
                <h1>Bosses</h1>
                <label style={{ cursor: "pointer" }}>
                    <input
                        type='checkbox'
                        style={{ marginRight: 5, cursor: "pointer" }}
                        checked={hideReceived}
                        onChange={() => setHideReceived(!hideReceived)}
                    />
                    Hide received items
                </label>
                {" - "}
                <label style={{ cursor: "pointer" }}>
                    <input
                        type='checkbox'
                        style={{ marginRight: 5, cursor: "pointer" }}
                        checked={masterLooter}
                        onChange={() => setMasterLooter(!masterLooter)}
                    />
                    Masterlooter mode
                </label>
                {" - "}
                <label style={{ cursor: "pointer" }}>
                    <input
                        type='checkbox'
                        style={{ marginRight: 5, cursor: "pointer" }}
                        checked={oldMembers}
                        onChange={() => setOldMembers(!oldMembers)}
                    />
                    Show old members
                </label>
            </div>
            <div>
                {bosses.map(boss => (
                    <BossEntry
                        boss={boss}
                        key={boss.name}
                        hideReceived={hideReceived}
                        masterlooter={masterLooter}
                        oldMembers={oldMembers}
                        instance={instance}
                        onSelectLootPlayer={onSelectLootPlayer}
                    />
                ))}
            </div>
            {lootPlayer ? (
                <div className={style.popup}>
                    <LootPlayers loot={lootPlayer.loot} player={lootPlayer.player} instance={instance} />
                    <button className={style.popupClose} onClick={onClosePopup}>
                        Close
                    </button>
                </div>
            ) : null}
        </div>
    );
};

export default BossList;
