import React from 'react';
import prettyMs from "pretty-ms";

export default class Assigned extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <div>
                <div>Cab assigned</div>
                <div>Cab moving to your pickup location</div>
                <div>Time to pickup: {prettyMs(this.props.time)}</div>
            </div>
        );
    }
}