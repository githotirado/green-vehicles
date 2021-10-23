				//barchart start
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
				//tooltip for chart
				var tooltip = d3.select("body").append("div").attr("class", "toolTip");
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
			  //remove d3 chart on change
			  d3.select("svg").remove();
			  //added new chart on ui
			  callOnChange();
			}
			fu.onchange=showMake;
			//onchange function end for brand
			
			// Get the data
			var newArray;
			var valuesAll;
			d3.json("/alternatebyfuelyear").then(function(data) {
				//if (error) throw error;
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
				var g = d3.select("#chart").append("svg")
			  .attr("width", width + margin.left + margin.right)
			  .attr("height", height + margin.top + margin.bottom)
			  .append('g')
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				//data filter on fuel
				newArray = valuesAll.filter(function (el){return el.make === changeMake && (fuleSelected.includes(el.fuel) && fuleSelected.includes(el.fuel));});
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
					const formater =  d3.format(",d");
				//data filter after fuel on model years
				fuleSelected.forEach(function(v, i) {
					if(resultVal[i] && resultVal[i].length>0){
						var holder1 = {};
						
						resultVal[i].forEach(function(d) {
						  if (holder1.hasOwnProperty(d.model_year)) {
							holder1[d.model_year] = holder1[d.model_year] + d.sum;
						  } else {
							holder1[d.model_year] = d.sum;
						  }
						});
						obj1 = [];
						for (var prop in holder1) {
						  obj1.push({ model_year: prop, sum: holder1[prop] });
						}
						newArrayVal.push(obj1);
					}	
				})
				//data sum on model years
				var forYears = [];
				newArrayVal.forEach((mt, mi)=>{
					mt.forEach((t)=>{
						if(forYears.length===0){
							forYears = mt;
						}else{
							if(mi>0){
								forYears.forEach((st, si)=>{
									if(t.model_year === st.model_year){
										st['sum'+mi] = t.sum;
									}
								})
							}
						}
					})
				})
				forYears.sort(function(a, b) {
					return parseFloat(a.model_year) - parseFloat(b.model_year);
				});
				//data separate for fuel type and append on ui
				forYears.forEach((val)=>{
					let sum1 = '';
					if(val.sum1){
						sum1 = '<div class="fuelBottom">'+formater(val.sum1)+'</div>';
					}
					let sum2 = '';
					if(val.sum2){
						sum2 = '<div class="fuelBottom">'+formater(val.sum2)+'</div>';
					}
					let sum3 = '';
					if(val.sum3){
						sum3 = '<div class="fuelBottom">'+formater(val.sum3)+'</div>';
					}
					let sum4 = '';
					if(val.sum4){
						sum4 = '<div class="fuelBottom">'+formater(val.sum4)+'</div>';
					}
					let sum5 = '';
					if(val.sum5){
						sum5 = '<div class="fuelBottom">'+formater(val.sum5)+'</div>';
					}
					let sum6 = '';
					if(val.sum6){
						sum6 = '<div class="fuelBottom">'+formater(val.sum6)+'</div>';
					}
					let sum7 = '';
					if(val.sum7){
						sum7 = '<div class="fuelBottom">'+formater(val.sum7)+'</div>';
					}
					let sum8 = '';
					if(val.sum8){
						sum8 = '<div class="fuelBottom">'+formater(val.sum8)+'</div>';
					}
					let sum9 = '';
					if(val.sum9){
						sum9 = '<div class="fuelBottom">'+formater(val.sum9)+'</div>';
					}
					let sum10 = '';
					if(val.sum10){
						sum10 = '<div class="fuelBottom">'+formater(val.sum10)+'</div>';
					}
					
					bottomContent += '<div class="tableBottom"><div class="modelBottom">'+val.model_year+'</div><div class="fuelBottom">'+val.sum+'</div>'+sum1+''+sum2+''+sum3+''+sum4+''+sum5+''+sum6+''+sum7+''+sum8+''+sum9+''+sum10+'</div>';
				})
				
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
				for (var prop in holder) {
				  obj2.push({ model_year: prop, sum: holder[prop] });
				}
					
					// Add X axis
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
					 .text("Vehicle");
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
							.on("mouseout", function(d){ tooltip.style("display", "none");});;
				
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
			  //console.log(fuleSelected);
			  if(selectedChecks != "") {
				document.getElementById("defaultCategory").innerText = selectedChecks;
			  } else {
				document.getElementById("defaultCategory").innerText = "Select an option";
			  }
			}