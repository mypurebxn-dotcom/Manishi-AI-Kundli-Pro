'use strict';

function parseCoordinates(latStr, lonStr) {
    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);
    
    if (isNaN(lat) || lat < -90 || lat > 90) {
        throw new Error("Invalid Latitude constraint: Must be between -90 and 90");
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
        throw new Error("Invalid Longitude constraint: Must be between -180 and 180");
    }
    
    return { lat, lon };
}

module.exports = { parseCoordinates };
