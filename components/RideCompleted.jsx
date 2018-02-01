import React from 'react';

export default class RideCompleted extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <div>
                <div>Ride Completed. Thank you. Total fare: <b>{this.props.rideFare}</b> dogecoin</div>
            </div>
        );
    }
}