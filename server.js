const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');

const app = express();

// Connect to PostgreSQL Database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Ensure this environment variable is set in Render
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'images'))); // Serves images from the images directory

// Get all routes from PostgreSQL
app.get('/routes-list', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM routes');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve routes' });
    }
});

// Save a new route to PostgreSQL
app.post('/save-route', async (req, res) => {
    const { name, difficulty, image, holds } = req.body;
    try {
        const { rows } = await pool.query('INSERT INTO routes (name, difficulty, image, holds) VALUES ($1, $2, $3, $4) RETURNING *', [name, difficulty, image, JSON.stringify(holds)]);
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save route' });
    }
});

// Get list of images
app.get('/images-list', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT filename FROM images'); // Assuming there is a table for images
        res.json(rows.map(row => row.filename));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read images directory' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
