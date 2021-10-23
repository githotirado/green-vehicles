//barchart start
				//var svg = d3.select("#chart").append("svg"),
                var margin = {top: 20, right: 20, bottom: 200, left: 50},
                width = 700 - margin.left - margin.right,
                height = 450 - margin.top - margin.bottom

            var xScale = d3.scaleBand().range([0, width]).padding(0.4),
                yScale = d3.scaleLinear().range([height, 0]);
                
                
                var g = d3.select("#chart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var tooltip = d3.select("body").append("div").attr("class", "toolTip");

            //var g = svg.append("g")
            //		   .attr("transform", "translate(" + 50 + "," + 10 + ")");
        //barchart end
        var changeFuel  = '';
        var changeMake  = '';
        var ma = document.getElementById("FuelType");
        function showFuel(){
          var as = document.forms[0].FuelType.value;
          changeFuel = ma.options[ma.selectedIndex].value;
        
        }
        ma.onchange=showFuel;
        //brand change
        var fu = document.getElementById("SelectMake");
        function showMake(){
          var as = document.forms[0].SelectMake.value;
          changeMake = fu.options[fu.selectedIndex].value;
          document.getElementById("tableTitle").innerHTML = '<span>'+changeMake+' Cars By Fuel Type in 2020</span>';
          document.getElementById("bottomTable").innerHTML = '<span>'+changeMake+' Cars By Model Year of 2020</span>';
          
         if(fuleSelected.length<=3){
             document.getElementById('tableHead').style.width =  "693px";
             document.getElementById('tableBottom').style.width =  "693px";
         }else{
             let length = fuleSelected.length+1;
             let fuelWidth = length*155;
             document.getElementById('tableHead').style.width =  fuelWidth+"px";
             document.getElementById('tableBottom').style.width =  fuelWidth+"px";
         }
          
          let strFuleHead = '<div class="modelHead">Model Year</div>';
          fuleSelected.forEach(res => {
                strFuleHead += '<div class="fuelHead">'+res+'</div>';
            })
          document.getElementById("tableHead").innerHTML = strFuleHead;
          
          
          ShowHide(document.getElementById('topTable'));
          d3.select("svg").remove();
         // topTable
          callOnChange();
         
        }
        fu.onchange=showMake;
        
        //show();
     
        // Get the data
        var newArray;
        var valuesAll;
        d3.csv('../static/data/2018.csv').then (function(data) {
            valuesAll = data;
            // console.log(data);
            //make Brand
            var uniqueMake = data
             .map(e => e['Make'])
             .map((e, i, final) => final.indexOf(e) === i && i)
             .filter(obj=> data[obj])
             .map(e => data[e]);
            var strMake = "<option>Select Make</option>";
            uniqueMake.forEach(res => {
                strMake += "<option value='"+res.Make+"'>" + res.Make + "</option>"
            })
            document.getElementById("SelectMake").innerHTML = strMake;
            
            //fuel Type
            var uniqueFuel = data
             .map(e => e['Fuel'])
             .map((e, i, final) => final.indexOf(e) === i && i)
             .filter(obj=> data[obj])
             .map(e => data[e]);
            
                var catOptions = "";
                for (categoryId in uniqueFuel) {
                    var category = uniqueFuel[categoryId];
                  catOptions += "<label><input type='checkbox' name='categories' value='" + category.Fuel + "' onclick='checkOptions()'>" 
                    +  category.Fuel + "</input></label>";
                }
                document.getElementById("checkboxes").innerHTML = catOptions;

            
          
            
            //Report Years
            sortingObj = []
            data.forEach(d => {
             //console.log(d);
                d.Vehicles = parseFloat(d.Vehicles);
                d.Model = parseFloat(d.Model);
                var date = new Date(d.Date);
                 //console.log(date);
                let year = date.getFullYear();
                sortingObj.push({year: year})
            })
              //console.log(sortingObj);
            //Report Year
            var uniqueYear = sortingObj
             .map(e => e['year'])
             .map((e, i, final) => final.indexOf(e) === i && i)
             .filter(obj=> sortingObj[obj])
             .map(e => sortingObj[e]);
            var strYear = ""
            uniqueYear.forEach(res => {
                strYear += "<option value='"+res.year+"'>" + res.year + "</option>"
            })
            document.getElementById("ReportYear").innerHTML = strYear;
             //console.log(uniqueYear);
            
        });
        function callOnChange(){
             //console.log(changeMake);
            let test = [];
            newArray = [];
            resultFiltered = [];
            var g = d3.select("#chart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            //console.log(valuesAll);
            //no model
            test.push(changeMake);
            //console.log(test);
            //console.log(fuleSelected);
            newArray = valuesAll.filter(function (el){return el.Make === changeMake && (fuleSelected.includes(el.Fuel) && fuleSelected.includes(el.Fuel));});
            //console.log(newArray);
            
            var objNew = newArray.reduce(function(r, e) {
              if (!r[e.Fuel]) r[e.Fuel] = e
              else r[e.Fuel] = Array.isArray(r[e.Fuel]) ? r[e.Fuel].concat(e) : [r[e.Fuel]].concat(e)
              return r;
            }, {})

            var resultVal = Object.keys(objNew).map(e => objNew[e])

            //console.log(resultVal);
            var bottomContent = '';
            var obj1 = [];
            newArrayVal = [];
            fuleSelected.forEach(function(v, i) {
                //console.log(i);
                //console.log(resultVal[i]);
                if(resultVal[i] && resultVal[i].length>0){
                    var holder1 = {};
                    
                    resultVal[i].forEach(function(d) {
                      if (holder1.hasOwnProperty(d.Model)) {
                        holder1[d.Model] = holder1[d.Model] + d.Vehicles;
                      } else {
                        holder1[d.Model] = d.Vehicles;
                      }
                    });
                    obj1 = [];
                    for (var prop in holder1) {
                      obj1.push({ Model: prop, Vehicles: holder1[prop] });
                    }
                    newArrayVal.push(obj1);
                }	
                //console.log(obj1);
            })
            //console.log(newArrayVal);
            var forYears = [];
            newArrayVal.forEach((mt, mi)=>{
                //console.log(mt);
                mt.forEach((t)=>{
                    //console.log(forYears.length);
                    if(forYears.length===0){
                        forYears = mt;
                    }else{
                        if(mi>0){
                            forYears.forEach((st, si)=>{
                                if(t.Model === st.Model){
                                    st['Vehicles'+mi] = t.Vehicles;
                                    //return;
                                    //console.log(si);
                                }
                            })
                        }
                    }
                })
            })
            //console.log(forYears);
            forYears.forEach((val)=>{
                let Vehicles1 = '';
                if(val.Vehicles1){
                    Vehicles1 = '<div class="fuelBottom">'+val.Vehicles1+'</div>';
                }
                let Vehicles2 = '';
                if(val.Vehicles2){
                    Vehicles2 = '<div class="fuelBottom">'+val.Vehicles2+'</div>';
                }
                let Vehicles3 = '';
                if(val.Vehicles3){
                    Vehicles3 = '<div class="fuelBottom">'+val.Vehicles3+'</div>';
                }
                let Vehicles4 = '';
                if(val.Vehicles4){
                    Vehicles4 = '<div class="fuelBottom">'+val.Vehicles4+'</div>';
                }
                let Vehicles5 = '';
                if(val.Vehicles5){
                    Vehicles5 = '<div class="fuelBottom">'+val.Vehicles5+'</div>';
                }
                let Vehicles6 = '';
                if(val.Vehicles6){
                    Vehicles6 = '<div class="fuelBottom">'+val.Vehicles6+'</div>';
                }
                let Vehicles7 = '';
                if(val.Vehicles7){
                    Vehicles7 = '<div class="fuelBottom">'+val.Vehicles7+'</div>';
                }
                let Vehicles8 = '';
                if(val.Vehicles8){
                    Vehicles8 = '<div class="fuelBottom">'+val.Vehicles8+'</div>';
                }
                let Vehicles9 = '';
                if(val.Vehicles9){
                    Vehicles9 = '<div class="fuelBottom">'+val.Vehicles9+'</div>';
                }
                let Vehicles10 = '';
                if(val.Vehicles10){
                    Vehicles10 = '<div class="fuelBottom">'+val.Vehicles10+'</div>';
                }
                
                bottomContent += '<div class="tableBottom"><div class="modelBottom">'+val.Model+'</div><div class="fuelBottom">'+val.Vehicles+'</div>'+Vehicles1+''+Vehicles2+''+Vehicles3+''+Vehicles4+''+Vehicles5+''+Vehicles6+''+Vehicles7+''+Vehicles8+''+Vehicles9+''+Vehicles10+'</div>';
            })
            /*yearArray = ['2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016','2017','2018','2019','2020','2021']
            forYears = [];
            //console.log(newArrayVal);
            yearArray.forEach((val)=>{
                //console.log(val)
                newArrayVal.forEach((t)=>{
                    t.forEach((mod)=>{
                        console.log(mod.Model);
                        if(val === mod.Model){
                            console.log(mod.Model);
                            array.indexOf(mod.Model) === -1 ? array.push(mod.Model);
                            //forYears.push(mod.Model)
                            //
                        }
                    })
                })
            })*/
            document.getElementById("tableBottom").innerHTML = bottomContent;
            
            var holder = {};
            newArray.forEach(function(d) {
              if (holder.hasOwnProperty(d.Model)) {
                holder[d.Model] = holder[d.Model] + d.Vehicles;
              } else {
                holder[d.Model] = d.Vehicles;
              }
            });
            var obj2 = [];
            for (var prop in holder) {
              obj2.push({ Model: prop, Vehicles: holder[prop] });
            }

            //console.log(obj2);
            
                const formater =  d3.format(",d");
                xScale.domain(obj2.map(function(d) { return d.Model; }));
                yScale.domain([
                  (Math.floor(d3.min(obj2, function(d) { return d.Vehicles; }) / 10) * 10),
                  (Math.ceil(d3.max(obj2, function(d) { return d.Vehicles; }) / 10) * 10)
                ]);

                g.append("g")
                 .attr("transform", "translate(0," + height + ")")
                 .call(d3.axisBottom(xScale))
                 .append("text")
                 .attr("y", height - 450)
                 .attr("x", width - 240)
                 .attr("text-anchor", "end")
                 .attr("stroke", "black")
                 .text("Model | Year");

                g.append("g")
                 .call(d3.axisLeft(yScale).tickFormat(d3.format(".0s"))
                 .ticks(20))
                 .append("text")
                 .attr("transform", "rotate(-90)")
                 .attr("y", 10)
                 .attr("dy", "-5.1em")
                 .attr("text-anchor", "end")
                 .attr("stroke", "black")
                 .text("Vehicles");

                g.selectAll(".bar")
                 .data(obj2)
                 .enter().append("rect")
                 .attr("class", "bar")
                 .attr("x", function(d) { return xScale(d.Model); })
                 .attr("y", function(d) { return yScale(d.Vehicles); })
                 .attr("width", xScale.bandwidth())
                 .attr("fill", "#69b3a2")
                 .attr("height", function(d) { return height - yScale(d.Vehicles); })
                 .on("mousemove", function(d){
                        tooltip
                          .style("left", d3.event.pageX - 50 + "px")
                          .style("top", d3.event.pageY - 70 + "px")
                          .style("display", "inline-block")
                          .html((d.Model) + "<br>" + " " + (formater(d.Vehicles)));
                    })
                        .on("mouseout", function(d){ tooltip.style("display", "none");});;
            
            //barchart end
        }
        function ShowHide (elements) {
          elements = elements.length ? elements : [elements];
          for (var index = 0; index < elements.length; index++) {
            elements[index].style.display = 'block';
          }
        }
        var expanded = false;
        function showCheckboxes() {
          var checkboxes = document.getElementById("checkboxes");
          if (!expanded) {
            checkboxes.style.display = "block";
            expanded = true;
          } else {
            checkboxes.style.display = "none";
            expanded = false;
          }
        }
        var fuleSelected= [];
        function checkOptions() {
          els = document.getElementsByName('categories');
          var selectedChecks = "", qtChecks = 0;
          fuleSelected = [];
          for (i = 0; i < els.length; i++) {
            if (els[i].checked) {
              if (qtChecks > 0) selectedChecks += ", "
              selectedChecks += els[i].value;
              fuleSelected.push(els[i].value);
              qtChecks++;
            }
          }
           console.log(fuleSelected);
          if(selectedChecks != "") {
            document.getElementById("defaultCategory").innerText = selectedChecks;
          } else {
            document.getElementById("defaultCategory").innerText = "Select an option";
          }
        }