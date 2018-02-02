const expect = require('chai').expect;
const calculateFareForRide = require("../api/calculateFareForRide");
const cabSpeed = require("../data/config.json").cabSpeed;

describe('calculateFareForRide', function() {
    it('get fare for ride', function() {
        const fare = calculateFareForRide(100, 120000, false);
        expect(fare).not.be.undefined;
        expect(fare).to.be.a('number');
        expect(fare).to.equal(202);
    });

    it('get fare for pink ride', function() {
        const fare = calculateFareForRide(100, 120000, true);
        expect(fare).not.be.undefined;
        expect(fare).to.be.a('number');
        expect(fare).to.equal(207);
    });
});