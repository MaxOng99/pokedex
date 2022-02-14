import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true};
    }
  
    render() {
        if (this.state.hasError) {
            return <h3 style={ {textAlign: "center"} }>Pokemon not found in database. Search for another pokemon</h3>;
        }
        return this.props.children
    }
}

export { ErrorBoundary };