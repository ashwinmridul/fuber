const expect = require('chai').expect;
const getRideTimeByDistance = require("../api/getRideTimeByDistance");
const cabSpeed = require("../data/config.json").cabSpeed;

describe('getRideTimeByDistance', function() {
    it('get time by distance', function() {
        const distance = 100;
        const time = getRideTimeByDistance(distance);
        expect(time).not.be.undefined;
        expect(time).to.be.a('number');
        expect(time).to.equal(distance / cabSpeed * 3600000);
    });
});