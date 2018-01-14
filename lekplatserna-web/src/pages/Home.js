import React, { Component } from 'react';

import './Home.css';

import ResultSet from '../components/ResultSet';
import SearchCity from '../components/SearchCity';
import NewsFeed from '../components/NewsFeed';

import PlaygroundService from '../services/PlaygroundService';
import CityService from '../services/CityService';

class Home extends Component {

  constructor(){
    super();
    this.state = {
        distance: "500",
        unitOfMeasurement: "m",
        playgrounds: [],
        message: ""
    }
  }

  findPlaygroundsInProximity() {
    return navigator.geolocation.getCurrentPosition(this.fetchPlaygroundsByLocation.bind(this));
  }

  fetchPlaygroundsByLocation(location, distance, unitOfMeasurement) {
    if(location){
        distance = distance || this.state.distance;
        unitOfMeasurement = unitOfMeasurement || this.state.unitOfMeasurement;
        PlaygroundService.fetchPlaygroundsByLocation({
            lon: location.lon || location.coords.longitude,
            lat: location.lat || location.coords.latitude
        }, distance, unitOfMeasurement).then((playgrounds) => {
            this.setState(Object.assign({}, this.state, {
                location: location,
                playgrounds: playgrounds,
                distance: distance,
                unitOfMeasurement: unitOfMeasurement,
                message: !!location.lon ?
                    `Lekplatser i ${location.label} (${playgrounds.length} stycken)` :
                    `Lekplatser nära dig (${playgrounds.length} stycken)`
            }));
        });
    }
  }

  onDistanceSelection(value){
     let values = value.split(' ');
     this.fetchPlaygroundsByLocation(this.state.location, values[0], values[1]);
  }

  componentDidMount(){
    let cityName = this.props.location.pathname.substring(1);
    if(cityName.length > 0 && cityName.indexOf("/") === -1){
        document.title = "LEKPLATSERNA " + cityName.toUpperCase();
        CityService.fetchCityByName(cityName).then(city => city[0] && this.fetchPlaygroundsByLocation(city[0], this.state.distance, this.state.unitOfMeasurement));
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
            <button className="Home-activity-area-proximity button" onClick={this.findPlaygroundsInProximity.bind(this)}>Använd enhetens plats</button>
            <p className="Home-activity-area-or">eller</p>
            <center>
                <SearchCity className="Home-activity-area-search" onCitySelected={(city) => { this.props.history.push('/' + city.label); this.fetchPlaygroundsByLocation(city, this.state.distance, this.state.unitOfMeasurement)}} />
            </center>
        </div>
        { (!!this.state.location) ?
            (<div className="Home-activity-resultset">
                <ResultSet onDistanceSelection={this.onDistanceSelection.bind(this)} message={this.state.message} playgrounds={this.state.playgrounds}/>
            </div>) :
            (<NewsFeed/>)
        }
      </div>
    );
  }
}

export default Home;