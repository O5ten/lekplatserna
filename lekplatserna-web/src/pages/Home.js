import React, { Component } from 'react';
import './Home.css';
import ResultSet from '../components/ResultSet';
import SearchCity from '../components/SearchCity';
import PlaygroundService from '../services/PlaygroundService';

class Home extends Component {

  constructor(){
    super();
    this.state = {
        locationSelected: false,
        playgrounds: [],
        message: ""
    }
  }

  findPlaygroundsInProximity() {
    return navigator.geolocation.getCurrentPosition(this.fetchPlaygroundsByLocation.bind(this));
  }

  fetchPlaygroundsByLocation(location) {
    if(location){
        PlaygroundService.fetchPlaygroundsByLocation({
            lon: location.lon || location.coords.longitude,
            lat: location.lat || location.coords.latitude
        }).then((playgrounds) => this.setState({
            locationSelected: true,
            playgrounds: playgrounds,
            message: !!location.lon ?
            `Lekplatser i ${location.label} (${playgrounds.length} stycken)`:
            `Lekplatser nära dig (${playgrounds.length} stycken)`
        }));
    }
  }
  
  render() {
    return (
      <div className="Home">
        <div className="Home-header">
            <div className="Home-Header-Text"><label><i className="fa fa-child"/>LEKPLATSERNA<i className="fa fa-child"/></label></div>
            <div>Ett register med lekplatser för dig som behöver hitta en snabbt</div>
        </div>
        <div className="Home-activity-area">
            <button className="Home-activity-area-proximity button" onClick={() => this.findPlaygroundsInProximity()}>Använd enhetens plats</button>
            <p className="Home-activity-area-or">eller</p>
            <center>
                <SearchCity className="Home-activity-area-search" onCitySelected={this.fetchPlaygroundsByLocation.bind(this)} />
            </center>
        </div>
        { this.state.locationSelected &&
            (<div className="Home-activity-resultset">
                <ResultSet message={this.state.message} playgrounds={this.state.playgrounds}/>
            </div>)
        }
      </div>
    );
  }
}

export default Home;
