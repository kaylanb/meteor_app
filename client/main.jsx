import React from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { mount } from 'react-mounter';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
//import { Tiles } from '../imports/db.js';
import { ZPT } from '../imports/db.js';
import LineChart from '../imports/LineChart.jsx';

import Plot from '../imports/Plot.js';

import createPlotlyComponent from 'react-plotly.js/factory';


class Visitors extends React.Component {
    render() {
        var data = [{day:'02-11-2016',count:180},
                  {day:'02-12-2016',count:250},
                  {day:'02-13-2016',count:150},
                  {day:'02-14-2016',count:496},
                  {day:'02-15-2016',count:140},
                  {day:'02-16-2016',count:380},
                  {day:'02-17-2016',count:100},
                  {day:'02-18-2016',count:150}
                  ];
        var parseDate = d3.time.format("%m-%d-%Y").parse;
        data.forEach(function (d) {
         d.date = parseDate(d.day);
        });

        // data needs to be [{x:val,y:val},{x:val2,y:val2}]
        var dataXY = [];
        for (var i=0; i < data.length; i++) {
          dataXY.push( {x:data[i].date, y:data[i].count} );
        }
        console.log('dataXY=',dataXY);

        return (
            <div>
                <h3>Visitors to your site</h3>
                <div className="bottom-right-svg">
                    <LineChart data={dataXY} chartId='v1_chart'/>
                </div>
            </div>
        )
    }
};


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

class PlotZpts extends React.Component {
    render() {
        var zpts =  ZPT.find({}, {limit: 25}).fetch();
        console.log('zpts=',zpts);

        // data needs to be [{x:val,y:val},{x:val2,y:val2}]
        var data = [];
        for (var i=0; i < zpts.length; i++) {
          data.push( {x:zpts[i].zpt, y:zpts[i].nmatch} );
        }
        console.log('data=',data);

        return (
            <div>
                <h3>Zeropoint Data</h3>
                <div className="bottom-right-svg">
                    <LineChart data={data} chartId='v1_chart'/>
                </div>
            </div>
        )
    }
};

class ShowData extends React.Component {
  //https://academy.plot.ly/react/3-with-plotly/
  // constructor() {
  //   super();

  //   var x = []; //[1,2,3,4];
  //   var y = []; //[1,4,9,16];
  //   for (var i = 0; i < 5; i++) {
  //     console.log('i=',i,'x=',x);
  //     x.push(i); //zpts[i]['zpt']);
  //     y.push(i*i) //zpts[i]['nmatch']);
  //   }
  //   var self = this
  //   self.state = {
  //     x: x,
  //     y: y
  //   };

  //   console.log('x=',this.state.x)
  // }
  //var zpts =  ZPT.find({}).fetch();
  state = {
    x: [1,2,3,4],
    y: [1,4,9,16]
  };
  render() {
    return (
      <div>
        <h1>My Plot</h1>
          <Plot x={this.state.x} y={this.state.y} type="scatter"/>
      </div>
    );
  }
}



class Pages extends React.Component {
  // Returns the top level html to render each page
  getPlotSvg() {
    if (this.props.page == 1) {
      //var html = <PlotZpts />;
      var html = <ShowData/>;
    } else if (this.props.page == 2) {
      var html = <Visitors />;
    } else if (this.props.page == 3) {
      var cx = 300;
      var html = <BasicSvg width="400" height="400" cx={cx} />;
    }
    return ( html );
  }

  render() {
    var page_id = "page-" + this.props.page;
    
    return (
      <div className="page" id={page_id}>page {this.props.page}
        {this.getPlotSvg()}
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
  Meteor.subscribe("zpt", 25);
  console.log('HERE I AM')
  zpts =  ZPT.find({}).fetch();
  console.log('App: zpts=',zpts);
  //one = ZPT.findOne({}).fetch();
  for (var i = 0; i < zpts.length; i++) {
   console.log('zpts[',i,']=',zpts[i]['nmatch']);
  }

  // var x = [];
  // var y = [];
  // console.log('zpts',zpts)
  // for (var i = 0; i < zpts.length; i++) {
  //   x.push(zpts[i]["mjd_obs"]);
  //   y.push(zpts[i]["nmatch"]);
  // }
  // console.log('mjd_obs:',x)
  return {
    // data: {x: x,  y: y},
    zpts: zpts,
  };
}, AppComponent);

FlowRouter.route("/", {
 name: "main",
 action: function() {
   mount(App);
 },
});
