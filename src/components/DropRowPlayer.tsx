import React from 'react';
import { PlayerItemEntry, EntryScore, Player } from '../types'
import { Link } from 'react-router-dom';
import PlayerName from './PlayerName';

type DropRowPlayerProps = { playerEntry: PlayerItemEntry, player: Player, scores: EntryScore };
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
                    style={{ position: 'relative', display: 'flex', marginRight: 5, backgroundColor: playerEntry.received ? '#1d3d1d' : 'none' }}
                >
                    <div style={{
                        marginRight: 5,
                        padding: '0 5px',
                        width: 27,
                        textAlign: 'right',
                    }}>
                        {scores.total}
                    </div>
                    <div style={{ width: 90, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Link to={`/players/${player.name}`} style={{ textDecoration: 'none' }}>
                            <PlayerName player={player} />
                        </Link>
                    </div>
                    {this.state.showTooltip && (
                        <div style={{ position: "absolute", top: 25, backgroundColor: 'rgba(255, 255, 255, .9)', borderRadius: 5, padding: '5px 8px', color: '#333', zIndex: 2 }}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td style={{ textAlign: 'right', paddingRight: 5 }}>{scores.base}</td>
                                        <td>Weight</td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: 'right', paddingRight: 5 }}>{scores.position}</td>
                                        <td>Position</td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: 'right', paddingRight: 5 }}>{scores.item}</td>
                                        <td>Item</td>
                                    </tr>
                                    <tr>
                                        <td style={{ textAlign: 'right', paddingRight: 5 }}>{scores.attendance}</td>
                                        <td>Attendance</td>
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
