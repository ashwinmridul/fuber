# fuber
----
## Development versions
* **node** - 7.7.2
* **npm** - 4.1.2

----
## Install dependencies
> npm install

----

## Run unit test cases
> npm test

Test cases are written only for node modules and not for the server application.

----
## Configurations
All configrations are done in `data/config.json`. Description of fields are:

* **maxDistance**: Maximum distance(in km) from pickup location to cab location for assigning cab.
* **cabSpeed**: Cab speed(in km/hr) in which it moves
* **kmPerDegree**: No. of kilometers per degree of latitude/longitude.

----

## Data
All the data of available cabs is read from `data/cabs.json` and updated into the same through code. It's like a local database.

You can add more cabs into this json file if you like.

## Run server
> npm start

Server should be up and running on port `3000`. If you want to run through a different port, set environment variable `PORT` to the corresponding port number.

----
Open `http://localhost:3000/findCab/:sourceLat/:sourceLng/:destLat/:destLng/:wantPink` in your browser to execute the code.

* **sourceLat**: Latitude of pickup location
* **sourceLng**: Longitude of pickup location
* **destLat**: Latitude of drop location
* **destLng**: Longitude of drop location
* **wantPink**: Want a pink cab (`true` or `false`)