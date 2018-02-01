import path from 'path';
import { Server } from 'http';
import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import PickupArrived from "./components/PickupArrived";
import Assigned from "./components/Assigned";
import stream from "express-stream";
import NoCabs from "./components/NoCabs";
import RideCompleted from "./components/RideCompleted";

const getNearestCab = require("./api/getNearestCab");
const moveCabForTime = require("./api/moveCabForTime");
const updateJsonFile = require('update-json-file');
const calculateDistance = require("./api/calculateDistance");
const cabSpeed = require("./data/config.json")["cabSpeed"];
const filePath = './data/cabs.json';
let cabs = require(filePath)["data"];

// initialize the server and configure support for ejs templates
const app = new Express();
const server = new Server(app);

// Set the view engine
app.set('view engine', "ejs");
app.set('views', path.join(__dirname, 'views'));

app.get("/findCab/:sourceLat/:sourceLng/:destLat/:destLng/:wantPink", stream.pipe(), ( async function (req, res){
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

    const sourceLocation = {lat: sourceLat, lng: sourceLng};
    const destLocation = {lat: destLat, lng: destLng};

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
        let markup;
        const pickupTime = (nearestCab.distanceToPickup / cabSpeed) * 3600000;
        markup = renderToString(<Assigned time={pickupTime}/>);
        res.stream('index', { markup });
        await moveCabForTime(pickupTime);
        const commuteDistance = calculateDistance(sourceLocation, destLocation);
        const rideTime = (commuteDistance / cabSpeed) * 3600000;
        markup = renderToString(<PickupArrived time={rideTime}/>);
        res.stream('index', { markup });
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
        markup = renderToString(<RideCompleted rideFare={rideFare}/>);
        res.stream('index', { markup });
        res.close();
    } else {
        let markup = renderToString(<NoCabs/>);
        res.stream('index', { markup });
    }
}));

// start the server
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'production';
server.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    console.info(`Server running on http://localhost:${port} [${env}]`);
});
global.navigator = { userAgent: 'all' };