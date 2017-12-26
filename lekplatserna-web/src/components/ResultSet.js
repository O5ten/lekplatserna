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

  fetchEntriesByCoordinates(location) {
    if(location){
        fetch(`/api/playground/at/${location.lat}/${location.lon}/within/2/km`)
            .then((response) => {
              return response.json();
            }).then((playgrounds) => {
              this.setState(Object.assign({}, this.state, {
                message: "Lekplatser i närheten av dig (" + playgrounds.length + " stycken)",
                playgrounds: playgrounds
              }));
            });
    }
  }

  fetchEntriesByCity(city) {
    if(city){
        fetch(`/api/playground/at/${city.lat}/${city.lon}/within/500/m`)
            .then((response) => {
              return response.json();
            }).then((playgrounds) => {
              this.setState(Object.assign({}, this.state, {
                message: "Lekplatser i närheten av " + city.label + "(" + playgrounds.length + " stycken)",
                playgrounds: playgrounds
              }));
            });
        this.setState({message: `Visa lista med lekplatser omkring: ${city.label} vid ${city.lat}, ${city.lon}`})
    }
  }

  render() {
    return (
      <div className="ResultSet">
        <h2 className="ResultSet-header">{this.state.message}</h2>
        <div className="ResultSet-list">
            {this.state.playgrounds.map(function(playground, i){
                return <ResultSetItem playground={playground} key={i}/>;
            })}
        </div>
      </div>
    );
  }
}

export default ResultSet;
