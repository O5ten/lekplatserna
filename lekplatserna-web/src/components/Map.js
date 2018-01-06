import React, { Component } from 'react';
import { withGoogleMap, Marker, GoogleMap } from 'react-google-maps';
import { withScriptjs } from 'react-google-maps';

class Map extends Component{

  constructor(props){
    super();
    this.state = {
      map: {}
    }
  }

  mapLoaded(map){
    this.setState(Object.assign({}, this.state, {
        map: map
    }));
  }

  onDblClick(clickEvent){
    this.props.mapCenterMoved(clickEvent.latLng.lat(), clickEvent.latLng.lng());
  }

  shouldComponentUpdate(nextProps, nextState){
   return this.props.center.lat !== nextProps.center.lat;
  }

  render(){
    const AsyncMap = withScriptjs(
      withGoogleMap(
        function(props){
            return (
              <GoogleMap
                ref={this.mapLoaded.bind(this)}
                onDblClick={this.onDblClick.bind(this)}
                visible={this.props.center.lat !== 0 || this.props.center.lon !== 0}
                defaultZoom={this.props.zoom}
                defaultCenter={{ lat: this.props.center.lat, lng: this.props.center.lon }}>
                <Marker position={{ lat: this.props.center.lat, lng: this.props.center.lon }} />
              </GoogleMap>
            );
        }.bind(this)
      )
    )
    var map
    if(this.props.center.lat){
      map = <AsyncMap
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCTg6SwwNWbDjc4FwAZfE4VN_AUh346tF4&v=3.exp&libraries=geometry,drawing,places"
        ref="map"
        loadingElement={
          <div style={{ width: `100%` }} />
        }
        containerElement={
          <div style={{ width: `100%` }} />
        }
        mapElement={
          <div style={{ minHeight: this.props.height, width: this.props.width }} />
        }
      />
    }else{
      map = <div style={{height: `0px`}} />
    }
    return(map)
  }
}

export default Map;
