import React from 'react';
import { Link } from 'react-router-dom';
import { PlayerItemEntry, EntryScore, Player } from '../types'
import PlayerName from './PlayerName';
import style from './DropRowPlayer.module.css'

type DropRowPlayerProps = {
    playerEntry: PlayerItemEntry,
    player: Player,
    scores: EntryScore,
    masterlooter: boolean,
    onSelectLootPlayer: (y: Player) => void,
};
type DropRowPlayerState = { showTooltip: boolean }
class DropRowPlayer extends React.Component<DropRowPlayerProps, DropRowPlayerState> {
    state: DropRowPlayerState = {
        showTooltip: false,
    };

    constructor(props: DropRowPlayerProps) {
        super(props);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    onMouseEnter() {
        this.setState({showTooltip: true});
    }

    onMouseLeave() {
        this.setState({showTooltip: false});
    }

    render() {
        const { playerEntry, player, scores } = this.props;
        return (
            <>
                <div
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                    className={[style.wrap, (playerEntry.received ? style.wrapReceived : '')].join(' ')}
                >
                    <div className={style.score}>
                        {scores.total}
                    </div>
                    <div className={style.name}>
                        {this.props.masterlooter ? (
                            <button className={style.playerButton} onClick={() => this.props.onSelectLootPlayer(player)}>
                                <PlayerName player={player} />
                            </button>
                        ) : (
                            <Link to={`/players/${player.name}`} style={{ textDecoration: 'none' }}>
                                <PlayerName player={player} />
                            </Link>
                        )}
                    </div>
                    {this.state.showTooltip && (
                        <div className={style.tooltip}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td style={{ textAlign: 'right', paddingRight: 5 }}>{scores.base}</td>
                                        <td>Weight</td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: 'right', paddingRight: 5 }}>{scores.position}</td>
                                        <td>Position bonus</td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: 'right', paddingRight: 5 }}>{scores.item}</td>
                                        <td>Item bonus</td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: 'right', paddingRight: 5 }}>{scores.attendance}</td>
                                        <td>Attendance bonus</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </>
        );
    }
}

export default DropRowPlayer;
