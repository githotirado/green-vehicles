// Create a map object.
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
// Add a tile layer.
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

// Add markers and PopUp
d3.csv("concap.csv", function(data) {
    // console.log([data]);
    // console.log(`Latitude ${data.CapitalLatitude}, Longitude ${data.CapitalLongitude}`)
    L.marker([data['CapitalLatitude'], data['CapitalLongitude']])
    .bindPopup(`<h1>Country: ${data.CountryName}</h1> <hr> <h3>Capital: ${data.CapitalName}</h3>`)
    .addTo(myMap);
});

 
  