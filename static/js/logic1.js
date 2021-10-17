// Create the map object
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 10
});

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the geoJSON data.
var geoData = "https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/ca_california_zip_codes_geo.min.json"
// var geoData = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/15-Mapping-Web/Median_Household_Income_2016.geojson";

var geojson;

// Get the geoJSON and database data with d3.
d3.json(geoData).then(function(data) {
  // console.log(data);
  d3.json("http://127.0.0.1:5000/altbyzip").then(function(altbyzip) {
    for (let i = 0; i < data["features"].length; i++) {
      let currentZip = parseInt(data["features"][i]["properties"]["ZCTA5CE10"])

      // Update geoJSON properties with additional vehiclecount property
      // If database does not have a corresponding vehicle count for the zip, skip the assignment
      if (altbyzip.hasOwnProperty([currentZip])) {
        data["features"][i]["properties"]["vehiclecount"] = altbyzip[currentZip]["sum"];
      } else {
        console.log(`No vehicle count for zip code ${currentZip}`)
      }
    }

    // Create a new choropleth layer
    geojson = L.choropleth(data, {

    // Define which property in the features to use.
    valueProperty: "vehiclecount",

    // Set the color scale
    scale: ["lightgreen", "green"],

    // The number of breaks in the step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 0.7,
      fillOpacity: 0.8
    },

    // Binding a popup to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Zip Code: " + feature.properties.ZCTA5CE10 + "<br><br>" +
        "vehicles: " + feature.properties.vehiclecount);
    }
  }).addTo(myMap);

  // Set up the legend
  var legend = L.control({ position: "bottomleft" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add the minimum and maximum to the legend
    var legendInfo = "<h1>County Vehicle Quantity</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Add the legend to the map
  legend.addTo(myMap);
  })

});
