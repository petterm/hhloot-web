import React from 'react';
import { Navigate } from 'react-router-dom';

type InvalidPlayerHandlerProps = {
    path: string,
    children?: React.ReactNode,
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
            return <Navigate to={this.props.path} />;
        }

        return this.props.children;
    }
}

export default InvalidPlayerHandler;
