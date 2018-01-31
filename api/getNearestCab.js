const cabs = require("../data/cabs.json")["data"];
const maxDistance = require("../data/config.json")["maxDistance"];
const calculateDistance = require("./calculateDistance");

let getNearestCab = function(wantPink, sourceLocation) {
    let nearestCab = null, leastDistance = null;
    let availableCabs = wantPink === false ? cabs. filter((cab) => {
        return cab.idle === true;
    }) : cabs.filter((cab) => {
        return cab.idle === true && cab.pink === true;
    });
    availableCabs.forEach(function(cab) {
        const distance = calculateDistance(cab, sourceLocation);
        if (distance < maxDistance) {
            nearestCab = leastDistance === null ? cab : (distance < leastDistance ? cab : nearestCab);
            leastDistance = leastDistance === null ? distance : (distance < leastDistance ? distance : leastDistance);
        }
    });
    return nearestCab !== null ? {id: nearestCab.id, distanceToPickup: leastDistance} : nearestCab;
};

module.exports = getNearestCab;