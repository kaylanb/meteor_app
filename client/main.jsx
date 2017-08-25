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
    render() {
        return (
            <div>
                <h3>Visitors to your site</h3>
                <div className="bottom-right-svg">
                    <LineChart/>
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

class Pages extends React.Component {
  // Returns the top level html to render each page
  getPlotSvg() {
    if (this.props.page == 1) {
      var html = <Visitors />;
    } else if (this.props.page == 2) {
      var cx = 200;
      var html = <BasicSvg width="400" height="400" cx={cx} />;
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
