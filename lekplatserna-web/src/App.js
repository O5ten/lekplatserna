import React, { Component } from 'react';
import './App.css';
import ResultSet from './components/ResultSet';
import SearchCity from './components/SearchCity';

class App extends Component {

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
      <div className="App">
        <div className="App-header">
            <h1>Lekplatserna</h1>
            hitta en lekplats i närheten av dig
        </div>
        <div className="App-activity-area">
            <button className="App-activity-area-proximity app-button" onClick={() => this.findPlaygroundsInProximity()}>Använd enhetens plats</button>
            <p className="App-activity-area-or">eller</p>
            <center>
                <SearchCity
                    className="App-activity-area-search"
                    onCitySelected={this.onCitySeleted.bind(this)}
                />
            </center>
        </div>
        <div className="App-activity-resultset">
            <ResultSet ref="resultSet"/>
        </div>
      </div>
    );
  }
}

export default App;
