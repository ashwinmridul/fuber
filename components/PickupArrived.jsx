import React from 'react';
import prettyMs from "pretty-ms";

export default class PickupArrived extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <div>
                <div>Pickup Arrived</div>
                <div>Cab moving to your drop location</div>
                <div>Time to reach destination: {prettyMs(this.props.time)}</div>
            </div>
        );
    }
}