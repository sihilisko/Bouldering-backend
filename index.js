const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Configuration for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

let routes = []; // In-memory storage for routes

// Handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    // Typically, image processing logic would be placed here.
    // For simplicity, returning the file path where the image is stored
    res.json({ message: 'Image uploaded successfully', filePath: `uploads/${file.filename}` });
});

// Save a new climbing route
app.post('/routes', (req, res) => {
    const route = req.body;
    route.id = uuidv4(); // Assign a unique identifier to each route
    routes.push(route);
    res.status(201).json(route);
});

// Retrieve all routes
app.get('/routes', (req, res) => {
    res.json(routes);
});

// Serve images from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Listening on all network interfaces
const PORT = process.env.PORT || 5000; // Use the environment variable for port, if available
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
