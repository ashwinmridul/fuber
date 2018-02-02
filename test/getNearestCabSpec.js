const expect = require('chai').expect;
const proxyquire = require("proxyquire");
const getNearestCab = proxyquire("../api/getNearestCab",
    { '../data/cabs.json': require('./jsonSpec/cabsSpec.json')});

describe('getNearestCab', function() {

    it('get nearest cab', function() {
        const nearestCab = getNearestCab(false, {lat: 2, lng: 2.002});
        expect(nearestCab).to.be.an('object');
        expect(nearestCab.id).not.be.undefined;
        expect(nearestCab.id).to.be.a('number');
        expect(nearestCab.id).to.equal(2);
        expect(nearestCab.distanceToPickup).not.be.undefined;
    });

    it('failed to get nearest cab', function() {
        const nearestCab = getNearestCab(false, {lat: 32, lng: 2.002});
        expect(nearestCab).to.be.null;
    });

    it('get pink cab', function() {
        const nearestCab = getNearestCab(true, {lat: 2, lng: 2.002});
        expect(nearestCab).to.be.an('object');
        expect(nearestCab.id).not.be.undefined;
        expect(nearestCab.id).to.be.a('number');
        expect(nearestCab.id).to.equal(3);
        expect(nearestCab.distanceToPickup).not.be.undefined;
    });

});