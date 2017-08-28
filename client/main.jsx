import React from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { mount } from 'react-mounter';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tiles } from '../imports/db.js';
import { ZPT } from '../imports/db.js';
import LineChart from '../imports/LineChart.jsx';


class Visitors extends React.Component {
    object_to_array(obj) {
      var arr = $.map(obj, function(value, index) {
          return [value];
        });
      return (arr);
    }

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

        var x=[];
        var y=[];
        for (i=0; i < data.length; i++) {
          x.push( data[i].date );
          y.push( data[i].count );
        }

        // var dataXY = {x: this.object_to_array(x), 
                      // y: this.object_to_array(y)};
        // var dataXY = {x: x, 
                      // y: y};
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

class PlotZpts extends React.Component {
    render() {
        var zpts =  ZPT.find({}, {limit: 10}).fetch();

        return (
            <div>
                <h3>Zeropoint Data</h3>
                <div className="bottom-right-svg">
                    <LineChart
                      data={zpts} 
                      chartId='v1_chart'/>
                </div>
            </div>
        )
    }
};

class Pages extends React.Component {
  // Returns the top level html to render each page
  getPlotSvg() {
    if (this.props.page == 1) {
      var html = <Visitors />;
    } else if (this.props.page == 2) {
      var html = <Visitors />;
    } else {
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

// const App = createContainer(() => {
//   zpts =  ZPT.find({}, {limit: 10}).fetch();
//   //one = ZPT.findOne({}).fetch();
//   //for (var i = 0; i < zpts.length; i++) {
//   //  console.log('i=',i);
//   //  console.log('zpts[i]=',zpts[i]['nmatch']);
//   //}

//   var x = [];
//   var y = [];
//   console.log('zpts',zpts)
//   for (var i = 0; i < zpts.length; i++) {
//     x.push(zpts[i]["mjd_obs"]);
//     y.push(zpts[i]["nmatch"]);
//   }
//   console.log('mjd_obs:',x)
//   return {
//     data: {x: x,  y: y},
//     zpts: zpts,
//   };
// }, AppComponent);

 
FlowRouter.route("/", {
  name: "main",
  action: function() {
    //mount(App);
    mount(AppComponent);
  },
});
