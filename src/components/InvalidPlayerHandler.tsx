import React from 'react';
import { Redirect } from 'react-router-dom';

type InvalidPlayerHandlerProps = {
    path: string,
}

type InvalidPlayerHandlerState = {
    hasError: boolean,
}

class InvalidPlayerHandler extends React.Component<InvalidPlayerHandlerProps, InvalidPlayerHandlerState> {
    constructor(props: InvalidPlayerHandlerProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <Redirect to={this.props.path} />;
        }

        return this.props.children;
    }
}

export default InvalidPlayerHandler;
