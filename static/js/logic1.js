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
// var geoData = "/static/data/ca_california_zip_codes_geo.min.json"

var geojson;

// Get the geoJSON and database vehicle data using d3.
d3.json(geoData).then(function(data) {
  // console.log(data);
  d3.json("http://127.0.0.1:5000/altbyzip").then(function(altbyzip) {
    // console.log(`geoData length ${data["features"].length}`);
    // console.log(`database zips length ${altbyzip.length}`);

    for (let i = 0; i < data["features"].length; i++) {
      let currentZip = parseInt(data["features"][i]["properties"]["ZCTA5CE10"]);

      // Update geoJSON properties with additional vehiclecount property
      // If database does not have a corresponding vehicle count for the zip, skip the assignment
      if (altbyzip.hasOwnProperty([currentZip])) {
        data["features"][i]["properties"]["vehiclecount"] = altbyzip[currentZip]["sum"];
      } else {
        console.log(`No vehicle count for zip code ${currentZip}`)
      }
    }

    // console.log(data);

    // Create a new choropleth layer
    geojson = L.choropleth(data, {

    // Define which property in the features to use.
    valueProperty: "vehiclecount",

    // Set the color scale
    scale: ["lightgreen", "darkgreen"],

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
      layer.bindPopup("Zip Code: " + feature.properties.ZCTA5CE10 + "<br><br>" +
        "vehicles: " + feature.properties.vehiclecount);
      
      layer.on({
        // When a user's mouse cursor touches a map feature, the mouseover event calls this function, which makes that feature's opacity change to 90% so that it stands out.
        mouseover: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.9
          });
        },
        // When the cursor no longer hovers over a map feature (that is, when the mouseout event occurs), the feature's opacity reverts back to 50%.
        mouseout: function(event) {
          layer = event.target;
          layer.setStyle({
            fillOpacity: 0.5
          });
        },
      });
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
