import React, { Component } from 'react';
import './Home.css';
import ResultSet from '../components/ResultSet';
import SearchCity from '../components/SearchCity';

class Home extends Component {

  findPlaygroundsInProximity(data) {
    return navigator.geolocation.getCurrentPosition(this.renderResultSet.bind(this));
  }

  renderResultSet(location) {
    this.refs.resultSet.fetchEntriesByCoordinates({
        lon: location.coords.longitude,
        lat: location.coords.latitude
    });
  }

  onCitySeleted(citySelected) {
    this.refs.resultSet.fetchEntriesByCity(citySelected);
  }

  render() {
    return (
      <div className="Home">
        <div className="Home-header">
            <h1>Lekplatserna</h1>
            Hitta lekplatserna i närheten
        </div>
        <div className="Home-activity-area">
            <button className="Home-activity-area-proximity location-button" onClick={() => this.findPlaygroundsInProximity()}>Använd enhetens plats</button>
            <p className="Home-activity-area-or">eller</p>
            <center>
                <SearchCity
                    className="Home-activity-area-search"
                    onCitySelected={this.onCitySeleted.bind(this)}
                />
            </center>
        </div>
        <div className="Home-activity-resultset">
            <ResultSet ref="resultSet"/>
        </div>
      </div>
    );
  }
}

export default Home;
