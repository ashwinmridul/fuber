const expect = require('chai').expect;
const calculateDistance = require("../api/calculateDistance");
const kmPerDegree = require("../data/config.json").kmPerDegree;

describe('calculateDistance', function() {
    it('calculate distance', function() {
        const distance = calculateDistance({lat: 0, lng: 0}, {lat: 0.1, lng: 0.1});
        expect(distance).not.be.undefined;
        expect(distance).to.be.a('number');
    });
});