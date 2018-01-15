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
    this.setState(Object.assign({}, this.state, {
        distance: "500",
        unitOfMeasurement: "m"
    }));
    return navigator.geolocation.getCurrentPosition(
        this.fetchPlaygroundsByLocation.bind(this),
        this.handleLocationLookupFailed.bind(this)
    );
  }

  handleLocationLookupFailed(err) {
    console.log("Location lookup failed", err)
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
                    `${location.label} (${playgrounds.length})` :
                    `Nära dig (${playgrounds.length})`
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
    if(cityName.length === 0){
        this.findPlaygroundsInProximity();
    }
    if(cityName.length > 0 && cityName.indexOf("/") === -1){
        document.title = "LEKPLATSERNA " + cityName.toUpperCase();
        let radius = this.getRoughDistanceAndUnitByCity(cityName);
        CityService.fetchCityByName(cityName).then(city => city[0] && this.fetchPlaygroundsByLocation(city[0], radius.distance, radius.unitOfMeasurement));
    }
  }

  getRoughDistanceAndUnitByCity(cityName){
    let isSocken = cityName.toLowerCase().indexOf(' socken') !== -1;
    let isKommun = cityName.toLowerCase().indexOf(' kommun') !== -1;
    let isStad = cityName.toLowerCase().endsWith(" stad");
    if(isSocken || isKommun || isStad){
        return {
            distance: '50',
            unitOfMeasurement: 'km'
        };
    }else{
        return {
           distance: '500',
           unitOfMeasurement: 'm'
        };
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
            <button
                className="Home-activity-area-proximity button"
                onClick={this.findPlaygroundsInProximity.bind(this)}>
                Använd enhetens plats
            </button>
            <p className="Home-activity-area-or">eller</p>
            <center>
                <SearchCity
                    className="Home-activity-area-search"
                    onCitySelected={(city) => {
                        if(city){
                            let radius = this.getRoughDistanceAndUnitByCity(city.label);
                            this.props.history.push('/' + city.label);
                            this.fetchPlaygroundsByLocation(city, radius.distance, radius.unitOfMeasurement)
                        }
                    }}/>
            </center>
        </div>
        <div className="Home-activity-resultset">
            <ResultSet
                defaultDistance={{
                    value: this.state.distance + ' ' + this.state.unitOfMeasurement,
                    label: this.state.distance + ' ' + this.state.unitOfMeasurement
                }}
                onDistanceSelection={this.onDistanceSelection.bind(this)}
                message={this.state.message}
                playgrounds={this.state.playgrounds}/>
        </div>
        <NewsFeed/>
      </div>
    );
  }
}

export default Home;