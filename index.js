const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

let routes = []; // In-memory storage for routes

// Handle image upload and processing
app.post('/upload', upload.single('image'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    // Here, you'd integrate your image processing to identify holds
    // For simplicity, we'll return the file path
    res.json({ message: 'Image uploaded successfully', filePath: `uploads/${file.filename}` });
});

// Save a new route
app.post('/routes', (req, res) => {
    const route = req.body;
    route.id = uuidv4();
    routes.push(route);
    res.status(201).json(route);
});

// Get all routes
app.get('/routes', (req, res) => {
    res.json(routes);
});

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(5000, () => {
    console.log('Server started on http://localhost:5000');
});
