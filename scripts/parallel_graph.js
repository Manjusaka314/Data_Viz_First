var margin = {top: 10, right: 20, bottom: 50, left: 50},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Declare Category 10 scheme
//var cValue = function(d) { return d.UN_region;},
//    color = d3.scaleOrdinal(d3.schemeCategory10);

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg3 = d3.select("#parallel")
    .attr("width", 1600)
    .attr("height", 300)
  .append("g")
    .attr("transform", "translate(" + 150 + "," + 40 + ")");

var x = d3.scalePoint().range([0, 1600], 1);
var y = {};
var dragging = {};

var line = d3.line(),
    axis = d3.axisLeft();   



setpath(year);
function setpath(yaer){
	

// Get the data
d3.csv("./data/NFA_2018.csv", function(error, data) {
    if (error) throw error;
  var dataN = data.filter(function(row){
		return row.year === year && row.country !== 'World'&& row.record === 'EFConsPerCap';
    });
	
  //var colorary = [d3.schemePastel1[0], d3.schemePastel1[0], d3.schemePastel1[0], d3.schemePastel1[0], d3.schemePastel1[0], d3.schemePastel1[0], d3.schemePastel1[0]];

  var cValue = function(d) { return d.UN_region;},
    color = d3.scaleOrdinal(d3.schemePastel1);

  x.domain(dimensions = d3.keys(dataN[0]).filter(function(d) {
    return d !== "country" && d !== "ISO alpha-3 code" && d !== "UN_region" && d !== "UN_subregion" && d !== "year" && d !== "record" && d !== "total"  && d !== "Percapita GDP (2010 USD)" && d !== "population" && (y[d] = d3.scaleLinear()
        .domain(d3.extent(dataN, function(p) { return +p[d]; }))
        .range([300, 0]));
  }));

  var tooltip3 = d3.select("body")
				.append("div")
				.attr("class","tooltip_path")
				.style('display', 'none');

  svg3.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(dataN)
      .enter().append("path")
      .attr("class", "pathline")
      .style("stroke", function(d) { return color(cValue(d));})
      .style("fill", "none")
      .style("stroke-width", 3)
 	  .style("opacity", 0.6)
      .attr("d", path)
	  .on('mousemove',function(d){
		  if (d3.select(this).style("stroke-width") == 6){
			  tooltip3.style('display', 'block');
			  tooltip3.html('<strong><font color = #424551 size = 5>Landtypes Required to Support Ecological Footprint of Consumption Per Capita</font></strong>' + "<br/>" + "<hr/>" + '<strong><font color = #424551 size = 3>Global hectares of crop land available: </font></strong>' + '<strong><font color = #bc6953>' + d.crop_land + '</font></strong>' + "<br/>" + '<strong><font color = #424551 size = 3>Global hectares of grazing land available: </font></strong>' + '<strong><font color = #bc6953>' + d.grazing_land +  '</font></strong>' + "<br/>" + '<strong><font color = #424551 size = 3>Global hectares of forest land available: </font></strong>' + '<strong><font color = #bc6953>' + d.forest_land + '</font></strong>' + "<br/>" + '<strong><font color = #424551 size = 3>Global hectares of marine and inland fishing grounds available:</font> </strong>' + '<strong><font color = #bc6953>' + d.fishing_ground + '</font></strong>' + "<br/>" + '<strong><font color = #424551 size = 3>Global hectares of built-up land available: </font></strong>' + '<strong><font color = #bc6953>' + d.built_up_land + '</font></strong>' + "<br/>" + '<strong><font color = #424551 size = 3>Global hectares of world-average forest required to sequester carbon emissions: </font></strong>' + '<strong><font color = #bc6953>' + d.carbon + '</font></strong>' );
		  }
	  })
  	  .on('mouseout',function(d){
		  //if (d3.select(this).style("stroke-width") == 5){
			  tooltip3.style('display', 'none');
		  //} 
	  });
	
		 
	//console.log(dataN);
	

	
  // Add a group element for each dimension.
  var g = svg3.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

  g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)  	  
	  .attr("font-weight", "bold")
      .style("fill","#282f33")
      .attr("font-size", 14)
      .style("text-anchor", "middle")
      .style("font-family", "Tahoma")
      .text(function(d) { return d; });
	
	var linearScale = d3.scaleLinear()
  						.domain([0, 5])
  						.range([0, 1600]);
	 var d = ['Asia','Europe','Africa','Latin America & the Caribbean','Oceania','North America'];
	 for (var i=0; i<6; i++){
		 svg3.append("line")
		    .attr("class", "legends")
		 	.attr("y1", 340 )
			.attr("x1", 235 + i * 220)
		    .attr("y2", 340)
			.attr("x2", 245 + i * 220)
		    .style("stroke-width", 3)
			.style("stroke", d3.schemePastel1[i]);
		 svg3.append("text")
		    .attr("class", "legends")
			.attr("y", 360)
			.attr("x", 240 + i * 220) 
		    .style("text-anchor", "middle")	
			.style("font-family", "Tahoma")
			.attr("font-weight", "bold")
			.style("fill", d3.schemePastel1[i])
			.style("font-size", "11px")
		    .text(d[i]);
		}

//	 for (var i=0; i<6; i++){
//		 svg3.append("circle")
//		    .attr("class", 'small')
//			.attr("cy", 380)
//			.attr("cx", 241 + i * 220)
//		 	.attr("r", 8)
//			.style("fill", '#e5e5e5');
//		}
	
});
}



function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
}




