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

  componentDidMount(){
    let cityName = this.props.location.pathname.substring(1);
    if(cityName.length > 0 && cityName.indexOf("/") === -1){
        document.title = "LEKPLATSERNA " + cityName.toUpperCase();
        CityService.fetchCityByName(cityName).then(city => city[0] && this.fetchPlaygroundsByLocation(city[0]));
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
                <SearchCity className="Home-activity-area-search" onCitySelected={(city) => { this.props.history.push('/' + city.label); this.fetchPlaygroundsByLocation(city)}} />
            </center>
        </div>
        { this.state.locationSelected ?
            (<div className="Home-activity-resultset">
                <ResultSet message={this.state.message} playgrounds={this.state.playgrounds}/>
            </div>) :
            <NewsFeed/>
        }
      </div>
    );
  }
}

export default Home;