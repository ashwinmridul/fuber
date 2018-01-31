const kmPerDegree = require("../data/config.json")["kmPerDegree"];

const calculateDistance = function(source, destination) {
    const latDiff = destination.lat - source.lat, lngDiff = destination.lng - source.lng;
    return Math.sqrt((latDiff * latDiff) + (lngDiff * lngDiff)) * kmPerDegree;
};

module.exports = calculateDistance;