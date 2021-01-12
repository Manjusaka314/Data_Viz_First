var margin = {top: 10, right: 20, bottom: 50, left: 50},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    chartRadius = height / 2 + 10;

// Declare Category 10 scheme


// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg4 = d3.select("#arc")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + 350 + "," + 240 + ")");

     
var PI = Math.PI,
  arcMinRadius = 10,
  arcPadding = 10,
  labelPadding = -30,
  numTicks = 10;



setarc(year);

function setarc(year){
// Get the data
d3.csv("./data/FiliterData.csv", function(error, data) {
    if (error) throw error;
	var cValue = function(d) { return d.region;},
    color = d3.scaleOrdinal(d3.schemePastel1);
	
	data = data.filter(function(row){
		return row.year === year;
    });


	var scale = d3.scaleLinear()
    	.domain([0, d3.max(data, function(d) { return d.mean;}) * 1.2])
    	.range([0, 2 * PI]);

  	var ticks = scale.ticks(numTicks).slice(0, -1);
  	var keys = data.map(function(d) { return d.region;});
  	//number of arcs
  	var numArcs = keys.length;
  	var arcWidth = (chartRadius - arcMinRadius - numArcs * arcPadding) / numArcs;

    var arc = d3.arc()
      .innerRadius(function(d, i) { return getInnerRadius(i);})
      .outerRadius(function(d, i) { return getOuterRadius(i);})
      .startAngle(0)
      .endAngle(function(d) { return scale(d);});

    var radialAxis = svg4.append('g')
      .attr('class', 'r_axis')
      .selectAll('g')
      .data(data)
      .enter().append('g');

  radialAxis.append('circle')
  	.style("fill", "none")
    .style("stroke", 'black')
    .style("stroke-width", 2)
    .style("opacity", 0.3)
    .attr('r', function(d, i) { return (getOuterRadius(i) + arcPadding);});

  radialAxis.append('text')
    .attr('x', labelPadding - 5)
    .attr('y', function(d, i) { return -(getOuterRadius(i) + arcPadding - 25);})
  	.style("font-size", 14)
    .style('fill', function(d) { return color(cValue(d));})
    .text(function(d) { return d3.format(".2f")(d.mean);});

   var axialAxis = svg4.append('g')
     .attr('class', 'a_axis')
     .selectAll('g')
      .data(ticks)
      .enter().append('g')
        .attr('transform', function(d) { return 'rotate(' + (rad2deg(scale(d)) - 90) + ')';});

  axialAxis.append('line')
    .attr('x2', chartRadius)
    .attr("stroke-width", 1.8)
    .style("opacity", 0.2)
	.attr("stroke", "black");

  axialAxis.append('text')
    .attr('x', chartRadius + 12)
  	.attr('y', 5)
    .style('text-anchor', function(d) { return (scale(d) >= PI && scale(d) < 2 * PI ? 'end' : null);})
    .attr('transform', function(d) { return 'rotate(' + (90 - rad2deg(scale(d))) + ',' + (chartRadius + 14) + ',-2)';})
  	.style("font-size", 20)
    .style("fill","#3e494f")
    .text(function(d) { return d;});

  var tempcolor;
  //data arcs
  var arcs = svg4.append('g')
    .attr('class', 'data')
    .selectAll('path')
      .data(data)
      .enter().append('path')
      .attr('class', 'arc')
      .attr('region', function(d) { return d.region;})
      .attr('stroke-opacity', 0)
      .style("opacity", 0.8)
      .style('fill', function(d) { return color(cValue(d));})
  	  .on('mouseover',function(d){
  	  	d3.select("#parallel").selectAll('.topcountry').remove();
		  if ((d3.select(this).style("opacity") == 0.8) && (flag == false)){
			  tempcolor = d3.select(this).style("fill");
			  d3.select(this).style("fill", '#ba273b');
			  var r = d3.select(this).attr('region');
			  showRegionPlot(r);
			  showRegion(r);
			  topary(r,year);
		  }
	  })
  	  .on('mouseout',function(d){
		  if ((d3.select(this).style("opacity") == 0.8) && (flag == false)){
			  d3.select(this).style("fill", tempcolor);
		      showRegionback();
			  showRegionPlotBack();
			  removetext();
		  } 
	  });
	
	
	

  arcs.transition()
    .delay(function(d, i) { return i * 200;})
    .duration(1000)
    .attrTween('d', arcTween);

var tooltip = d3.select("body")
				.append("div")
				.attr("class","tooltip_arc")
				.html("<strong><font color = #ba1b31 size = 3>Year: </font></strong>" + "<font color = #383435 size = 3>" + year + "</font>" + "<br/>" + "<hr/>" + "<strong><font color = #ba1b31 size = 3>Contents: </font></strong>" + "<br/>" + "<font color = #383435 size = 2>Total Values of Ecological Footprint Consumption Per Capita</font>")
				.style('display', 'block');

  function arcTween(d, i) {
    var interpolate = d3.interpolate(0, d.mean);
    return function(t) { return arc(interpolate(t), i);};
  }

  function rad2deg(angle) {
    return angle * 180 / PI;
  }

  function getInnerRadius(index) {
    return arcMinRadius + (numArcs - (index + 1)) * (arcWidth + arcPadding);
  }

  function getOuterRadius(index) {
    return getInnerRadius(index) + arcWidth;
  }

	


	
 svg4.append("g")
	 .attr("transform", "translate(290," + 0 + ")")
     .attr("class", "legends")
    .append("text")
      .attr("class", "legendtitle")
      .attr("y", 6)
      .attr("font-size", 18)
  	  .attr("font-weight", "bold")
      .attr("dy", ".71em")
      .style("fill","#cffcf0")
      .style("text-anchor", "end")
      .text("Legend");
	
	
 for (var i=0; i<6; i++){
		 var d = ['Asia','Europe','Africa','Latin America & the Caribbean','Oceania','North America'];
		 svg4.append("circle")
		 	.attr("class", "legends")
			.attr("cy", 41 + i * 20)
			.attr("cx", 235)
		 	.attr("r", 8)
			.style("fill", d3.schemePastel1[i]);
		svg4.append("text")
		   .attr("class", "legends")
	   	   .attr("y", 45 + i * 20)
	       .attr("x", 250)
	       .style("text-anchor", "start")	
	       .style("font-family", "Tahoma")
		   .attr("font-weight", "bold")
		   .style("fill", d3.schemePastel1[i])
	       .style("font-size", "11px")
	       .text(d[i]);
		}
	
});
}


var tempcolor;

function showRegion(r) {
	 d3.select("#parallel").selectAll('.pathline').style("opacity", 0.1).style("stroke-width", 2);
	 d3.select("#parallel").selectAll('.pathline').filter(function(d){ 
    	return d.UN_region === r;
  		}).style("opacity", 1);
}


function showRegionback(){
	d3.select("#parallel").selectAll('.pathline').style("opacity", 0.6).style("stroke-width", 3);
}


function showRegionPlot(r){
	d3.select("#chart").selectAll('.dot').style("opacity", 0.1);
	d3.select("#chart").selectAll('.dot').filter(function(d){ 
    	return d.UN_region === r;
  		}).style("opacity", 0.8);
}


function showRegionPlotBack(){
	d3.select("#chart").selectAll('.dot').style("opacity", 0.6);
	d3.select("#chart").selectAll('.topid').remove();
}


function topary(r,year){
	var cary = [];
	var tc;
	var forest_landmax = 0;
	var fishing_groundmax = 0;
	var built_up_landmax = 0;
	var carbonmax = 0;
	var crop_landmax = 0;
	var grazing_landmax = 0;
	
	d3.csv("./data/NFA_2018.csv", function(error, data) {
	  data = data.filter(function(row){
			return row.year === year && row.country !== 'World';
		});

	  var dataE = data.filter(function(row){
		return row.record === 'EFConsPerCap';
	  });

	var temp = dataE.filter(function(row){
		return row.UN_region === r;
	  });

	  temp.forEach(function(d) {
		d['Percapita GDP (2010 USD)'] = +d['Percapita GDP (2010 USD)'];
		d.total = +d.total;
		d.grazing_land = +d.grazing_land;
		d.built_up_land = +d.built_up_land;
		d.carbon = +d.carbon;
		d.crop_land = +d.crop_land;
		d.fishing_ground = +d.fishing_ground;
		d.forest_land = +d.forest_land;
	  });


	for (var i = 0; i < temp.length; i++) {
	  if (crop_landmax < temp[i].crop_land){
		  	crop_landmax = temp[i].crop_land;
			tc = temp[i].country;
	  }
	}
	cary.push(tc);
	for (var i = 0; i < temp.length; i++) {
	  if (grazing_landmax < temp[i].grazing_land){
			grazing_landmax = temp[i].grazing_land;
		    tc = temp[i].country;
	  }
	}
	cary.push(tc);
	for (var i = 0; i < temp.length; i++) {
	  if (forest_landmax < temp[i].forest_land){
			forest_landmax = temp[i].forest_land;
		    tc = temp[i].country;
	  }
	}
	cary.push(tc);
	for (var i = 0; i < temp.length; i++) {
	  if (fishing_groundmax < temp[i].fishing_ground){
			fishing_groundmax = temp[i].fishing_ground;
		    tc = temp[i].country;
	  }
	}
	cary.push(tc);
	for (var i = 0; i < temp.length; i++) {
	  if (carbonmax < temp[i].carbon){
		  	carbonmax = temp[i].carbon;
		    tc = temp[i].country;
	  }
	}
	cary.push(tc);
	for (var i = 0; i < temp.length; i++) {
	  if (built_up_landmax < temp[i].built_up_land){
		  	built_up_landmax = temp[i].built_up_land;
		    tc = temp[i].country;
	  }
	}
	cary.push(tc);
//	var EFCmax = 0;
//	for (var i = 0; i < temp.length; i++) {
//	  if (EFCmax < temp[i].total){
//			EFCmax = temp[i].total;
//	  }
//	}
	console.log(cary);

	 for (var i=0; i<6; i++){
		 d3.select("#parallel")
		 	.append("text")
			.attr("y", 170 + i*320)
			.attr("x", -40)
			.attr("transform", "rotate(-90)")
			.attr("class", "topcountry")
			.style("text-anchor", "end")
			.style("font-family", "Tahoma")
			.style("font-size", "17px")
			.transition(d3.transition().duration(1000))	
			.attr("font-weight", "bold")
		    .style("opacity", 0.8)
			.style("fill", '#dbdbdb')
			.text('Top' + ' - ' + cary[i]);
		}
		
	});
	
}


function removetext(){
	d3.select("#parallel").selectAll('.topcountry').transition(d3.transition().duration(1000)).style("opacity", 0).remove();
}