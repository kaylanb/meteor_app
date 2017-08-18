//npm install
// import d3 from 'd3';
//atmosphere
import { d3 } from 'meteor/d3js:d3';

import './plotGeo.css';
import './plotGeo.html';

Template.plotGeo.onRendered(function() {
// <script type="text/javascript">
  var width = 960,
      height = 600;

  var projection = d3.geo.bottomley()
      .scale(170)
      .translate([width / 2, height / 2])
      .precision(0.2);

  var path = d3.geo.path()
      .projection(projection);

  var graticule = d3.geo.graticule();

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.append("defs").append("path")
      .datum({type: "Sphere"})
      .attr("id", "sphere")
      .attr("d", path);

  svg.append("use")
      .attr("class", "stroke")
      .attr("xlink:href", "#sphere");

  svg.append("use")
      .attr("class", "fill")
      .attr("xlink:href", "#sphere");

  svg.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);

  d3.json("/mbostock/raw/4090846/world-50m.json", function(error, world) {
    if (error) throw error;

    svg.insert("path", ".graticule")
        .datum(topojson.feature(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path);

    svg.insert("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
  });
// </script>
});




