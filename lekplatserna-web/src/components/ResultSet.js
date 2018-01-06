import React, { Component } from 'react';
import './ResultSet.css';
import ResultSetItem from './ResultSetItem';

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
    if(location){
        fetch(`/api/playground/at/${location.lat}/${location.lon}/within/1/km`)
            .then((response) => {
              return response.json();
            }).then((playgrounds) => {
              this.setState(Object.assign({}, this.state, {
                message: "Lekplatser inom en kilometer från dig (" + playgrounds.length + " stycken)",
                playgrounds: playgrounds
              }));
              this.scrollToResultSet();
            });
    }
  }

  fetchEntriesByCity(city) {
    if(city){
        fetch(`/api/playground/at/${city.lat}/${city.lon}/within/3/km`)
            .then((response) => {
              return response.json();
            }).then((playgrounds) => {
              this.setState(Object.assign({}, this.state, {
                message: "Lekplatser i närheten av " + city.label + "(" + playgrounds.length + " stycken)",
                playgrounds: playgrounds
              }));
              this.scrollToResultSet();
            });
    }
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
