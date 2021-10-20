///d3.json("http://127.0.0.1:5000/top10zip").then(function(data){console.log(data)});
///d3.json("http://127.0.0.1:5000/alternatebyfuel").then(function(data){console.log(data)});
///d3.json("http://127.0.0.1:5000/alternatebymodelyear").then(function(data){console.log(data)});

/// Use d3 to read Top 10 Zip Code 
///d3.json("http://127.0.0.1:5000/top10zip").then(function(data){console.log(data)});

//d3.json("http://127.0.0.1:5000/alternatebyfuel").then(function(data) => 
//{console.log(data)});


// Use d3 to read the JSON file 
// Data from Json is named Data as the argument 
// d3.json("http://127.0.0.1:5000/alternatebyfuel").then((function(data) {
    // Sort Array in descending order 
    // function compareFrequency(a,b) {
    //     return frequency[b] - frequency[a];
    //   }

    //   data.sort(compareFrequency);
    //let sortedbymake = data.sort((a,b) => b.make - a.make); 
// });

// d3.json("http://127.0.0.1:5000/alternatebyfuel").then((function(data) {
//     // Create an Array for make 
//     let data1 = Object.keys(data).map(function(key) {
//         return [key, data[key]];
//     });

//     // Sort Array by Make Results in Descending Order 
//     let sortedbymake = data.sort((a,b) => b.make - a.make); 

//     // Slice the First 10 
//     slicedData = sortedbymake.slice(0, 10);
// });


// View the Charts -- Create Empty Group 
let svg = d3.select("svg")
    margin = {top: 50, right: 100, bottom: 70, left: 100}, 
    width = 1000 - margin.left - margin.right, 
    height = 600 - margin.left - margin.bottom;

let xaxis = d3.scaleBand().range([0,width]).padding(0,4)
    yaxis = d3.scaleLinear().range([height, 0]);

let group = svg.append("g")
            .attr("transform", "translate(0," + height + ")");

//Create Empty Variables 
let updatefuel ='';
let updatemake ='';

// Create Variable fuelselection to Get Element From Form (FuelType)
let fuelselection = document.getElementById("FuelType");

// Create Function to display Fuel 
function displayfuel(){
    // initial value 
    let i = document.forms[0].FuelType.value;
    //Get Selected Text From Dropdown 
    updatefuel = fuelselection.options[fuelselection.selectedIndex].value;
    document.getElementById("fuelData").innerHTML = '<span>'+updatefuel+'</span>';
    callonchange();
}
fuelselection.onchange = displayfuel;

// Create Variable makeselection to Get Element From Form ()
let makeselection = document.getElementById("VehicleMake");

// Create Function to display Fuel 
function displaymake(){
    // initial value 
    let i = document.forms[0].VehicleMake.value;
    //Get Selected Text From Dropdown 
    updatemake = makeselection.options[makeselection.selectedIndex].value;
    document.getElementById("tableTitle").innerHTML = '<span>'+updatemake+'</span>';
    document.getElementById("bottomTable").innerHTML = '<span>'+updatemake+'</span>';
    callonchange();
}
makeselection.onchange = displaymake;



/// Upload Data and loop over the JSON file using D3.json().then()
d3.json("http://127.0.0.1:5000/alternatebyfuel")
  .then(function(error, data){
      if (error) throw error;
      // Get Make 
      let uniqueMake = data 
          .map(e => e['Make'])
          .map((e, i, final) => final.indexOf(e) == i && i)
          .filter(obj=> data[obj])
          .map(e => data[e]);
       let currentmake = "<option>Vehicle Make</option>";
       uniqueMake.forEach(res => {
        currentmake += "<option value='"+res.Make+"'>" + res.Make + "</option>"
       })
       document.getElementById("VehicleMake").innerHTML = currentmake;
       //Get FuelType
       let uniqueFuel = data 
          .map(e => e['fuel'])
          .map((e, i, final) => final.indexOf(e) == i && i)
          .filter(obj=> data[obj])
          .map(e => data[e]);
       let currentfuel = "<option>Fuel Type</option>";
       uniqueFuel.forEach(res => {
        currentfuel += "<option value='"+res.fuel+"'>" + res.fuel + "</option>"
       })
       document.getElementById("FuelType").innerHTML = currentfuel;

       //Get Model 
       sortobj = []
       data.forEach(d => {
           d.vehicles = parseFloat(d.sum);
           d.model = parseFloat(d.model_year);
           sortobj.push({year: 2020})
        });
});

    /// Function to call on change(){
        function callonchange(){
            console.log(data);
            data1 = data.filter(function (el)
                {
                    return el.Make == updatemake && (el.updatefuel);
                });
            let obj = {}
            data1.forEach((item) => {
                 if(obj[item.model_year]) {
                        obj[item.model_year].sum + item.sum}
                else{
                    obj[item.model_year] = item 
                }
            })
            let newarr = Object.values(obj);
            console.log(newarr);
            let bottomContent ='';
            newarr.forEach((mod)=> {
                  bottomContent += '<div class="tableBottom"><div class="modelBottom">'+mod.model_year+'</div><div class="fuelBottom">'+mod.sum+'</div></div>';
            })
            document.getElementById("tableBottom").innerHTML = bottomContent;
               //BarChart 
               xaxis.domain(newarr.map(function(d){ return d.model;}));
               yaxis.domain([
                    (Math.floor(d3.min(newarr, function(d) {return d.vehicles;})/10) *10),
                    (Math.ceil(d3.max(newarr, function(d) {return d.vehicles;})/10) *10)
                ]);
                group.append("g")
                     .attr("transform", "translate(0," + height + ")")
                     .call(d3.axisBottom(xaxis))
                     .append("text")
                     .attr("y", height - 400)
                     .attr("x", width - 200)
                     .attr("text-anchor", "end")
                     .attr("stroke", "black")
                     .text("Model | Year");

                group.append("g")
                     .call(d3.axisLeft(yaxis).tickFormat(function(d){
                          return "" + d;
                     })
                     .ticks(20))
                     .append("text")
                     .attr("transform", "rotate(-90")
                     .attr("y", 6)
                     .attr("dy", "0.71em")
                     .attr("text-anchor", "end")
                     .text("value");
                group.SelectAll(".bar")
                     .data(newarr)
                     .enter().append("rect")
                     .attr("x", function(d) {
                          return xaxis(d.model);
                        })
                     .attr("y", function(d) {
                          return yaxis(d.vehicles)
                        })
                     .attr('width', xaxis.bandwidth())
                     .attr("height", function(d) {return height - yaxis(d.vehicles);});}
        function ShowHide (elements) {
            elements = elements.length ? elements : [elements];
            for (let index = 0; index < elements.length; index++) {
                elements[index].style.display = 'block';
            }
        }


    


    







// //extract the make from the json
//         let make = data.make; 
//         //filter the make for 

    
