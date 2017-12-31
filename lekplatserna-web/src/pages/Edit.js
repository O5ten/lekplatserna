import React, { Component } from 'react';
import Map from '../components/Map'
import { WithContext as ReactTags } from 'react-tag-input';

import './Edit.css';

class Edit extends Component {

  constructor(route){
    super();

    this.state = {
        id: route.match.params.id || 'ny',
        name: '',
        description: '',
        lat: 0.0, //Stockholm as good a default as any
        lon: 0.0,
        tags: [],
        suggestions: []
    };
    this.options = []
    if(this.state.id !== 'ny'){
        this.fetchPlayground();
    }
    this.fetchTags();
  }

  fetchPlayground() {
    return fetch(`/api/playground/${this.state.id}`)
        .then((response) => {
          return response.json();
        }).then((playground) => {
            playground.tags = playground.tags.map(function(t,i){return {text: t, i: i}})
          this.setState(Object.assign({}, this.state, playground));
        });
  }

  fetchTags(){
    return fetch(`/api/tag`)
        .then((response) => {
            return response.json();
        }).then((tags) => {
            let suggestions = tags.map((t) => {
                return t.tag;
            });
            this.setState(Object.assign({}, this.state, { suggestions: suggestions }));
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
        fetch('/api/playground', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              name:  this.state.name,
              description: this.state.description,
              tags: this.state.tags.map(function(v){ return v.text;}),
              lat: this.state.lat,
              lon: this.state.lon
            })
          }
        )
    }

    tagAdded(tags) {
        this.setState(Object.assign({}, this.state, {
            tags: tags
        }));
    }

    handleTagDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState(Object.assign({}, this.state, { tags: tags }));
    }

    handleTagAddition(tag) {
        let tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });
        this.setState(Object.assign({}, this.state, { tags: tags }));
    }

    handleTagDrag(tag, currPos, newPos) {
        let tags = this.state.tags;

        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);
        this.setState(Object.assign({}, this.state, { tags: tags }));
    }

    tagSuggestionFilter(input, suggestions) {
        let lowerCaseQuery = input.toLowerCase()
        return suggestions.filter(function(suggestion)  {
            return suggestion.toLowerCase().includes(lowerCaseQuery) && !this.state.tags.some(function(v){ return v.text === suggestion}.bind(this))
        }.bind(this));
    }

    render() {
    return (
        <div className="Edit">
            <h3>Namn</h3>
            <input placeholder="Lekplatsens namn" className="Edit-Name" name="name" type="text" onChange={this.handleChange.bind(this)} value={this.state.name}/>
            <h3>Beskrivning</h3>
            <textarea placeholder="En kort men ändå sammanfattande beskrivning av lekplatsen" className="Edit-Description" name="description" type="text" onChange={this.handleChange.bind(this)} value={this.state.description}/>
            <h3>Taggar</h3>
            <ReactTags tags={this.state.tags}
                       suggestions={this.state.suggestions}
                       placeholder={"#Lägg till ny tag"}
                       handleFilterSuggestions={this.tagSuggestionFilter.bind(this)}
                       handleDelete={this.handleTagDelete.bind(this)}
                       handleAddition={this.handleTagAddition.bind(this)}
                       handleDrag={this.handleTagDrag.bind(this)} />
            <h3>Plats: Lat {this.state.lat}, Lon {this.state.lon}</h3>
            <div className="Edit-Proximity">
                <button className="Edit-Proximity button" onClick={this.useProximityToSetCoordinate.bind(this)}>Använd enhetens plats</button>
                <Map className="Edit-Container-Map"
                      center={this.state}
                      height='300px'
                      width='300px'
                      zoom={15}/>
            </div>
            <button className="Edit-Submit button" type="submit" onClick={this.handleSubmit.bind(this)}>Spara</button>
        </div>
    );
  }
}

export default Edit;
