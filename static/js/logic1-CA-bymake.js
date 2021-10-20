// Create the map object
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 10
});

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Prepare to load the geoJSON data.
var geoData = "https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/ca_california_zip_codes_geo.min.json"
// var geoData = "/static/data/ca_california_zip_codes_geo.min.json"

var geojson;

// Current Make placeholder
var chosenMake = "TESLA";

var myDict = {};

// Get the geoJSON Zip Code/properties/geometry data using d3.
d3.json(geoData).then(function(data) {

  // Create a zip code object from database containing all car makes
  // and their registered vehicle counts per zip code.  For use on geoJSON file properties
  d3.json("http://127.0.0.1:5000/altbyzipmake").then(function(altbyzipmake) {

    // Populate the array with the zip keys of each available zip code.
    // If zip code key already exists, add object to existing key.
    // if key doesn't exist, initiate the first key.
    for (var j = 0; j < altbyzipmake.length; j++) {
      var localMake = altbyzipmake[j].make;
      var localSum  = altbyzipmake[j].sum;
      var localZip  = altbyzipmake[j].zip_code;

      if (Object.keys(myDict).includes(localZip)) {
        myDict[localZip][localMake] = localSum;
      } else {
        myDict[localZip] = {
          [localMake]: localSum
        };
      }

    }
    console.log(myDict);
  

    // Insert zip code object into the corresponding properties section of geoJSON file
    //  for every car maker brand and the vehicle counts for each zip code
    for (let i = 0; i < data["features"].length; i++) {
      let currentZip = parseInt(data["features"][i]["properties"]["ZCTA5CE10"]);
      // let currentZip = data["features"][i]["properties"]["ZCTA5CE10"];

      // Update geoJSON properties with additional vehiclecount property
      // If database does not have a corresponding vehicle count for the zip, set to zero
      if (myDict.hasOwnProperty([currentZip])) {
        data["features"][i]["properties"]["vehiclecount"] = myDict[currentZip];
      } else {
        data["features"][i]["properties"]["vehiclecount"] = 0;
        console.log(`Info: No count reported for zip ${currentZip}`)
        console.log(myDict[currentZip]);
      }
      // console.log(data);
    }

    console.log(data);

    // Create a new choropleth layer
    geojson = L.choropleth(data, {

      // Define which property in the features to use.
      valueProperty: function (feature) {
        return feature.properties.vehiclecount[chosenMake]
      },

      // Set color scale; orange points out near-zero and contrasts with green
      scale: ["orange", "yellow", "darkgreen"],
      
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

      // Bind a popup to each layer, highlight when selected
      onEachFeature: function(feature, layer) {
        layer.bindPopup("Zip Code: " + feature.properties.ZCTA5CE10 + "<br>" +
          "make: " + chosenMake + "<br>" +
          "vehicles: " + feature.properties.vehiclecount[chosenMake]
        );
        
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

  });

});
