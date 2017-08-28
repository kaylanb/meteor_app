import React from 'react';
import ReactDOM from 'react-dom';
// import sizeMe from 'react-sizeme';

class LineChart extends React.Component {
  render() {
      //const { width } = this.props.size;
      const width = 600;
      const height = 300;

      var margin = {top: 5, right: 50, bottom: 20, left: 50},
          w = width - (margin.left + margin.right),
          h = height - (margin.top + margin.bottom);

      var transform='translate(' + margin.left + ',' + margin.top + ')';

      var xScale = d3.time.scale()
          .domain(d3.extent(this.props.data, function (d) {
              return d.x;
          }))
          .rangeRound([0, w]);

      var yScale = d3.scale.linear()
          .domain([0,d3.max(this.props.data,function(d){
              return d.y+100;
          })])
          .range([h, 0]);
      
      var line = d3.svg.line()
          .x(function (d) {
              return xScale(d.x);
          })
          .y(function (d) {
              return yScale(d.y);
          }).interpolate('cardinal');

      var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient('left')
          .ticks(5);

      var xAxis = d3.svg.axis()
         .scale(xScale)
         .orient('bottom')
         .tickValues(this.props.data.map(function(d,i){
             if(i>0)
                 return d.x;
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
              <svg id={this.props.chartId} width={width} height={height}>

                  <g transform={transform}>
                      <path className="line shadow" 
                            d={line(this.props.data)} strokeLinecap="round"/>
                      <Dots data={this.props.data} 
                            xScale={xScale} yScale={yScale}/>
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
  size: React.PropTypes.shape({
    width: React.PropTypes.number,
  }),
  chartId: React.PropTypes.string,
  data:React.PropTypes.array,
};

// LineChart.defaultProps = {
//   width: 600,
//   height: 300,
//   chartId: 'v1_chart',
// };

class Dots extends React.Component {
    
    render() {
        // scope
        var _self=this;
 
        console.log("_self=",_self);
        var circles= $.map(_self.props.data,function(d,i) {
            console.log('data: d=',d);
            return (<circle className="dot" 
                      r="7" 
                      cx={_self.props.xScale(d.x)} 
                      cy={_self.props.yScale(d.y)} 
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

// export default sizeMe()(LineChart)
export default LineChart
