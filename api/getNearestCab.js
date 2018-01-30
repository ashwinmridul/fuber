function getNearestCab() {
    let nearestCab = null, leastDistance = null;
    let availableCabs = wantPink === false ? cabs. filter((cab) => {
        return cab.idle === true;
    }) : cabs.filter((cab) => {
        return cab.idle === true && cab.pink === true;
    });
    availableCabs.forEach(function(cab) {
        const latDiff = cab.lat - sourceLocation.lat, lngDiff = cab.lng - sourceLocation.lng;
        const distance = Math.sqrt((latDiff * latDiff) + (lngDiff * lngDiff));
        if (distance < maxDistance) {
            nearestCab = leastDistance === null ? cab : (distance < leastDistance ? cab : nearestCab);
            leastDistance = leastDistance === null ? distance : (distance < leastDistance ? distance : leastDistance);
        }
    });
    return nearestCab;
}

//Testing the function
const cabs = [{
    id: 1,
    lat: 2,
    lng: 2,
    pink: false,
    idle: true
}, {
    id: 2,
    lat: 4,
    lng: 3,
    pink: true,
    idle: true
}];
const wantPink = false;
const maxDistance = 5;
const sourceLocation = {
    lat: 3,
    lng: 3
};
// const destLocation = {
//     lat: 4,
//     lng: 4
// };
console.log(getNearestCab());