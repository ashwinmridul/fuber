import path from 'path';
import { Server } from 'http';
import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import PickupArrived from "./components/PickupArrived";
import Assigned from "./components/Assigned";
import stream from "express-stream";

// initialize the server and configure support for ejs templates
const app = new Express();
const server = new Server(app);

// Set the view engine
app.set('view engine', "ejs");
app.set('views', path.join(__dirname, 'views'));

app.get("/", stream.pipe(), ((req, res) => {
    let markup;
    markup = renderToString(<Assigned/>);
    res.stream('index', { markup });
    setTimeout(() => {
        markup = renderToString(<PickupArrived/>);
        res.stream('index', { markup });
        setTimeout(() => {
            res.close();
        }, 10000);
        // res.end();
        // res.end();
    }, 10000);
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