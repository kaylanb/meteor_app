import React from 'react';

class Plot extends React.Component {
  //https://academy.plot.ly/react/3-with-plotly/
  componentDidMount() {
    Plotly.newPlot('plot', [{
        x: this.props.x, //[1,2,3,4], //this.props.xData,
        y: this.props.y, //[1,2,3,4], //this.props.yData,
        type: this.props.type
      }]
    );
  };

  componentDidUpdate() {
    Plotly.newPlot('plot', [{
        x: this.props.x,
        y: this.props.y,
        type: this.props.type
      }]
    );
  };

  render() {
    return (
      <div id="plot"></div>
    );
  }
}
export default Plot;