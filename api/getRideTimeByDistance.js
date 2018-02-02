const cabSpeed = require("../data/config.json")["cabSpeed"];

const getRideTimeByDistance = function(distance) {
    return (distance / cabSpeed) * 3600000;
};

module.exports = getRideTimeByDistance;