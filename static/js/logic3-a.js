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

// // Current Make placeholder
// var chosenMake = "TESLA";

d3.json("http://127.0.0.1:5000/altbyzipmake").then(function(altbyzipmake) {
  // Data has now been filtered by car make through Flask
  console.log(altbyzipmake.length);
  // console.log(altbyzipmake.zip_code.length);
  // console.log(altbyzipmake.zip_code[1], altbyzipmake.make[1], altbyzipmake.sum[1]);
  console.log(altbyzipmake);

  // Make the zip code objects
  var myDict = {};
  
  var uniqueZip = [];

  for (var j = 0; j < altbyzipmake.length; j++) {

    // populate the array with the zip keys of each available zip code
    // if key zip code already exists, add new key value to existing dictionary
    // if it doesn't, create the first entry for the zip.  Then loop through geoJSON
    // and use myDict to populate the rest.
    
    var localMake = altbyzipmake[j].make;
    var localSum  = altbyzipmake[j].sum;
    var localZip  = altbyzipmake[j].zip_code;

    if (Object.keys(myDict).includes(localZip)) {
      myDict[localZip][localMake] = localSum;
    } else {
      myDict[localZip] = {
        localMake: localSum
      };
    }
    console.log(myDict);
    //  The scenario:
    // myDict[localZip][localMake] = localSum;

    // Maybe: read in the data from myDict, then append the
    //   current localDict to it, then write it back to myDict
    // var localDict = {};
    // localDict[localMake] = localSum;
    // console.log(localDict);

    // myDict[localZip] = localDict;
    // myDict[localZip].append(localDict);  // For arrays
    // myDict[localZip].push(localDict);    // For arrays
    // myDict.push(localDict);              // For arrays
  }
  console.log(myDict);
});

// Get the geoJSON Zip Code/properties/geometry data using d3.
// d3.json(geoData).then(function(data) {
//   // console.log(data);

//   // Get Zip Code/count from Postgres db using d3/Flask
//   d3.json("http://127.0.0.1:5000/altbyzipmake").then(function(altbyzipmake) {
//     // console.log(`geoData length ${data["features"].length}`);

//     // Data has now been filtered by car make through Flask
//     console.log(altbyzipmake.zip_code[1], altbyzipmake.make[1], altbyzipmake.sum[1]);

//     // for (let i = 0; i < data["features"].length; i++) {
//     //   let currentZip = parseInt(data["features"][i]["properties"]["ZCTA5CE10"]);

//     //   // Update geoJSON properties with additional vehiclecount property
//     //   // If database does not have a corresponding vehicle count for the zip, set to zero
//     //   if (altbyzipmake.hasOwnProperty([currentZip])) {
//     //     data["features"][i]["properties"]["vehiclecount"] = altbyzipmake[currentZip]["sum"];
//     //   } else {
//     //     data["features"][i]["properties"]["vehiclecount"] = 0;
//     //   //   console.log(`Info: No count reported for zip ${currentZip}`)
//     //   }
//     // }

//     // console.log(data);

//     // // Create a new choropleth layer
//     // geojson = L.choropleth(data, {

//     //   // Define which property in the features to use.
//     //   valueProperty: "vehiclecount",

//     //   // Set the color scale
//     //   scale: ["orange", "yellow", "darkgreen"],
      
//     //   // The number of breaks in the step range
//     //   steps: 10,

//     //   // q for quartile, e for equidistant, k for k-means
//     //   mode: "q",
//     //   style: {
//     //     // Border color
//     //     color: "#fff",
//     //     weight: 0.7,
//     //     fillOpacity: 0.8
//     //   },

//     //   // Bind a popup to each layer, highlight when selected
//     //   onEachFeature: function(feature, layer) {
//     //     layer.bindPopup("Zip Code: " + feature.properties.ZCTA5CE10 + "<br>" +
//     //       "make: " + chosenMake + "<br>" +
//     //       "vehicles: " + feature.properties.vehiclecount
//     //     );
        
//     //   }

//     // }).addTo(myMap);

//     // // Set up the legend
//     // var legend = L.control({ position: "bottomleft" });
    
//     // legend.onAdd = function() {
//     //   var div = L.DomUtil.create("div", "info legend");
//     //   var limits = geojson.options.limits;
//     //   var colors = geojson.options.colors;
//     //   var labels = [];

//     //   // Add the minimum and maximum to the legend
//     //   var legendInfo = "<h1>County Vehicle Quantity</h1>" +
//     //     "<div class=\"labels\">" +
//     //       "<div class=\"min\">" + limits[0] + "</div>" +
//     //       "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
//     //     "</div>";

//     //   div.innerHTML = legendInfo;

//     //   limits.forEach(function(limit, index) {
//     //     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
//     //   });

//     //   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//     //   return div;
//     // };

//     // // Add the legend to the map
//     // legend.addTo(myMap);
//   })

// });
