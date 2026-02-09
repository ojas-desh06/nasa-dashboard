const axios = require('axios');

const API_KEY = process.env.NASA_API_KEY;

async function getAPOD(count = 5) {
    const response = await axios.get('https://api.nasa.gov/planetary/apod', {
        params: {
            api_key: API_KEY,   
            count: count
        }
    });
    return response.data;
}

async function getNEO() {
    const today = new Date().toISOString().split('T')[0];
    const response = await axios.get('https://api.nasa.gov/neo/rest/v1/feed', {
        params: {
            api_key: API_KEY,
            start_date: today,
            end_date: today
        }
    }); 
    return response.data;
}

async function getISSLocation() {
    try {
        const response = await axios.get('http://api.open-notify.org/iss-now.json');
        return response.data;
    } catch (error) {
        throw new Error(`ISS location API error: ${error.message}`);
    }
}

async function getEarthEvents() {
    try {
        const response = await axios.get('https://eonet.gsfc.nasa.gov/api/v3/events', {
            params: {
                limit: 10,
                status: 'open'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(`Earth Events API error: ${error.message}`);
    }
}
module.exports = { getAPOD, getNEO, getISSLocation, getEarthEvents };