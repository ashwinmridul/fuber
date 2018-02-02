const calculateFareForRide = function(commuteDistance, rideTime, isPink) {
    return Math.ceil(commuteDistance) * 2 + Math.ceil(rideTime / 60000) + (isPink ? 5 : 0);
};

module.exports = calculateFareForRide;