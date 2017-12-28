import React, { Component } from 'react';
import { withGoogleMap, Marker, GoogleMap } from 'react-google-maps';
import { withScriptjs } from 'react-google-maps';
import Select from 'react-select';

import './Edit.css';

class Edit extends Component {

  constructor(route){
    super();
    this.state = {
        id: route.match.params.id || 'new',
        name: '',
        description: '',
        lat: 0.0, //Stockholm as good a default as any
        lon: 0.0,
        tags: []
    };
    if(this.state.id !== 'new'){
        this.fetchPlayground();
    }
  }

  fetchPlayground() {
    return fetch(`/api/playground/${this.state.id}`)
        .then((response) => {
          return response.json();
        }).then((playground) => {
          this.setState(Object.assign({}, this.state, playground));
        });
  }

  handleChange(event) {
    let playground = {};
    playground[event.target.name] = event.target.value;
    this.setState(Object.assign({}, this.state, playground));
  }

  useProximityToSetCoordinate() {
    return navigator.geolocation.getCurrentPosition((pos) => {
       this.setState(Object.assign({}, this.state, {
          lon: pos.coords.longitude,
          lat: pos.coords.latitude
       }));
    });
  }

  handleSubmit() {
     console.log("Submit",arguments);
  }

  render() {
    const Map = withScriptjs(withGoogleMap(props => {
       return <GoogleMap
             visible={props.state.lat !== 0.0 || props.state.lon !== 0.0}
             defaultZoom={15}
             defaultCenter={{ lat: this.state.lat, lng: this.state.lon }}>
                <Marker position={{ lat: this.state.lat, lng: this.state.lon }} />
            </GoogleMap>
    }));
    return (
    <div className="Edit">
        <h3>Namn</h3>
        <input name="name" type="text" onChange={this.handleChange.bind(this)} value={this.state.name}/>
        <h3>Beskrivning</h3>
        <textarea name="description" type="text" onChange={this.handleChange.bind(this)} value={this.state.description}/>
        <h3>Taggar</h3>
        <Select
          name="tags"
          className="tags"
          arrowRenderer={null}
          name="form-field-name"
          multi={true}
          value={this.state.tags.map((t) => { return {label: t, value: t};})}
          onChange={this.handleChange.bind(this)}
          options={[]}/>
        <h3>Plats: {this.state.lat}, {this.state.lon}</h3>
        <div className="Edit-Proximity">
            <button className="Edit-Proximity button" onClick={this.useProximityToSetCoordinate.bind(this)}>Använd enhetens plats</button>
            <h3>Eller dubbelklicka på Kartan</h3>
            <Map className="Edit-Container-Map"
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCTg6SwwNWbDjc4FwAZfE4VN_AUh346tF4&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `250px`, width: `250px` }} />}
                mapElement={<div style={{ height: `100%` }}/>}
                state={this.state}
            />
        </div>
        <button className="Edit-Submit button" type="submit" onClick={this.handleSubmit.bind(this)}>Spara</button>
    </div>
    );
  }
}

export default Edit;
