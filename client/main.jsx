import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { mount } from 'react-mounter';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tiles } from '../imports/db.js';
import { ZPT } from '../imports/db.js';

function D3(data) {
  console.log('x=',data.x);
  console.log('y=',data.y);

  //var test_data = [[5,3], [10,17], [15,4], [2,8]];
  //console.log('test_data[0]',test_data[0]);
  //console.log('test_data[1]',test_data[1]);
  //var xdom= [0, d3.max(test_data, function(d) { return d[0]; })]
  //console.log('xdom',xdom);

  var margin = {top: 20, right: 15, bottom: 60, left: 60}
  var width = 300 - margin.left - margin.right
  var height = 300 - margin.top - margin.bottom;
  //console.log('margin',margin)
  var svgContainer = d3.select('#page-1')
                       .append('svg')
                       .attr('width', width + margin.right + margin.left)
                       .attr('height', height + margin.top + margin.bottom)
                       .attr('class', 'chart')
                       .style("border", "1px solid black");

  var mainGroup = svgContainer.append('g')
                              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                              .attr('width', width)
                              .attr('height', height)
                              .attr('class', 'main')   
  
  var xScale = d3.scale.linear()
                 .domain([0, d3.max(data.x)])
                 .range([ 0, width ]);

  var yScale = d3.scale.linear()
                 .domain([0, d3.max(data.y)])
                 .range([ height, 0 ]);

  // draw the x axis
  var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom');

  // draw the y axis
  var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left');


  var xAxisGroup = svgContainer.append('g')
                               .attr('transform', 'translate(0,' + height + ')')
                               .attr('class', 'main axis date')
                               .call(xAxis);

  var yAxisGroup = svgContainer.append('g')
                               .attr('transform', 'translate(0,0)')
                               .attr('class', 'main axis date')
                               .call(yAxis);

  var circleGroup = svgContainer.append("g"); 

  var xvals= []
  console.log('data',data);
  for (i=0; i< data.x.length; i++) {
    xvals.push(xScale(data.x[i]));
  }
  console.log('xvals=',xvals);

  var circles = circleGroup.selectAll("circle")
                           .data(data)
                           .enter()
                           .append("circle")

  var circleAttrib = circles
                     .attr("cx", function (d) { return xScale(d.x); } )
                     .attr("cy", function (d) { return yScale(d.y); } )
                     .attr("r", 5000)
                     .style("fill","blue");
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
  zpts =  ZPT.find({}, {limit: 10}).fetch();
  //one = ZPT.findOne({}).fetch();
  //for (var i = 0; i < zpts.length; i++) {
  //  console.log('i=',i);
  //  console.log('zpts[i]=',zpts[i]['nmatch']);
  //}

  var x = [];
  var y = [];
  console.log('zpts',zpts)
  for (var i = 0; i < zpts.length; i++) {
    x.push(zpts[i]["mjd_obs"]);
    y.push(zpts[i]["nmatch"]);
  }
  console.log('mjd_obs:',x)
  return {
    data: {x: x,  y: y},
    zpts: zpts,
  };
}, AppComponent);

 
FlowRouter.route("/", {
  name: "main",
  action: function() {
    mount(App);
  },
});
