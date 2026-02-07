import axios from 'axios';

const API_BASE = 'http://localhost:5000';

async function getAPOD() {
    const response  = await axios.get(`${API_BASE}/apod`);
    return response.data;
}

async function getNEO() {
    const response  = await axios.get(`${API_BASE}/neo`);
    return response.data;
}

async function getISSLocation() {
    const response = await axios.get(`${API_BASE}/api/iss`);
    return response.data;
}

async function getEarthEvents() {
    const response = await axios.get(`${API_BASE}/api/events`);
    return response.data;
}

export { getAPOD, getNEO, getISSLocation, getEarthEvents };