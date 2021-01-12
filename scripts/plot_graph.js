var year = '2011';
var margin = {top: 10, right: 20, bottom: 50, left: 50},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;


// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + 200 + "," + 60 + ")");

var flag = false;
setplot(year);

//var yary = ['2011','2012','2013','2014'];
 //for (var i=0; i<4; i++){
	svg.append("text")
			   .attr("y", 410)
			   .attr("x", 70)
			   .attr("class", "2011")
			   .style("text-anchor", "middle")	
			   .style("font-family", "Tahoma")
			   .attr("font-weight", "bold")
	           .style("fill","#3e494f")
			   .style("font-size", "24px")
			   .text('2011')
			   .on('mouseover',function(){
					 d3.select(this)
					  .transition()
					  .duration(50)
					  .style("font-size", "32px").style("fill","#ce7b7b");
				})
			   .on('mouseout', function(){
					d3.select(this)
					  .transition()
					  .duration(1000)
					  .style("font-size", "24px").style('fill',"#3e494f");
				})
			   .on("click", function() {
					setyear('2011');
				});


	svg.append("text")
			   .attr("y", 410)
			   .attr("x", 230)
			   .attr("class", "2012")
			   .style("text-anchor", "middle")	
			   .style("font-family", "Tahoma")
			   .attr("font-weight", "bold")
	           .style("fill","#3e494f")
			   .style("font-size", "24px")
			   .text('2012')
			   .on('mouseover',function(){
					 d3.select(this)
					  .transition()
					  .duration(50)
					  .style("font-size", "32px").style("fill","#ce7b7b");
				})
			   .on('mouseout', function(){
					d3.select(this)
					  .transition()
					  .duration(1000)
					  .style("font-size", "24px").style('fill',"#3e494f");
				})
			   .on("click", function() {
					setyear('2012');
				});


	svg.append("text")
			   .attr("y", 410)
			   .attr("x", 390)
			   .attr("class", "2013")
			   .style("text-anchor", "middle")	
			   .style("font-family", "Tahoma")
			   .attr("font-weight", "bold")
	           .style("fill","#3e494f")
			   .style("font-size", "24px")
			   .text('2013')
			   .on('mouseover',function(){
					 d3.select(this)
					  .transition()
					  .duration(50)
					  .style("font-size", "32px").style("fill","#ce7b7b");
				})
			   .on('mouseout', function(){
					d3.select(this)
					  .transition()
					  .duration(1000)
					  .style("font-size", "24px").style('fill',"#3e494f");
				})
			   .on("click", function() {
					setyear('2013');
				});




	svg.append("text")
			   .attr("y", 410)
			   .attr("x", 550)
			   .attr("class", "2014")
			   .style("text-anchor", "middle")	
			   .style("font-family", "Tahoma")
			   .attr("font-weight", "bold")
	           .style("fill","#3e494f")
			   .style("font-size", "24px")
			   .text('2014')
			   .on('mouseover',function(){
					 d3.select(this)
					  .transition()
					  .duration(50)
					  .style("font-size", "32px").style("fill","#ce7b7b");
				})
			   .on('mouseout', function(){
					d3.select(this)
					  .transition()
					  .duration(1000)
					  .style("font-size", "24px").style('fill',"#3e494f");
				})
			   .on("click", function() {
					setyear('2014');
				});
setmap(year);



function setyear(x){
	year = x;

	setmap(year);

	d3.select("#chart").selectAll('.tick').remove();
	d3.select("#chart").selectAll('.legends').remove();
	d3.select("#chart").selectAll('.reclegends').remove();
	d3.select("#chart").selectAll('.dot')
	.transition(d3.transition().duration(600)).style("opacity", 0).remove();
	setplot(year);		
	d3.select("#arc").selectAll('.a_axis').remove();
	d3.select("#arc").selectAll('.r_axis').remove();
	d3.select("#arc").selectAll('.legends').remove();
	d3.select("#arc").selectAll('.arc').style("opacity", 0).transition(d3.transition().duration(100)).style("opacity", 0).remove();
	setarc(year);
	d3.select("#parallel").selectAll('.dimension').remove();
	d3.select("#parallel").selectAll('.legends').remove();
	d3.select("#parallel").selectAll('.foreground').transition(d3.transition().duration(50)).remove();
	setpath(year);	
	console.log(year);
}

function setplot(year){
// Get the data
d3.csv("./data/NFA_2018.csv", function(error, data) {
    if (error) throw error;
  data = data.filter(function(row){
		return row.year === year && row.country !== 'World';
    });
	
  var dataE = data.filter(function(row){
    	return row.record === 'EFConsTotGHA';
  });
	
  var dataB = data.filter(function(row){
		return row.record === 'BiocapTotGHA';
    });

 var cValue = function(d) { return d.UN_region;},
    color = d3.scaleOrdinal(d3.schemePastel1);

  dataE.forEach(function(d) {
		d.total2 = d.total;
		delete d.total;
	});


var ary = [];
for (var i = 0; i <= dataE.length-1; i++) {
  ary[i] = Object.assign(dataE[i], dataB[i]);
}

//console.log(d3.schemeAccent[1]);

	
var tooltip = d3.select("body")
				.append("div")
				.attr("class","tooltip")
  			    .style('display', 'none');
	
// set the ranges
var x = d3.scaleLog().range([0, width]);
var y = d3.scaleLog().range([height, 0]);

  ary.forEach(function(d) {
	d.population = +d.population;
	d.total = +d.total;
	d['Percapita GDP (2010 USD)'] = +d['Percapita GDP (2010 USD)'];
    d.total2 = +d.total2;
  });

var rscale = d3.scaleLinear().domain([d3.min(ary, function(d) { return d['Percapita GDP (2010 USD)']; }), d3.max(ary, function(d) { return d['Percapita GDP (2010 USD)']; })]).range([5,15]);
 
  x.domain([d3.min(ary, function(d) { return d.total;}), d3.max(ary, function(d) { return d.total;})]);
  y.domain([d3.min(ary, function(d) { return d.total2;}), d3.max(ary, function(d) { return d.total2;})]);

//var cValue = function(d) { return d.UN_region;},
//    color = d3.scaleOrdinal(d3.schemePastel1);
// console.log(d3.min(data, function(d) { if (data.record === 'BiocapTotGHA') {return data.total;}}));

    // Add the scatterplot
  svg.selectAll("dot")
      .data(ary)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("id", function(d){ return 'population' + d.population; })
      .attr("Biocap", function(d){ return d.total; })
      .attr("EFCons", function(d){ return d.total2; })
      .attr("gdp", function(d){ return d['Percapita GDP (2010 USD)']; })
  	  .attr("region", function(d){ return d.UN_region; })
      .attr("country", function(d){ return d.country; })
  	  .style("opacity", 0.6)
  	  .style("fill", function(d) { return color(cValue(d));})
      .attr("r", function(d) { return rscale(d['Percapita GDP (2010 USD)']); })
      .attr("cx", function(d) { return x(d.total);})
      .attr("cy", function(d) { return y(d.total2);});
	

var xAxis = d3.axisBottom(x).tickSize(8).ticks(10, ".2s"),
    yAxis = d3.axisLeft(y).tickSize(8).ticks(10, ".2s");
	

	
  svg.append("g")
      .attr("class", "x_axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("fill","#3e494f")
      .style("font-family", "Tahoma")
  	  .attr("font-weight", "bold")
      .style("text-anchor", "end")
      .text("Biocapacity");

  // y-axis
  svg.append("g")
      .attr("class", "y_axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
  	  .attr("font-weight", "bold")
      .attr("dy", ".71em")
      .style("fill","#3e494f")
      .style("text-anchor", "end")
      .style("font-family", "Tahoma")
      .text("Ecological Footprint");
	
	
	

   svg.append("text")
     .attr("class", "title")
     .attr("transform", "translate(" + (width / 2.5 + 80) + " ," + -20 + ")")
     .style("text-anchor", "middle")
     .style("font-weight", "700")
  	 .style("font-size","27px")
	 .style("font-family", "Tahoma")
  	 .style("fill","#3e494f")
     .text("Biocapacity vs. Ecological Footprint");
	
 for (var i=0; i<6; i++)
		{
		 var d = ['Asia','Europe','Africa','Latin America & the Caribbean','Oceania','North America'];
		 svg.append("rect")
		 	.attr("class", "reclegends")
			.attr("y", 200 + i * 20)
			.attr("x", 480)
			.attr("width", 15)
			.attr("height", 15)
			.style("fill", d3.schemePastel1[i]);


		svg.append("text")
	   	   .attr("y", 210 + i * 20)
	       .attr("x", 500)
	       .attr("class", "legends")
	       .style("text-anchor", "start")	
	       .style("font-family", "Tahoma")
		   .attr("font-weight", "bold")
		   .style("fill", d3.schemePastel1[i])
	       .style("font-size", "11px")
	       .text(d[i]);
		}
	

		svg.selectAll('.reclegends')
			   .on('click',function(){
				if(d3.select(this).attr("stroke-width") != 3){
					var color = d3.select(this).style("fill");
					flag = true;
					 d3.select(this)
					  .attr("stroke-width", 3)
					  .attr("stroke", color)
					  .style("fill","white");
					if(d3.select(this).attr("stroke") === 'rgb(251, 180, 174)'){
						d3.select("#chart").selectAll('.dot').filter(function(d){ 
							return d.UN_region === 'Asia';
						  }).style("opacity", 0.1);
						d3.select("#parallel").selectAll('.pathline').filter(function(d){ 
							return d.UN_region === 'Asia';
						  }).style("opacity", 0.1);
						d3.select("#arc").selectAll('.arc').filter(function(d){ 
							return d.region === 'Asia';
						  }).style("opacity", 0.1);
					   }
					else if(d3.select(this).attr("stroke") === 'rgb(179, 205, 227)'){
						d3.select("#chart").selectAll('.dot').filter(function(d){ 
							return d.UN_region === 'Europe';
						  }).style("opacity", 0.1);
						d3.select("#parallel").selectAll('.pathline').filter(function(d){ 
							return d.UN_region === 'Europe';
						  }).style("opacity", 0.1);
						d3.select("#arc").selectAll('.arc').filter(function(d){ 
							return d.region === 'Europe';
						  }).style("opacity", 0.1);
					   }
					else if(d3.select(this).attr("stroke") === 'rgb(204, 235, 197)'){
						d3.select("#chart").selectAll('.dot').filter(function(d){ 
							return d.UN_region === 'Africa';
						  }).style("opacity", 0.1);
						d3.select("#parallel").selectAll('.pathline').filter(function(d){ 
							return d.UN_region === 'Africa';
						  }).style("opacity", 0.1);
						d3.select("#arc").selectAll('.arc').filter(function(d){ 
							return d.region === 'Africa';
						  }).style("opacity", 0.1);
					   }
					else if(d3.select(this).attr("stroke") === 'rgb(222, 203, 228)'){
						d3.select("#chart").selectAll('.dot').filter(function(d){ 
							return d.UN_region === 'Latin America and the Caribbean';
						  }).style("opacity", 0.1);
						d3.select("#parallel").selectAll('.pathline').filter(function(d){ 
							return d.UN_region === 'Latin America and the Caribbean';
						  }).style("opacity", 0.1);
						d3.select("#arc").selectAll('.arc').filter(function(d){ 
							return d.region === 'Latin America and the Caribbean';
						  }).style("opacity", 0.1);
					   }
					else if(d3.select(this).attr("stroke") === 'rgb(254, 217, 166)'){
						d3.select("#chart").selectAll('.dot').filter(function(d){ 
							return d.UN_region === 'Oceania';
						  }).style("opacity", 0.1);
						d3.select("#parallel").selectAll('.pathline').filter(function(d){ 
							return d.UN_region === 'Oceania';
						  }).style("opacity", 0.1);
						d3.select("#arc").selectAll('.arc').filter(function(d){ 
							return d.region === 'Oceania';
						  }).style("opacity", 0.1);
					   }
					else if(d3.select(this).attr("stroke") === 'rgb(255, 255, 204)'){
						d3.select("#chart").selectAll('.dot').filter(function(d){ 
							return d.UN_region === 'North America';
						  }).style("opacity", 0.1);
						d3.select("#parallel").selectAll('.pathline').filter(function(d){ 
							return d.UN_region === 'North America';
						  }).style("opacity", 0.1);
						d3.select("#arc").selectAll('.arc').filter(function(d){ 
							return d.region === 'North America';
						  }).style("opacity", 0.1);
					   }
					console.log(color);
					}
				else{
					flag = false;
					if(d3.select(this).attr("stroke") === 'rgb(251, 180, 174)'){
					d3.select(this)
					  .attr("stroke-width", 0)
					  .style("fill",d3.schemePastel1[0]);
					d3.select("#chart").selectAll('.dot').filter(function(d){ 
							return d.UN_region === 'Asia';
						  }).style("opacity", 0.6);
					d3.select("#parallel").selectAll('.pathline').filter(function(d){ 
							return d.UN_region === 'Asia';
						  }).style("opacity", 0.6);
					d3.select("#arc").selectAll('.arc').filter(function(d){ 
							return d.region === 'Asia';
						  }).style("opacity", 0.8);
					}
					else if(d3.select(this).attr("stroke") === 'rgb(179, 205, 227)'){
					    d3.select(this)
					      .attr("stroke-width", 0)
					      .style("fill",d3.schemePastel1[1]);
						d3.select("#chart").selectAll('.dot').filter(function(d){ 
							return d.UN_region === 'Europe';
						  }).style("opacity", 0.6);
						d3.select("#parallel").selectAll('.pathline').filter(function(d){ 
							return d.UN_region === 'Europe';
						  }).style("opacity", 0.6);
						d3.select("#arc").selectAll('.arc').filter(function(d){ 
							return d.region === 'Europe';
						  }).style("opacity", 0.8);
					   }
					else if(d3.select(this).attr("stroke") === 'rgb(204, 235, 197)'){
					    d3.select(this)
					      .attr("stroke-width", 0)
					      .style("fill",d3.schemePastel1[2]);
						d3.select("#chart").selectAll('.dot').filter(function(d){ 
							return d.UN_region === 'Africa';
						  }).style("opacity", 0.6);
						d3.select("#parallel").selectAll('.pathline').filter(function(d){ 
							return d.UN_region === 'Africa';
						  }).style("opacity", 0.6);
						d3.select("#arc").selectAll('.arc').filter(function(d){ 
							return d.region === 'Africa';
						  }).style("opacity", 0.8);
					   }
					else if(d3.select(this).attr("stroke") === 'rgb(222, 203, 228)'){
					    d3.select(this)
					      .attr("stroke-width", 0)
					      .style("fill",d3.schemePastel1[3]);
						d3.select("#chart").selectAll('.dot').filter(function(d){ 
							return d.UN_region === 'Latin America and the Caribbean';
						  }).style("opacity", 0.6);
						d3.select("#parallel").selectAll('.pathline').filter(function(d){ 
							return d.UN_region === 'Latin America and the Caribbean';
						  }).style("opacity", 0.6);
						d3.select("#arc").selectAll('.arc').filter(function(d){ 
							return d.region === 'Latin America and the Caribbean';
						  }).style("opacity", 0.8);
					   }
					else if(d3.select(this).attr("stroke") === 'rgb(254, 217, 166)'){
					    d3.select(this)
					      .attr("stroke-width", 0)
					      .style("fill",d3.schemePastel1[4]);
						d3.select("#chart").selectAll('.dot').filter(function(d){ 
							return d.UN_region === 'Oceania';
						  }).style("opacity", 0.6);
						d3.select("#parallel").selectAll('.pathline').filter(function(d){ 
							return d.UN_region === 'Oceania';
						  }).style("opacity", 0.6);
						d3.select("#arc").selectAll('.arc').filter(function(d){ 
							return d.region === 'Oceania';
						  }).style("opacity", 0.8);
					   }
					else if(d3.select(this).attr("stroke") === 'rgb(255, 255, 204)'){
					    d3.select(this)
					      .attr("stroke-width", 0)
					      .style("fill",d3.schemePastel1[5]);
						d3.select("#chart").selectAll('.dot').filter(function(d){ 
							return d.UN_region === 'North America';
						  }).style("opacity", 0.6);
						d3.select("#parallel").selectAll('.pathline').filter(function(d){ 
							return d.UN_region === 'North America';
						  }).style("opacity", 0.6);
						d3.select("#arc").selectAll('.arc').filter(function(d){ 
							return d.region === 'North America';
						  }).style("opacity", 0.8);
					   }
					console.log(color);
					}
				
				});

});

}