// Creating the map object
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 10
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the GeoJSON data.
var geoData = "https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/ca_california_zip_codes_geo.min.json"
// var geoData = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/15-Mapping-Web/Median_Household_Income_2016.geojson";

var geojson;

// Get the data with d3.
d3.json(geoData).then(function(data) {
  // console.log(data);
  d3.json("http://127.0.0.1:5000/zipandvehicle").then(function(datazip) {
    // console.log(typeof(datazip));
    // console.log(datazip);
    for (let i = 0; i < data["features"].length; i++) {
      // console.log(data["features"][i]["properties"]["ZCTA5CE10"]);
      // if (datazip[parseInt(data["features"][i]["properties"]["ZCTA5CE10"])]["sum"]) {
      if (datazip.hasOwnProperty([parseInt(data["features"][i]["properties"]["ZCTA5CE10"])])) {
        data["features"][i]["properties"]["vehiclecount"] = datazip[parseInt(data["features"][i]["properties"]["ZCTA5CE10"])]["sum"];
      } else {
        console.log(`No vehicle count for zip code ${data["features"][i]["properties"]["ZCTA5CE10"]}`)
      }
      // console.log(datazip[parseInt(data["features"][i]["properties"]["ZCTA5CE10"])]["sum"]);
      // data["features"][i]["properties"]["vehiclecount"] = datazip[parseInt(data["features"][i]["properties"]["ZCTA5CE10"])];
    }

    // console.log(data);


    // Create a new choropleth layer.
    geojson = L.choropleth(data, {

    // Define which property in the features to use.
    valueProperty: "ZCTA5CE10",
    // valueProperty: "MHI2016",

    // Set the color scale.
    // scale: ["?#ffffb2", "#b10026"],
    scale: ["lightgreen", "green"],

    // The number of breaks in the step range
    steps: 10,

    // q for quartile, e for equidistant, k for k-means
    mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a popup to each layer
    onEachFeature: function(feature, layer) {
      // layer.bindPopup("Zip Code: " + feature.properties.ZIP + "<br>Median Household Income:<br>" +
      //   "$" + feature.properties.MHI2016);
      layer.bindPopup("Zip Code: " + feature.properties.ZCTA5CE10 + "<br><br>" +
        "$" + feature.properties.ZCTA5CE10);
    }
  }).addTo(myMap);

  // Set up the legend.
  var legend = L.control({ position: "bottomleft" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    // Add the minimum and maximum.
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

  // Adding the legend to the map
  legend.addTo(myMap);
  })
  

});
