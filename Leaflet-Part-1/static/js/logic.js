// Create the Leaflet map
const map = L.map('map').setView([0, 0], 2);

// Add a base map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Function to determine marker size based on magnitude
function getMarkerSize(magnitude) {
  return magnitude * 4;
}

// Function to determine marker color based on depth
function getMarkerColor(depth) {
  if (depth < 10) return '#00FF00';        // Green
  if (depth < 30) return '#ADFF2F';        // Green Yellow
  if (depth < 50) return '#FFFF00';        // Yellow
  if (depth < 70) return '#FFD700';        // Dark Yellow
  if (depth < 90) return '#FF4500';        // Yellow Red
  return '#FF0000';                        // Red
}

// Function to create popups with earthquake information
function createPopup(feature, layer) {
  layer.bindPopup(`
    Magnitude: ${feature.properties.mag}<br>
    Depth: ${feature.geometry.coordinates[2]} km<br>
    Location: ${feature.properties.place}
  `);
}

// Legend control
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');

  const depthRanges = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
  const colors = ['#00FF00', '#ADFF2F', '#FFFF00', '#FFD700', '#FF4500', '#FF0000'];

  for (let i = 0; i < depthRanges.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      depthRanges[i] + '<br>';
  }
  return div;
};
legend.addTo(map);

// Fetch GeoJSON data using D3 and add markers to the map
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(data => {
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: getMarkerSize(feature.properties.mag),
        fillColor: getMarkerColor(feature.geometry.coordinates[2]),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.4,
      });
    },
    onEachFeature: createPopup,
  }).addTo(map);
});

