const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Endpoint to list all routes
app.get('/routes-list', (req, res) => {
    const routesPath = path.join(__dirname, 'routes', 'routes.json');
    console.log(`Attempting to read routes from: ${routesPath}`);
    
    fs.readFile(routesPath, (err, data) => {
        if (err) {
            console.error('Error reading routes data:', err);
            return res.status(500).json({ error: 'Failed to read routes data' });
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to list all images
app.get('/images-list', (req, res) => {
    const imagesDir = path.join(__dirname, 'images');
    console.log(`Attempting to read images from directory: ${imagesDir}`);
    
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error('Error reading images directory:', err);
            return res.status(500).json({ error: 'Failed to read images directory' });
        }
        res.json(files);
    });
});

// Endpoint to save a new route
app.post('/save-route', (req, res) => {
    const routesPath = path.join(__dirname, 'routes', 'routes.json');
    console.log(`Attempting to save a route to: ${routesPath}`);
    
    const newRoute = req.body;
    fs.readFile(routesPath, (err, data) => {
        if (err) {
            console.error('Error reading routes data:', err);
            return res.status(500).json({ error: 'Failed to read routes data' });
        }

        const routes = JSON.parse(data);
        routes.push(newRoute);

        fs.writeFile(routesPath, JSON.stringify(routes, null, 2), (err) => {
            if (err) {
                console.error('Error saving new route:', err);
                return res.status(500).json({ error: 'Failed to save route' });
            }
            res.json({ message: 'Route saved successfully' });
        });
    });
});

// Serve frontend index.html for all other routes
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, '..', 'bouldering-frontend', 'build', 'index.html');
    console.log(`Serving frontend index from: ${indexPath}`);
    
    res.sendFile(indexPath);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
