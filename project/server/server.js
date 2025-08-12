const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Your GeoJSON data
const geoJsonData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [75.53141234913238, 30.43075433337765, 0]
      },
      "properties": {
        "name": "A",
        "marker-color": "rgba(211,49,21,1)"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [75.56478115776582, 30.431077250752637, 0]
      },
      "properties": {
        "name": "B",
        "marker-color": "rgba(251,158,0,1)"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [75.54586842111092, 30.4124754674621, 0]
      },
      "properties": {
        "name": "C",
        "marker-color": "rgba(0,98,177,1)"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [75.53144980009654, 30.43088350045602, 0],
          [75.56478115776582, 30.431238709039803, 0],
          [75.56478115776582, 30.431238709039803, 0]
        ]
      },
      "properties": {
        "name": "Line 1",
        "stroke": "rgba(255,99,72,1)",
        "stroke-opacity": 1,
        "stroke-width": 5
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [75.56481860872867, 30.431141834099705, 0],
          [75.54586842111092, 30.412604658740136, 0]
        ]
      },
      "properties": {
        "name": "Line 2",
        "stroke": "rgba(0,156,224,1)",
        "stroke-opacity": 1,
        "stroke-width": 5
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [75.53133744720535, 30.43088350045602, 0],
          [75.54575606821965, 30.412636956532765, 0]
        ]
      },
      "properties": {
        "name": "Line 3",
        "stroke": "rgba(104,188,0,1)",
        "stroke-opacity": 1,
        "stroke-width": 5
      }
    }
  ]
};

// API endpoint to serve GeoJSON data
app.get('/api/geojson', (req, res) => {
  res.json(geoJsonData);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`GeoJSON endpoint: http://localhost:${PORT}/api/geojson`);
});