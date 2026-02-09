require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { getAPOD, getNEO, getISSLocation, getEarthEvents } = require('./services/nasaServices');
const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Nasa Dashboard is running!' });
});

app.get('/hello', (req, res) => {
    res.json({ message: 'Hello from NASA Dashboard!' });
});

app.get('/info', (req, res) => {
    res.json({ 
        project: 'NASA Dashboard',
        version: '1.0.0'
    });
});


app.get('/apod', async (req, res) => {
    try {
        const data = await getAPOD();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch APOD data' });
    }
});

app.get('/neo', async (req, res) => {
    try {
        const data = await getNEO();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/iss', async (req, res) => {
    try {
        const data = await getISSLocation();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/events', async (req, res) => {
    try {
        const data = await getEarthEvents();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: 'Something went wrong!'});
});

app.listen(PORT, () => {
    console.log(`NASA Dashboard API running on port ${PORT}`);
})

