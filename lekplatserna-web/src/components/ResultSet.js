import React, { Component } from 'react';
import './ResultSet.css';
import ResultSetItem from './ResultSetItem';
import PlaygroundService from '../services/PlaygroundService';
class ResultSet extends Component {

  constructor() {
    super();
    this.state = {
      message: '',
      playgrounds: []
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

  fetchEntriesByCoordinates(location) {
    return PlaygroundService.fetchPlaygroundsByLocation(location, 1, 'km').then((playgrounds) => {
          this.setState(Object.assign({}, this.state, {
            message: "Lekplatser inom en kilometer från dig (" + playgrounds.length + " stycken)",
            playgrounds: playgrounds
          }));
          this.scrollToResultSet();
        });
  }

  fetchEntriesByCity(city) {
        return PlaygroundService.fetchPlaygroundsByLocation(city, 2, 'km').then((playgrounds) => {
          this.setState(Object.assign({}, this.state, {
            message: "Lekplatser i närheten av " + city.label + "(" + playgrounds.length + " stycken)",
            playgrounds: playgrounds
          }));
          this.scrollToResultSet();
        });
    }

  render() {
    return (
      <div className="ResultSet">
        <h2 className="ResultSet-header">{this.state.message}</h2>
        <div className="ResultSet-list">
            {
                this.state.playgrounds.map(function(playground, i){
                    return <ResultSetItem playground={playground} key={i}/>;
                })
            }
        </div>
      </div>
    );
  }
}

export default ResultSet;
