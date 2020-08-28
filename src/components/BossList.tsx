import React from 'react';
import { Boss } from '../types'
import BossEntry from './BossEntry';

type BossListProps = { bosses: Boss[] };
type BossListState = { hideReceived: boolean };

class BossList extends React.Component<BossListProps, BossListState> {
    state: BossListState = {
        hideReceived: false,
    };

    
    render() {
        // const bosses = this.props.bosses.slice(-3);
        this.props.bosses.sort((a, b) => a.index - b.index);
        return (
            <div>
                <div>
                    <h1>Bosses AQ 40</h1>
                    <label style={{ cursor: "pointer" }}>
                        <input
                            type='checkbox'
                            style={{ marginRight: 5, cursor: "pointer" }}
                            onChange={() => this.setState({ hideReceived: !this.state.hideReceived })}
                        />
                        Hide received items
                    </label>
                </div>
                <div>
                    {this.props.bosses.map(boss => (
                        <BossEntry boss={boss} key={boss.name} hideReceived={this.state.hideReceived} />
                    ))}
                </div>
            </div>
        );
    }
};

export default BossList;
