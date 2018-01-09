import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withGoogleMap, MarkerWithLabel, GoogleMap } from 'react-google-maps';
import { withScriptjs } from 'react-google-maps';
import 'react-table/react-table.css'
import ReactTable from 'react-table'

import PlaygroundService from '../../services/PlaygroundService';

import './Admin.css';

class Admin extends Component {

  constructor(){
    super();
    this.state = {
        playgrounds: {count: 0},
        suggestions: [],
        modifications: [],
        tags: []
    };
  }

  componentDidMount(){
    this.fetchEverything();
  }

  fetchEverything(){
    var playgrounds, modifications, suggestions, tags;
    Promise.all([
        PlaygroundService.fetchPlaygroundsCount(),
        PlaygroundService.fetchModifications(),
        PlaygroundService.fetchSuggestions(),
        PlaygroundService.fetchTags()]
    ).then(function(results){
        [playgrounds, modifications, suggestions, tags] = results;
        this.setState(Object.assign({}, this.state, {
            playgrounds: playgrounds,
            modifications: modifications,
            suggestions: suggestions,
            tags: tags
        }));
    }.bind(this));
  }

/*Currently broken, next thing to resolve.
<MyMapComponent className="Lekplats-Container-Map"
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCTg6SwwNWbDjc4FwAZfE4VN_AUh346tF4&v=3.exp&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `400px` }} />}
            mapElement={<div style={{ height: `100%` }} />}
        />
*/
  render() {
      const MyMapComponent = withScriptjs(withGoogleMap(props => {
        return (<GoogleMap
                   defaultZoom={8}
                   defaultCenter={{ lat: 56.0, lng: 14.0 }}>
                   {this.state.playgrounds.map((playground) => { (<MarkerWithLabel label={playground.name} position={{ lat: playground.lat, lng: playground.lon }}/>) })}
               </GoogleMap>)
      }));
    return (
    <div className="Admin">
      <h1 className="Admin-Header">Statistik</h1>
      <div>
        <div className="Admin-Data">
            <div className="Admin-Data-Counter Admin-Data-Playgrounds">
                <i className="fa fa-cogs"/> {this.state.playgrounds.length} lekplatser
            </div>
            <div className="Admin-Data-Counter Admin-Data-Suggestions">
                <i className="fa fa-connectdevelop"/> {this.state.suggestions.length} Nya lekplatser att godkänna
            </div>
            <div className="Admin-Data-Counter Admin-Data-Modifications">
                <i className="fa fa-arrows-alt"/> {this.state.modifications.length} Lekplatsförändringar att godkänna
            </div>
            <div className="Admin-Data-Counter Admin-Data-Tags">
                <i className="fa fa-tags"/> {this.state.tags.length} tags
            </div>
        </div>
        <h1>Playgrounds</h1>


        <h1>Egenskaper</h1>
        <ReactTable
            data={this.state.tags}
            columns={[
                {
                    Header: 'Tag',
                    accessor: 'tag'
                },
                {
                    Header: 'Used by',
                    accessor: 'count'
                }
            ]}
        />
        <h1>Suggestions</h1>
        <p>//TODO</p>
        <h1>Modifications</h1>
        <p>//TODO</p>
      </div>
    </div>
    );
  }
}

export default Admin;
