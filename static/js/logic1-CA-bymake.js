// Function to draw Choropleth map of green vehicle counts when given the car Make
//  Uses database object and geoJSON object
function drawMap(mapData, carMake, dbMakeData) {
  // Create a new choropleth layer
  geojson = L.choropleth(mapData, {

    // Define which property for which auto maker in the features to use
    valueProperty: function (feature) {
      return feature.properties.vehiclecount[carMake]
    },

    // Set color scale; orange points out near-zero values and contrasts with green
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
        "make: " + carMake + "<br>" +
        "vehicles: " + feature.properties.vehiclecount[carMake]
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
    var legendInfo = "<h3>Vehicle Count<br>by County: " + carMake + "</h3>" +
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

  // Find top 10 zip codes for chosen car Make
  var dbTop10 = [];
  for (var j = 0; j < dbMakeData.length; j++) {
    var localMake = dbMakeData[j].make;
    var localSum  = dbMakeData[j].sum;
    var localZip  = dbMakeData[j].zip_code;

    // Append 10 NUMERIC zip codes to array dbTop10 for current car make
    var topCount = 10;
    if (localMake == carMake && !isNaN(parseInt(localZip)) && Object.keys(dbTop10).length <= topCount) {
      dbTop10.push(localZip);
    }
  };

  // With top 10 zips, place markers using properties from geoJSON object
  for (let i = 0; i < mapData["features"].length; i++) {
    let mapProperty = mapData["features"][i]["properties"]
    let currentZip = mapProperty["ZCTA5CE10"];

    if (dbTop10.includes(currentZip)) {
      var markerCount = mapProperty["vehiclecount"][carMake];
      var markerLat = mapProperty["INTPTLAT10"];
      var markerLon = mapProperty["INTPTLON10"];
      console.log(`Top10: ${carMake}, ${currentZip}, count ${markerCount}, coord ${markerLat}, ${markerLon}`);
      var marker = L.marker([markerLat, markerLon], {
        title: currentZip
      }).addTo(myMap);
      marker.bindPopup(`<h3>${currentZip}</h3> <hr> <h4>${carMake}: ${markerCount}</h4>`);
    }

  }

};

//                         M A I N   I N I T   S E C T I O N

// Set the initial chosen Make for first map, use dropDown changes to change map
// var chosenMake = "TOYOTA";
// var chosenMake = "TESLA";
var chosenMake = "BMW";


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

var myDict = {};

// Get the geoJSON Zip Code/properties/geometry data using d3.
d3.json(geoData).then(function(data) {

  // Create a zip code object from the database containing all car makes and their
  // registered vehicle counts per zip code.  For later add to geoJSON properties
  d3.json("http://127.0.0.1:5000/altbyzipmake").then(function(altbyzipmake) {

    // Initiate arrays to hold all possible car makes and zip codes in db
    var dbMakes = [];
    var dbZips = [];
    
    // Create zip code + auto maker object
    for (var j = 0; j < altbyzipmake.length; j++) {
      var localMake = altbyzipmake[j].make;
      var localSum  = altbyzipmake[j].sum;
      var localZip  = altbyzipmake[j].zip_code;

      // Append any new car makes to array dbMakes
      if (!dbMakes.includes(localMake)) {
        dbMakes.push(localMake);
      } 

      // Append any new NUMERIC zip codes to array dbZips
      if (!dbZips.includes(localZip) && !isNaN(parseInt(localZip))) {
        dbZips.push(localZip);
      }

      // If zip code key already exists, add object to existing key.
      // if key doesn't exist, instantiate the first key.
      if (Object.keys(myDict).includes(localZip)) {
        myDict[localZip][localMake] = localSum;
      } else {
        myDict[localZip] = {
          [localMake]: localSum
        };
      }

    } 

    // With arrays of car makes and zip codes, ensure every zip code has all car makes
    // Assign vehicle count '0' to those makes without a count
    for (var i = 0; i < dbMakes.length; i++) {
      for (var j = 0; j < dbZips.length; ++j) {
        let intZip = parseInt(dbZips[j]);
        let indMake = dbMakes[i];
        if (!Object.keys(myDict[intZip]).includes(indMake)) {
          myDict[intZip][indMake] = 0;
        }
      }
    }
    // Send to console the final zip-make object
    console.log(myDict);
  

    // Insert zip-carmake-sum data into the geoJSON dataset for all zips, car makes
    for (let i = 0; i < data["features"].length; i++) {
      let currentZip = parseInt(data["features"][i]["properties"]["ZCTA5CE10"]);

      // Update geoJSON properties with additional vehiclecount property
      // If database does not have a corresponding vehicle count for the zip, set to zero
      if (myDict.hasOwnProperty([currentZip])) {
        data["features"][i]["properties"]["vehiclecount"] = myDict[currentZip];
      } else {
        data["features"][i]["properties"]["vehiclecount"] = 0;
        // console.log(`Info: No vehicles in zip ${currentZip}`)
      }

    }

    // Send to console the final geoJSON dataset with properties
    console.log(data);

    // Create Choropleth map for chosen car make using geoJSON data object
    //  and db object for sorted top 10 markers
    drawMap(data, chosenMake, altbyzipmake);

  });

});
