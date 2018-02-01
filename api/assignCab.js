const getNearestCab = require("./getNearestCab");
const moveCabForTime = require("./moveCabForTime");
const updateJsonFile = require('update-json-file');
const calculateDistance = require("./calculateDistance");
const cabSpeed = require("../data/config.json")["cabSpeed"];
const filePath = '../data/cabs.json';
let cabs = require(filePath)["data"];

let assignCab = async function () {
    const nearestCab = getNearestCab(wantPink, sourceLocation);
    if (nearestCab !== null) {
        cabs.forEach((cab) => {
            if (cab.id === nearestCab.id) {
                cab.idle = false;
            }
        });
        updateJsonFile(filePath, (data) => {
            data.data = cabs;
            return data;
        });
        console.log("Cab assigned");
        console.log("Cab moving to your pickup location");
        const pickupTime = (nearestCab.distanceToPickup/cabSpeed) * 3600000;
        await moveCabForTime(pickupTime);
        console.log("Cab reached pickup location");
        const commuteDistance = calculateDistance(sourceLocation, destLocation);
        console.log("Ride started. Enjoy!!");
        const rideTime = (commuteDistance/cabSpeed) * 3600000;
        await moveCabForTime(rideTime);
        const rideFare = Math.ceil(commuteDistance) * 2 + Math.ceil(rideTime / 60000) + (wantPink ? 5 : 0);
        cabs.forEach((cab) => {
            if (cab.id === nearestCab.id) {
                cab.idle = true;
                cab.lat = destLocation.lat;
                cab.lng = destLocation.lng;
            }
        });
        updateJsonFile(filePath, (data) => {
            data.data = cabs;
            return data;
        });
        console.log(`Ride Completed. Thank you. Total fare: ${rideFare}`);
    } else {
        console.error("Sorry! No free cabs around your location");
    }
};

// Testing the function
const wantPink = true;
const sourceLocation = {
    lat: 2,
    lng: 2.002
};
const destLocation = {
    lat: 2.002,
    lng: 2
};
assignCab();