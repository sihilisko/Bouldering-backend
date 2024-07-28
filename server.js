const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for port if available

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'images')));

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../bouldering-frontend/build')));

app.get('/routes-list', (req, res) => {
  fs.readFile(path.join(__dirname, 'routes/routes.json'), (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read routes data' });
    }
    res.json(JSON.parse(data));
  });
});

app.get('/images-list', (req, res) => {
  fs.readdir(path.join(__dirname, 'images'), (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read images directory' });
    }
    res.json(files);
  });
});

app.post('/save-route', (req, res) => {
  const newRoute = req.body;

  fs.readFile(path.join(__dirname, 'routes/routes.json'), (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read routes data' });
    }

    const routes = JSON.parse(data);
    routes.push(newRoute);

    fs.writeFile(path.join(__dirname, 'routes/routes.json'), JSON.stringify(routes, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to save route' });
      }
      res.json({ message: 'Route saved successfully' });
    });
  });
});

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../bouldering-frontend/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
