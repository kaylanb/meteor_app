import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { mount } from 'react-mounter';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tiles } from '../imports/db.js';
import { ZPT } from '../imports/db.js';

var Dots=React.createClass({
    propTypes: {
        data:React.PropTypes.array,
        xScale:React.PropTypes.func,
        yScale:React.PropTypes.func
 
    },
    render:function(){
 
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
});

var LineChart=React.createClass({

    propTypes: {
        width:React.PropTypes.number,
        height:React.PropTypes.number,
        chartId:React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            width: 600,
            height: 300,
            chartId: 'v1_chart'
        };
    },
    getInitialState:function(){
        return {
            width:this.props.width
        };
    },
    render:function(){
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

        var transform='translate(' + margin.left + ',' + margin.top + ')';

        return (
            <div>
                <svg id={this.props.chartId} width={this.state.width} height={this.props.height}>

                    <g transform={transform}>
                        <path className="line shadow" d={line(data)} strokeLinecap="round"/>
                        <Dots data={data} xScale={xScale} yScale={yScale}/>
                    </g>
                </svg>
            </div>
        );
    }
});


var Visitors = React.createClass({
    render:function(){
        return (
            <div>
                <h3>Visitors to your site</h3>
                <div className="bottom-right-svg">
                    <LineChart/>
                </div>
            </div>
        )
    }
});

// ReactDOM.render(
//   <Visitors/>,
//   document.getElementById("top-line-chart")
// );


class BasicSvg extends React.Component {

  render() {
    return (
      <svg width={this.props.width} height={this.props.width}>
        <circle cx={this.props.cx} cy="20" r="20" fill="green" />
        <rect x="110" y="110" height="30" width="30" fill="blue" />
        <circle cx="70" cy="70" r="20" fill="purple" />
        <rect x="160" y="160" height="30" width="30" fill="red" />
      </svg>
    );
  }
}

class Pages extends React.Component {
  // Returns the top level html to render each page
  getPlotSvg() {
    if (this.props.page == 1) {
      var cx = 100;
    } else if (this.props.page == 2) {
      var cx = 200;
    } else {
      var cx = 300;
    }
    return ( <BasicSvg width="400" height="400" cx={cx} />  );
  }

  render() {
    var page_id = "page-" + this.props.page;
    
    return (
      <div className="page" id={page_id}>page {this.props.page}
        {this.getPlotSvg()}
        <Visitors />
      </div>
   );
  }
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1
    };
  }
 
  render() {
    //var page_id = "page-" + this.state.page;

    return (
      <div>
        <div id="bar">
        <button onClick={() => this.setState({page: 1})}>1</button>
        <button onClick={() => this.setState({page: 2})}>2</button>
        <button onClick={() => this.setState({page: 3})}>3</button>
        </div>
        <Pages page={this.state.page} />
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
