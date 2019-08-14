import React from 'react';

class Delayed extends React.Component {
    static timeout = null;

    constructor(props) {
        super(props);
        this.state = { hidden : true };
    }

    componentDidMount() {
        this.timeout = setTimeout(() => {
            this.setState({ hidden: false });
        }, this.props.delay || 0);
    }

    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    render() {
        return this.state.hidden ? '' : this.props.children;
    }
};

export default Delayed;