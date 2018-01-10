import React, { Component } from 'react';
import Map from '../../components/Map';

import 'react-table/react-table.css'
import ReactTable from 'react-table'
import './Admin.css';

import PlaygroundService from '../../services/PlaygroundService';

class Admin extends Component {

  constructor(){
    super();
    this.state = {
        playgrounds: [],
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

  render() {
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
        <h1 className="Admin-Header">Förslag på lekplatser</h1>
        <p>{"//TODO"}</p>
        <h1 className="Admin-Header">Förslag på förändringar</h1>
        <p>{"//TODO"}</p>
        <h1 className="Admin-Header">Playgrounds</h1>
        <Map className="Admin-Playgrounds-Map"
            mapCenterMoved={() => {}}
            center={{lat: 62, lon: 15}}
            height='400px'
            width='400px'
            zoom={5}
            playgrounds={this.state.playgrounds}/>
        <h1 className="Admin-Header">Egenskaper</h1>
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

      </div>
    </div>
    );
  }
}

export default Admin;
