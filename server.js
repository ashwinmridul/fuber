// Installed packages
import path from 'path';
import { Server } from 'http';
import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import stream from "express-stream";
import updateJsonFile from "update-json-file";

// React components
import PickupArrived from "./components/PickupArrived";
import Assigned from "./components/Assigned";
import RideCompleted from "./components/RideCompleted";
import NoCabs from "./components/NoCabs";

// Local APIs
const getNearestCab = require("./api/getNearestCab");
const moveCabForTime = require("./api/moveCabForTime");
const calculateDistance = require("./api/calculateDistance");
const getRideTimeByDistance = require("./api/getRideTimeByDistance");
const calculateFareForRide = require("./api/calculateFareForRide");

// List of cabs json
const filePath = './data/cabs.json';
let cabs = require(filePath)["data"];

// initialize the server and configure support for ejs templates
const app = new Express();
const server = new Server(app);

// Set the view engine
app.set('view engine', "ejs");
app.set('views', path.join(__dirname, 'views'));

// API to find idle cab
app.get("/findCab/:sourceLat/:sourceLng/:destLat/:destLng/:wantPink", stream.pipe(), ( async function (req, res) {
    // Parameter validation
    const sourceLat = Number(req.params.sourceLat);
    if (isNaN(sourceLat)) {
        throw new Error("Source latitude must be a number");
    }
    const sourceLng = Number(req.params.sourceLng);
    if (isNaN(sourceLng)) {
        throw new Error("Source longitude must be a number");
    }
    const destLat = Number(req.params.destLat);
    if (isNaN(destLat)) {
        throw new Error("Destination latitude must be a number");
    }
    const destLng = Number(req.params.destLng);
    if (isNaN(destLng)) {
        throw new Error("Destination longitude must be a number");
    }
    let wantPink;
    try {
        wantPink = JSON.parse(req.params.wantPink);
    } catch (e) {
        throw new Error("wantPink should be a boolean");
    }

    if (typeof wantPink !== "boolean") {
        throw new Error("wantPink should be a boolean");
    }

    // Prepare location objects
    const sourceLocation = {lat: sourceLat, lng: sourceLng};
    const destLocation = {lat: destLat, lng: destLng};

    // Get the nearest available cab
    const nearestCab = getNearestCab(wantPink, sourceLocation);
    if (nearestCab !== null) {
        // If cab available
        cabs.forEach((cab) => {
            if (cab.id === nearestCab.id) {
                cab.idle = false; // Unset this cab from idle so that it doesn't get assigned to someone else
            }
        });
        // Update the json file
        updateJsonFile(filePath, (data) => {
            data.data = cabs;
            return data;
        });
        // Wait for time till cab arrives to pickup location
        let markup;
        const pickupTime = getRideTimeByDistance(nearestCab.distanceToPickup);
        markup = renderToString(<Assigned time={pickupTime}/>);
        res.stream('index', { markup });
        await moveCabForTime(pickupTime);
        // Start the ride and wait for cab to reach the drop location
        const commuteDistance = calculateDistance(sourceLocation, destLocation);
        const rideTime = getRideTimeByDistance(commuteDistance);
        markup = renderToString(<PickupArrived time={rideTime}/>);
        res.stream('index', { markup });
        await moveCabForTime(rideTime);
        // Calculate ride fare
        const rideFare = calculateFareForRide(commuteDistance, rideTime, wantPink);
        cabs.forEach((cab) => {
            if (cab.id === nearestCab.id) {
                // Update the json file with cab's new location and status to idle so that new customer can access it.
                cab.idle = true;
                cab.lat = destLocation.lat;
                cab.lng = destLocation.lng;
            }
        });
        // Update the json file
        updateJsonFile(filePath, (data) => {
            data.data = cabs;
            return data;
        });
        // Show ride completed message on UI with total fare
        markup = renderToString(<RideCompleted rideFare={rideFare}/>);
        res.stream('index', { markup });
        res.close();
    } else {
        // If cab not available
        let markup = renderToString(<NoCabs/>);
        res.stream('index', { markup });
    }
}));

// Start the server
const port = process.env.PORT || 3000;
server.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    console.info(`Server running on http://localhost:${port}`);
});
global.navigator = { userAgent: 'all' };