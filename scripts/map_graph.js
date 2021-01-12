
function setmap(year){

function draw(geo_data) {
       var margin = 10,
            width = 970 - margin,
            height = 660 - margin;
	 	var color = d3.scaleThreshold()
		.domain([500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
		.range(["rgb(221, 221, 221)", "rgb(255, 223, 219)", "rgb(255, 195, 183)", "rgb(255, 164, 145)", "rgb(255, 139, 114)", "rgb(255, 112, 81)", "rgb(255, 91, 56)", "rgb(255, 73, 33)"]);
	 
	 
//	    var color = d3.scaleLinear().domain([1000000,1500000000]).range([d3.interpolateRdPu(0.05), d3.interpolateRdPu(0.55)]);
	 
//		.domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
//		.range(["rgb(252,244,241)", "rgb(249,225,216)", "rgb(233,198,184)", "rgb(240,185,163)", "rgb(220,130,95)", "rgb(225,135,100)", "rgb(233,130,90)", "rgb(236,125,81)", "rgb(240,106,53)", "rgb(252,91,54)"]);
	 
        var svg2 = d3.select("#map")
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .attr('class', 'map')
		    .attr("transform", "translate(" + 0 + "," + 0 + ")");

        var projection = d3.geoMercator()
                               .scale(150)
                               .translate( [width / 2 + 400, height / 1.5]);

        var path = d3.geoPath().projection(projection);
	 	d3.csv("./data/NFA_2018.csv", function(error, data) {
			
			
			data = data.filter(function(row){
				return row.year === year && row.country !== 'World';
    		});

			var tooltip = d3.select("body")
				.append("div")
				.attr("class","tooltip_map")
  			    .style('display', 'none');
			
			var populationById = {};

  			data.forEach(function(d) { populationById[d['ISO alpha-3 code']] = +d.population; });
			populationById.TWN = 0;
			populationById.FLK = 0;
			populationById.GRL = 0;
			populationById.ATA = 0;
			populationById.ATF = 0;
			populationById.ISL = 0;
			populationById.NCL = 0;
			populationById.PRI = 0;
			populationById.SDS = 0;
			populationById.PSE = 0;
			populationById.SAU = 0;
			populationById['-99'] = 0;
  			geo_data.features.forEach(function(d) { d.population = populationById[d.id]; });
			
		var temp;
			
        var map = svg2.selectAll('path')
                     .data(geo_data.features)
                     .enter()
                     .append('path')
                     .attr('d', path)
                     .style('fill', function(d) { return color(populationById[d.id]); })
                     .style('stroke', 'white')
					 .style("opacity", 0.7)
		             .style("stroke-opacity", 0.6)
                     .style('stroke-width', 1)
					 .on('mousemove',function(d){
						 if(d3.select(this).style("fill") != '#f74b42'){
					  d3.select(this)
						.style("stroke-opacity", 1)
						.style("stroke","white")
						.style("stroke-width",3);
							 }
					  })
					.on('mouseout', function(d){
						if(d3.select(this).style("fill") != '#f74b42'){
							d3.select(this)
							.style("stroke-opacity", 0.6)
							.style("stroke","white")
							.style("stroke-width",1);
						}
					  })
					.on("click", function(d) {
						
					  if((d3.select(this).style("opacity") == 0.7) && (tooltip.style('display') == 'none')){
						  //tempcolor = svg2.selectAll('path').style("fill");
						  d3.select(this).style("fill", '#a53c38').style("opacity", 1);
//						  d3.select(this).style("opacity", 1);
						  tooltip.style('display', 'block');
						  tooltip.style("left", (d3.event.pageX) - 120 + "px");
						  tooltip.style("top", (d3.event.pageY) - 90 + "px");
						  if (d.population === 0){d.population = NaN;}
						  fix_population = d3.format(",")(d.population);
						  tooltip.html("<strong>" + "<font color = #ff9635 size = 5>" + d.properties.name + "</font>" + "</strong>" + "<br/>" + "<hr/>" + "<strong><font color = #ff9635>Population: </font></strong>" + fix_population);
						  showplot(d.population);
						  //showpath(d.population);
						  temp = d.population;
						  }
					  else{
						  svg2.selectAll('path').style("opacity", 0.7).style('fill', function(d) { return color(populationById[d.id]); });
						  tooltip.style('display', 'none');
						  
						  showback(temp);
					  }
						
					});
		});
	}

d3.json("./data/world_countries.json", draw);

}
var tooltip2 = d3.select("body")
				.append("div")
				.attr("class","tooltip_plot")
				.style('display', 'none');

 var originalsize;
 function showplot(p) {
	 d3.select("#chart").selectAll('.dot').style("opacity", 0.2);
	 originalsize = d3.select("#chart").select('#population' + p).attr("r");
	 d3.select("#chart").select('#population' + p)
		 .style("opacity", 1)
	     .style("stroke", "white")
         .style("stroke-width", 5)
		 .attr("r", 22);
	 tooltip2.style('display', 'block');
	 tooltip2.html("<strong><font color = #ced8e5 size = 3>Percapita GDP: </font></strong>" + "<font color = #fcad79 size = 3>" + '$' + d3.format(",")(d3.select("#chart").select('#population' + p).attr("gdp")) + "</font>" + "<br/>" + "<hr/>" + "<strong><font color = #ced8e5 size = 3>EFConsTotGHA: </font></strong>" + "<font color = #fcad79 size = 3>" + d3.format(",")(d3.select("#chart").select('#population' + p).attr("EFCons")) + "</font>" + "<br/>" + "<strong><font color = #ced8e5 size = 3>BiocapTotGHA: </font></strong>" + "<font color = #fcad79 size = 3>" + d3.format(",")(d3.select("#chart").select('#population' + p).attr("Biocap")) + "</font>");
	 var r = d3.select("#chart").select('#population' + p).attr("region");
	 var c = d3.select("#chart").select('#population' + p).attr("country");
	 //showpath(c);
	 showarc(r, c);
	 //showpath(svg.select('#population' + p).attr("region"));
 }


 function showback(p) {
	 d3.select("#chart").select('#population' + p)
		 .attr("r", originalsize)
		 .style("stroke-width", 0);
	 d3.select("#chart").selectAll('.dot')
		 .style("opacity", 0.6);
	 showarcback();
	 tooltip2.style('display', 'none');
 }


 function showarc(r,c) {
	 d3.select("#arc").selectAll('.arc').style("opacity", 0.2);
	 d3.select("#arc").selectAll('.arc').filter(function(d){ 
    return d.region === r;
  }).style("opacity", 1)
		 .attr('stroke-opacity', 1)
		 .style("stroke", "white")
         .style("stroke-width", 3);
	 showpath(c);
	 }


function showarcback() {
	 d3.select("#arc").selectAll('.arc').style("opacity", 0.8).attr('stroke-opacity', 0);
	 showpathback();
	 }



function showpath(c) {
	 d3.select("#parallel").selectAll('.pathline').style("opacity", 0.1).style("stroke-width", 2);
	 d3.select("#parallel").selectAll('.pathline').filter(function(d){ 
    	return d.country === c;
  		}).style("opacity", 1).style("stroke-width", 6);
}

function showpathback() {
	 d3.select("#parallel").selectAll('.pathline').style("opacity", 0.6).style("stroke-width", 3);
}