import React from 'react';

export default class NoCabs extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (
            <div>
                <div>Sorry! No free cabs around your location</div>
            </div>
        );
    }
}