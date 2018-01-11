import React, { Component } from 'react';
import './ResultSet.css';
import ResultSetItem from './ResultSetItem';
import PlaygroundService from '../services/PlaygroundService';
class ResultSet extends Component {

  componentDidMount(){
    if(this.props.playgrounds.length > 0){
      this.scrollToResultSet();
    }
  }

  scrollToResultSet = () => {
      var resultSet = document.getElementsByClassName('Home-activity-resultset')[0];
      var resultSetLocation = resultSet.getBoundingClientRect().y;
      var initialY = document.body.scrollTop;
      var y = initialY + resultSetLocation;
      var baseY = (initialY + y) * 0.5;
      var difference = initialY - baseY;
      var startTime = performance.now();

      function step() {
          var normalizedTime = (performance.now() - startTime) / 500;
          if (normalizedTime > 1) normalizedTime = 1;

          window.scrollTo(0, baseY + difference * Math.cos(normalizedTime * Math.PI));
          if (normalizedTime < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
  }

  render() {
    return (
      <div className="ResultSet">
        <p className="ResultSet-Range">
            Avstånd
        </p>
        <h2 className="ResultSet-header">{this.props.message}</h2>
        <div className="ResultSet-list">
            {
                this.props.playgrounds.map(function(playground){
                    return <ResultSetItem playground={playground} key={playground.name}/>;
                })
            }
        </div>
      </div>
    );
  }
}

export default ResultSet;
