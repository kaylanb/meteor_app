import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { mount } from 'react-mounter';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tiles } from '../imports/db.js';

function D3(data) {
  console.log(data);

  // Set the dimensions of the canvas / graph
  var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = 600 - margin.left - margin.right,
      height = 270 - margin.top - margin.bottom;

  // Set the ranges
  var x = d3.time.scale().range([0, width]);
  var y = d3.scale.linear().range([height, 0]);

  // Define the axes
  var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

  var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

  // Define the line
  var valueline = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) { return y(d.y); });

  // Adds the svg canvas
  var svg = d3.select("#page-1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.x; }));
  y.domain([0, d3.max(data, function(d) { return d.y; })]);

  // Add the valueline path.
  svg.append("path")
  .attr("class", "line")
  .attr("d", valueline(data));

  // Add the scatterplot
  svg.selectAll("dot")
  .data(data)
  .enter().append("circle")
  .attr("r", 3.5)
  .attr("cx", function(d) { return x(d.x); })
  .attr("cy", function(d) { return y(d.y); });

  // Add the X Axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the Y Axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1
    };
  }

  render() {
    var content = null;

    if (this.state.page == 1) {
      D3(this.props.data);
      content = <div className="page" id="page-1">page 1</div>;
    }

    if (this.state.page == 2) {
      content = <div className="page" id="page-2">page 2</div>;
    }

    return (
      <div>
        <div id="bar">
        <button onClick={() => this.setState({page: 1})}>1</button>
        <button onClick={() => this.setState({page: 2})}>2</button>
        </div>
        {content}
      </div>
    );
  }
}

const App = createContainer(() => {
  tiles =  Tiles.find({}, {limit: 10}).fetch();

  var x = [];
  var y = [];

  for (var i = 0; i < tiles.length; i++) {
    x.push(tiles[i].RA);
    y.push(tiles[i].DEC);
  }

  return {
    data: {x: x,  y: y},
    tiles: tiles,
  };
}, AppComponent);

 
FlowRouter.route("/", {
  name: "main",
  action: function() {
    mount(App);
  },
});
