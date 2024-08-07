const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define a simple schema and model for Routes
const routeSchema = new mongoose.Schema({
  name: String,
  difficulty: String,
  image: String,
  holds: Array
});

const Route = mongoose.model('Route', routeSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.get('/routes-list', async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

app.post('/save-route', async (req, res) => {
  try {
    const newRoute = new Route(req.body);
    await newRoute.save();
    res.status(201).json(newRoute);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save route' });
  }
});

app.use(express.static(path.join(__dirname, 'build'))); // Serve static files
app.get('*', (req, res) => {  // This ensures that the React SPA paths are handled correctly by serving index.html
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
