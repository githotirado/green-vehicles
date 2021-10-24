				//barchart start
				/*var margin = {top: 20, right: 20, bottom: 200, left: 50},
					width = 700 - margin.left - margin.right,
					height = 450 - margin.top - margin.bottom
				var xScale = d3.scaleBand().range([0, width]).padding(0.4),
					yScale = d3.scaleLinear().range([height, 0]);
					
					
				var g = d3.select("#chart").append("svg")
				  .attr("width", width + margin.left + margin.right)
				  .attr("height", height + margin.top + margin.bottom)
				  .append('g')
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				//tooltip for chart
				var tooltip = d3.select("body").append("div").attr("class", "toolTip");*/
			//barchart end
			//onchange function start for fuel 
			var changeFuel  = '';
			var changeMake  = '';
			var ma = document.getElementById("FuelType");
			function showFuel(){
			  var as = document.forms[0].FuelType.value;
			  changeFuel = ma.options[ma.selectedIndex].value;
			}
			ma.onchange=showFuel;
			//onchange function end for fuel
			
			//onchange function start for Brand
			var fu = document.getElementById("SelectMake");
			function showMake(){
			  var as = document.forms[0].SelectMake.value;
			  changeMake = fu.options[fu.selectedIndex].value;
			  document.getElementById("tableTitle").innerHTML = '<span>'+changeMake+' Cars By Fuel Type in 2020</span>';
			  document.getElementById("bottomTable").innerHTML = '<span>'+changeMake+' Cars By Model Year of 2020</span>';
			  ShowHide(document.getElementById('topTable'));
			  callOnChange();
			}
			fu.onchange=showMake;
			//onchange function end for brand
			
			// Get the data
			var newArray;
			var valuesAll;
			d3.json("/alternatebyfuelyear").then(function(data){
				valuesAll = data;
				//make Brand select box start
				var uniqueMake = data
				 .map(e => e['make'])
				 .map((e, i, final) => final.indexOf(e) === i && i)
				 .filter(obj=> data[obj])
				 .map(e => data[e]);
				var strMake = "<option>Select Make</option>";
				uniqueMake.forEach(res => {
					strMake += "<option value='"+res.make+"'>" + res.make + "</option>"
				})
				document.getElementById("SelectMake").innerHTML = strMake;
				//make Brand select box end
				
				//make fuel select box start
				var uniqueFuel = data
				 .map(e => e['fuel'])
				 .map((e, i, final) => final.indexOf(e) === i && i)
				 .filter(obj=> data[obj])
				 .map(e => data[e]);
					var catOptions = "";
					for (categoryId in uniqueFuel) {
						var category = uniqueFuel[categoryId];
					  catOptions += "<label><input type='checkbox' name='categories' value='" + category.fuel + "' onclick='checkOptions()'>" 
						+  category.fuel + "</input></label>";
					}
					document.getElementById("checkboxes").innerHTML = catOptions;
					//make Fuel select box end
				
			  
				//data Formating
				sortingObj = []
				data.forEach(d => {
					d.sum = parseFloat(d.sum);
					d.model_year = parseFloat(d.model_year);
					// var date = new Date(d.date);
					// let year = date.getFullYear();
					sortingObj.push({year: 2020})
				})
				//make Report Years select box start
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
				//make Report Years select box end
				
			});
			function callOnChange(){
				let test = [];
				newArray = [];
				resultFiltered = [];
				//Start bar chart
				/*var g = d3.select("#chart").append("svg")
			  .attr("width", width + margin.left + margin.right)
			  .attr("height", height + margin.top + margin.bottom)
			  .append('g')
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");*/
				//data filter on fuel
				newArray = valuesAll.filter(function (el){return el.make === changeMake && (fuelSelected.includes(el.fuel) && fuelSelected.includes(el.fuel));});
				var objNew = newArray.reduce(function(r, e) {
				  if (!r[e.fuel]) r[e.fuel] = e
				  else r[e.fuel] = Array.isArray(r[e.fuel]) ? r[e.fuel].concat(e) : [r[e.fuel]].concat(e)
				  return r;
				}, {})
				var resultVal = Object.keys(objNew).map(e => objNew[e])

				
				var bottomContent = '';
				var obj1 = [];
				newArrayVal = [];
				//data formating 
					//const formater =  d3.format(",d");
				//data filter after feul on model years
				fuelSelected.forEach(function(v, i) {
					if(resultVal[i] && resultVal[i].length>0){
						//console.log(resultVal[i]);
						var holder1 = {};
						
						resultVal[i].forEach(function(d) {
						  if (holder1.hasOwnProperty(d.model_year)) {
							holder1[d.model_year] = holder1[d.model_year] + d.sum;
							//holder1.fuel = d.fuel;
						  } else {
							holder1[d.model_year] = d.sum;
							//holder1.fuel = d.fuel;
						  }
						});
						//console.log(holder1);
						obj1 = [];
						for (var prop in holder1) {
						  obj1.push({ model_year: prop, sum: holder1[prop] });
						}
						obj1.map(item => item.fuel = resultVal[i][0].fuel);
						//console.log(obj1);
						newArrayVal.push(obj1);
					}	
				})
				//console.log(newArrayVal);
				//data sum on model years
				var forYears = [];
				newArrayVal.forEach((mt, mi)=>{
					mt.forEach((t)=>{
						//console.log(t);
						forYears.push(t);
						/*if(forYears.length===0){
							forYears = mt;
							console.log(mt);
						}else{
							if(mi>0){
								//console.log(mt);
								forYears.forEach((st, si)=>{
									console.log(t.model_year);
									console.log(st.model_year);
									if(t.model_year === st.model_year){
										st['sum'+mi] = t.sum;
									}else{
										forYears.push(t);
									}
								})
							}
						}*/
						
					})
				})
				forYears.sort(function(a, b) {
					return parseFloat(a.model_year) - parseFloat(b.model_year);
				});
				
				//console.log(forYears);
				
				if(forYears.length<=3){
				 document.getElementById('tableHead').style.width =  "693px";
				 document.getElementById('tableBottom').style.width =  "693px";
			 }else{
				 let length = forYears.length+1;
				 let fuelWidth = length*155;
				 document.getElementById('tableHead').style.width =  fuelWidth+"px";
				 document.getElementById('tableBottom').style.width =  fuelWidth+"px";
			 }
			  
			  var output = [];

				forYears.forEach(function(item) {
				  var existing = output.filter(function(v, i) {
					return v.model_year == item.model_year;
				  });
				  if (existing.length) {
					var existingIndex = output.indexOf(existing[0]);
					output[existingIndex].fuel = output[existingIndex].fuel.concat(item.fuel);
					output[existingIndex].sum = output[existingIndex].sum.concat(item.sum);
				  } else {
					if (typeof item.fuel == 'string')
					  item.fuel = [item.fuel];
				  
					item.sum = [item.sum];
					output.push(item);
				  }
				});

			  /*forYears.forEach(res => {
					strFuelHead += '<div class="fuelHead">'+res.fuel+'</div>';
				})*/
				let strFuelHead = '<div class="modelHead">Model Year</div>';
				let testV = [];
				let innBottom;
				//console.log(forYears);
				//data separate for fuel type and append on ui
				output.forEach((val)=>{
					//console.log(val.fuel);
					let fuelType = val.fuel;
					let sumType = val.sum;
					fuelType.forEach((valSub)=>{
						if(testV.indexOf(valSub) === -1){
							testV.push(valSub);
							strFuelHead += '</div><div class="fuelHead">'+valSub+'</div>';
						}
					});
					let strFuelBottom = '';
					sumType.forEach((valSub)=>{
						strFuelBottom+='<div class="fuelBottom">'+valSub+'</div>';
					})
					
					//strFuelHead = '<div class="modelHead">Model Year</div>';
					bottomContent += '<div class="tableBottom"><div class="modelBottom">'+val.model_year+'</div>'+strFuelBottom;
				})
				//console.log(testV);
				document.getElementById("tableHead").innerHTML = strFuelHead;
				document.getElementById("tableBottom").innerHTML = bottomContent;
				
				var holder = {};
				newArray.forEach(function(d) {
				  if (holder.hasOwnProperty(d.model_year)) {
					holder[d.model_year] = holder[d.model_year] + d.sum;
				  } else {
					holder[d.model_year] = d.sum;
				  }
				});
				//data filter on model for chart
				var obj2 = [];
				let xl = [];
				let yl = [];
				for (var prop in holder) {
					xl.push(prop);
					yl.push(holder[prop]);
				}
				var dataChart = [
				  {
					x: xl,
					y: yl,
					type: 'bar'
				  }
				];
				layout = {
					paper_bgcolor: "rgba(0,0,0,0)",
					width: 700,
					height: 400,
				 }
				//Plotly.restyle('chart', 'y', [[]]);
				Plotly.newPlot('chart', dataChart, layout);
				//obj2.push({ model_year: prop, sum: holder[prop] });
				 
					/*// Add X axis
					xScale.domain(obj2.map(function(d) { return d.model_year; }));
					// Add Y axis
					yScale.domain([
					  (Math.floor(d3.min(obj2, function(d) { return d.sum; }) / 10) * 10),
					  (Math.ceil(d3.max(obj2, function(d) { return d.sum; }) / 10) * 10)
					]);
					
					//chart x Axis title
					g.append("g")
					 .attr("transform", "translate(0," + height + ")")
					 .call(d3.axisBottom(xScale))
					 .append("text")
					 .attr("y", height - 450)
					 .attr("x", width - 240)
					 .attr("text-anchor", "end")
					 .attr("stroke", "black")
					 .text("Model | Year");
					//chart y Axis title
					g.append("g")
					 .call(d3.axisLeft(yScale).tickFormat(d3.format(".0s"))
					 .ticks(20))
					 .append("text")
					 .attr("transform", "rotate(-90)")
					 .attr("y", 10)
					 .attr("dy", "-5.1em")
					 .attr("text-anchor", "end")
					 .attr("stroke", "black")
					 .text("sum");
					//chart Bars
					g.selectAll(".bar")
					 .data(obj2)
					 .enter().append("rect")
					 .attr("class", "bar")
					 .attr("x", function(d) { return xScale(d.model_year); })
					 .attr("y", function(d) { return yScale(d.sum); })
					 .attr("width", xScale.bandwidth())
					 .attr("fill", "#69b3a2")
					 .attr("height", function(d) { return height - yScale(d.sum); })
					 .on("mousemove", function(d){
							tooltip
							  .style("left", d3.event.pageX - 50 + "px")
							  .style("top", d3.event.pageY - 70 + "px")
							  .style("display", "inline-block")
							  .html((d.model_year) + "<br>" + " " + (formater(d.sum)));
						})
							.on("mouseout", function(d){ tooltip.style("display", "none");});;*/
				
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
			var fuelSelected= [];
			function checkOptions() {
			  els = document.getElementsByName('categories');
			  var selectedChecks = "", qtChecks = 0;
			  fuelSelected = [];
			  for (i = 0; i < els.length; i++) {
				if (els[i].checked) {
				  if (qtChecks > 0) selectedChecks += ", "
				  selectedChecks += els[i].value;
				  fuelSelected.push(els[i].value);
				  qtChecks++;
				}
			  }
			  //console.log(fuelSelected);
			  if(selectedChecks != "") {
				document.getElementById("defaultCategory").innerText = selectedChecks;
			  } else {
				document.getElementById("defaultCategory").innerText = "Select an option";
			  }
			}