import React, { Component } from 'react';
import { withGoogleMap, Marker, GoogleMap } from 'react-google-maps';
import { withScriptjs } from 'react-google-maps';
import { Link } from 'react-router-dom'

import UserProfile from '../utils/UserProfile';

import './Lekplats.css';

class Lekplats extends Component {

  constructor(route){
    super();
    this.user = new UserProfile();
    this.state = {
      user: JSON.parse(localStorage.getItem('LekplatsernaUserProfile')),
      playground: {
        id: route.match.params.id,
        name: 'Loading..',
        description: '',
        lat: 0.0,
        lon: 0.0,
        tags: []
      }
    };
    this.fetchPlayground();
  }

  fetchPlayground() {
      return fetch(`/api/playground/${this.state.playground.id}`)
        .then((response) => {
          return response.json();
        }).then((playground) => {
          this.setState(Object.assign({}, this.state, {
            playground: playground
          }));
        });
  }

  render() {
    const MyMapComponent = withScriptjs(withGoogleMap(props => {
      return <GoogleMap
                 defaultZoom={15}
                 defaultCenter={{ lat: this.state.playground.lat, lng: this.state.playground.lon }}>
                 <Marker position={{ lat: this.state.playground.lat, lng: this.state.playground.lon }} />
             </GoogleMap>
    }));
    return (
    <div className="Lekplats">
          {this.user.getCurrentSession() && this.user.getCurrentSession().role === 'admin' ? (<div className="Lekplats-Edit"><Link to={'/admin' + this.props.location.pathname}><i className="fa fa-edit"/></Link></div>) : (<span/>)}
          <h1 className="Lekplats-Header">{this.state.playground.name}</h1>
           <div className="Lekplats-Tags tag-container">
               {this.state.playground.tags.map((tag, i) => {
                  return <i className="fa fa-tag Lekplats-Tag tag" key={i}> {tag}</i>
               })}
           </div>
          <p className="Lekplats-Description">{this.state.playground.description}</p>
          <div className="Lekplats-Container">
              <MyMapComponent className="Lekplats-Container-Map"
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCTg6SwwNWbDjc4FwAZfE4VN_AUh346tF4&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
              />
          </div>
      </div>
    );
  }
}

export default Lekplats;
