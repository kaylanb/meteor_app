import React from 'react';
import ReactDOM from 'react-dom';

class LineChart extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        width: this.props.width
      };
    }

    render() {
        var data=[
            {day:'02-11-2016',count:180},
            {day:'02-12-2016',count:250},
            {day:'02-13-2016',count:150},
            {day:'02-14-2016',count:496},
            {day:'02-15-2016',count:140},
            {day:'02-16-2016',count:380},
            {day:'02-17-2016',count:100},
            {day:'02-18-2016',count:150}
        ];

        var margin = {top: 5, right: 50, bottom: 20, left: 50},
            w = this.state.width - (margin.left + margin.right),
            h = this.props.height - (margin.top + margin.bottom);

        var transform='translate(' + margin.left + ',' + margin.top + ')';

        var parseDate = d3.time.format("%m-%d-%Y").parse;

        data.forEach(function (d) {
            d.date = parseDate(d.day);
        });

        var xScale = d3.time.scale()
            .domain(d3.extent(data, function (d) {
                return d.date;
            }))
            .rangeRound([0, w]);

        var yScale = d3.scale.linear()
            .domain([0,d3.max(data,function(d){
                return d.count+100;
            })])
            .range([h, 0]);
        
        var line = d3.svg.line()
            .x(function (d) {
                return xScale(d.date);
            })
            .y(function (d) {
                return yScale(d.count);
            }).interpolate('cardinal');

        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .ticks(5);
 
        var xAxis = d3.svg.axis()
           .scale(xScale)
           .orient('bottom')
           .tickValues(data.map(function(d,i){
               if(i>0)
                   return d.date;
           }).splice(1))
           .ticks(4);
         
        var yGrid = d3.svg.axis()
           .scale(yScale)
           .orient('left')
           .ticks(5)
           .tickSize(-w, 0, 0)
           .tickFormat("");

        return (
            <div>
                <svg id={this.props.chartId} width={this.state.width} height={this.props.height}>

                    <g transform={transform}>
                        <path className="line shadow" d={line(data)} strokeLinecap="round"/>
                        <Dots data={data} xScale={xScale} yScale={yScale}/>
                        <Grid h={h} grid={yGrid} gridType="y"/>
                        <Axis h={h} axis={yAxis} axisType="y" />
                        <Axis h={h} axis={xAxis} axisType="x"/>
                    </g>
                </svg>
            </div>
        );
    }
};
LineChart.propTypes = {
  width:React.PropTypes.number,
  height:React.PropTypes.number,
  chartId:React.PropTypes.string
};

LineChart.defaultProps = {
  width: 400,
  height: 300,
  chartId: 'v1_chart'
};

class Dots extends React.Component {
    
    render() {
        // scope
        var _self=this;
 
        //remove last & first point
        var data=this.props.data.splice(1);
        data.pop();
 
        var circles=data.map(function(d,i){
 
            return (<circle className="dot" 
                      r="7" 
                      cx={_self.props.xScale(d.date)} 
                      cy={_self.props.yScale(d.count)} 
                      fill="#7dc7f4"
                      stroke="#3f5175" 
                      strokeWidth="5px" 
                      key={i}/>);
        });
 
        return(
            <g>
                {circles}
            </g>
        );
    }
};
Dots.propTypes =  {
  data:React.PropTypes.array,
  xScale:React.PropTypes.func,
  yScale:React.PropTypes.func
};

class Axis extends React.Component {
    renderAxis() {
        var node = ReactDOM.findDOMNode(this);
        d3.select(node).call(this.props.axis);
    }

    componentDidUpdate() { this.renderAxis(); }
    componentDidMount() { this.renderAxis(); }

    render() {
        var translate = "translate(0,"+(this.props.h)+")";
 
        return (
            <g className="axis" 
               transform={this.props.axisType=='x'?translate:""} >
            </g>
        );
    }
 
};
Axis.propTypes = {
  h:React.PropTypes.number,
  axis:React.PropTypes.func,
  axisType:React.PropTypes.oneOf(['x','y'])
};

class Grid extends React.Component {
    renderGrid() {
        var node = ReactDOM.findDOMNode(this);
        d3.select(node).call(this.props.grid);
 
    }

    componentDidUpdate() { this.renderGrid(); }
    componentDidMount() { this.renderGrid(); }

    render() {
        var translate = "translate(0,"+(this.props.h)+")";
        return (
            <g className="y-grid" 
               transform={this.props.gridType=='x'?translate:""}>
            </g>
        );
    }
 
};
Grid.propTypes = {
  h:React.PropTypes.number,
  grid:React.PropTypes.func,
  gridType:React.PropTypes.oneOf(['x','y'])
};

export default LineChart;
