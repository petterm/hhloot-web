import React from 'react';
import { Boss, Player, BossDrop } from '../types'
import BossEntry from './BossEntry';
import style from './BossList.module.css';
import LootPlayers from './LootPlayers';

type BossListProps = { bosses: Boss[] };
type BossListState = {
    hideReceived: boolean,
    masterLooter: boolean,
    lootPlayer?: {
        player: Player,
        loot: BossDrop,
    }
};

class BossList extends React.Component<BossListProps, BossListState> {
    state: BossListState = {
        hideReceived: false,
        masterLooter: false,
        lootPlayer: undefined,
    };

    constructor(props: BossListProps) {
        super(props);
        this.onSelectLootPlayer = this.onSelectLootPlayer.bind(this);
        this.onClosePopup = this.onClosePopup.bind(this);
    }

    onSelectLootPlayer(loot: BossDrop, player: Player) {
        const { lootPlayer } = this.state;
        if (lootPlayer && lootPlayer.loot === loot && lootPlayer.player === player) {
            this.setState({
                lootPlayer: undefined,
            });
        } else {
            this.setState({
                lootPlayer: {
                    player, loot,
                }
            });
        }
    }

    onClosePopup() {
        this.setState({
            lootPlayer: undefined,
        });
    }
    
    render() {
        // const bosses = this.props.bosses.slice(-3);
        this.props.bosses.sort((a, b) => a.index - b.index);
        return (
            <div className={style.wrapper}>
                <div>
                    <h1>Bosses AQ 40</h1>
                    <label style={{ cursor: "pointer" }}>
                        <input
                            type='checkbox'
                            style={{ marginRight: 5, cursor: "pointer" }}
                            checked={this.state.hideReceived}
                            onChange={() => this.setState({ hideReceived: !this.state.hideReceived })}
                        />
                        Hide received items
                    </label>
                    {" - "}
                    <label style={{ cursor: "pointer" }}>
                        <input
                            type='checkbox'
                            style={{ marginRight: 5, cursor: "pointer" }}
                            checked={this.state.masterLooter}
                            onChange={() => this.setState({ masterLooter: !this.state.masterLooter })}
                        />
                        Masterlooter mode
                    </label>
                </div>
                <div>
                    {this.props.bosses.map(boss => (
                        <BossEntry
                            boss={boss}
                            key={boss.name}
                            hideReceived={this.state.hideReceived}
                            masterlooter={this.state.masterLooter}
                            onSelectLootPlayer={this.onSelectLootPlayer}
                        />
                    ))}
                </div>
                {this.state.lootPlayer ? (
                    <div className={style.popup}>
                        <LootPlayers loot={this.state.lootPlayer.loot} player={this.state.lootPlayer.player} />
                        <button className={style.popupClose} onClick={this.onClosePopup}>
                            Close
                        </button>
                    </div>
                ) : null}
            </div>
        );
    }
};

export default BossList;
