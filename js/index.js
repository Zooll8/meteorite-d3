"use strict";

var width = 800;
var height = 500;
var div = d3.select(".tooltip").style("opacity", 0);

var svg = undefined;
d3.json('https://d3js.org/world-110m.v1.json', function (geo) {
   var countries = topojson.feature(geo, geo.objects.countries).features;

   var projection = d3.geoMercator().translate([width / 2, height / 2]).scale(130);

   var path = d3.geoPath().projection(projection);

   var svg = d3.select('.render').append('svg').attr('width', width).attr('height', height).append('g');

   svg.selectAll('.country').data(countries).enter().append('path').attr('class', 'country').attr('d', path);
   var color = d3.scaleOrdinal(d3.schemeCategory10);
   d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json', function (meteors) {
      svg.selectAll('.meteor').data(meteors.features.filter(function (m) {
         return m.geometry;
      })).enter().append('circle').attr('r', function (d) {
         if (d.properties.mass > 7000000) {
            return 35;
         } else if (d.properties.mass > 2000000) {
            return 25;
         } else if (d.properties.mass > 1000000) {
            return 12;
         } else if (d.properties.mass > 100000) {
            return 6;
         } else {
            return 2;
         }
      }).attr('cy', function (d) {
         var coords = projection(d.geometry.coordinates);
         return coords[1];
      }).attr('cx', function (d) {
         var coords = projection(d.geometry.coordinates);
         return coords[0];
      }).style('fill', function () {
         var x = Math.floor(Math.random() * 10 + 1);
         return color(x);
      }).attr('class', 'meteor').on("mouseover", function (d) {
         d3.select(this).classed('meteor', false);
         d3.select(this).classed('meteorlol', true);
         div.transition().duration(100).style("opacity", .9);

         /*I loved so much an idea presenting tooltip as something as a 
                   ```
         {
         property:value 
         property1: value
         }
         ```   
         
         IT IS NOT my idea, all tributes to original author.*/
         div.html('&nbsp{<br/>' + '&nbsp&nbsp&nbspYear: ' + d.properties.year.slice(0, 4) + "<br/>" + '&nbsp&nbsp&nbspMass: ' + d.properties.mass + '<br/>&nbsp&nbsp&nbspName: ' + d.properties.name + '<br/>&nbsp&nbsp&nbspClass: ' + d.properties.recclass + '<br/>&nbsp}').style("left", d3.event.pageX + 10 + "px").style("top", d3.event.pageY - 30 + "px");
      }).on("mouseout", function (d) {
         d3.select(this).classed('meteorlol', false);
         d3.select(this).classed('meteor', true);
         div.transition().duration(100).style("opacity", 0);
      });
   });
});