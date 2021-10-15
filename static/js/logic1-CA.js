// Initialization function (put into its own .js)
function init() {
  let caVehicleFile = "static/data/vehicle-count-as-of-1-1-2020.csv"
  const vehicleZip = d3.csv(caVehicleFile);
  vehicleZip.then(function(myData) {
    console.log(myData[0]);
    console.log(myData);
  });
}

// Creating the map object
var myMap = L.map("map", {
  // center: [40.7128, -74.0059],  // NYC
  // zoom: 11
  // center: [36.778259, -119.417931],   // California
  // zoom: 6
  center: [34.052235, -118.243683],  // Los Angeles
  zoom: 10
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
// var link = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/15-Mapping-Web/nyc.geojson";
// var link = "https://github.com/OpenDataDE/State-zip-code-GeoJSON/blob/4cc2657044efd08477465aed1912dca30198d441/ca_california_zip_codes_geo.min.json"
// var link = "https://github.com/OpenDataDE/State-zip-code-GeoJSON/ca_california_zip_codes_geo.min.json"
var link = "static/data/ca_california_zip_codes_geo.min.json"
// Within the geoJSON file, the property for zip: "ZCTA5CE10":"94580"

// {"type":"FeatureCollection",
//  "features":[{"type":"Feature",
//               "properties":{"STATEFP10":"06",
//                             "ZCTA5CE10":"94601",
//                             "GEOID10":"0694601",
//                             "INTPTLAT10":"+37.7755447",
//                             "INTPTLON10":"-122.2187049","PARTFLG10":"N"},
//                 "geometry":{"type":"Polygon",
//                             "coordinates":[[[-122.227171,37.791969],[

// The function that will determine the color of a neighborhood based on the borough that it belongs to
function chooseZip(zipCode) {
  if (zipCode > "95000") return "yellow";
  else if (zipCode > "94000") return "red";
  else if (zipCode > "93000") return "orange";
  else if (zipCode > "92000") return "green";
  else if (zipCode > "90099") return "purple";
  else return "blue";
}

// Getting our GeoJSON data (pt1)
// d3.json(link).then(function(data) {
//   console.log(data);
//   // Creating a GeoJSON layer with the retrieved data
//   L.geoJson(data).addTo(myMap);
// });

// Getting our GeoJSON data (pt2)
d3.json(link).then(function(data) {
  console.log(data);
  // Creating a GeoJSON layer with the retrieved data
  L.geoJson(data, {
    style: function(feature) {
      return {
        color: "white",
        fillColor: chooseZip(feature.properties.ZCTA5CE10),
        fillOpacity: 0.5,
        weight: 0.7
      };
    },
    // Feature enhancement section
    onEachFeature: function(feature, layer) {
      // Set the mouse events to change the map styling.
      layer.on({
        // When mouse cursor touches a map feature, set opacity to 90%.
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When cursor no longer hovers over a map feature, revert opacity to 50%
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
    //     // When a feature is clicked, enlarge to fit the screen.
    //     click: function(event) {
    //       myMap.fitBounds(event.target.getBounds());
    //     }
      });
      
      // popup with relevant information
      layer.bindPopup("<h1>" + feature.properties.ZCTA5CE10 + "</h1> <hr> <h2>" + feature.properties.ZCTA5CE10 + "</h2>");

    }
  }).addTo(myMap);
});

init();