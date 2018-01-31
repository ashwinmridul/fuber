const moveCabForTime = async function(time) {
    return new Promise(r => setTimeout(r, time));
};

module.exports = moveCabForTime;