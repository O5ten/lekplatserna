import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import Map from '../../components/Map';

import PlaygroundService from '../../services/PlaygroundService';

import './Edit.css';

class Edit extends Component {

  constructor(route){
    super();
    this.state = {
        id: route.match.params.id || 'ny',
        name: '',
        description: '',
        lat: 0.0,
        lon: 0.0,
        tags: [],
        suggestions: []
    };
    if(this.state.id !== 'ny'){
        this.fetchPlayground();
    }
    this.fetchTags();
  }

  fetchPlayground() {
    return PlaygroundService.fetchPlaygroundById(this.state.id).then((playground) => {
        playground.tags = playground.tags.map((tag, ix) => {return {text: tag, i: ix}});
        this.setState(Object.assign({}, this.state, playground));
    });
  }

  fetchTags(){
    return PlaygroundService.fetchTags().then((tags) => {
        this.setState(Object.assign({}, this.state, { suggestions: tags.map(t => t.tag) }));
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

  handleSave(shouldCreateAnother) {
      PlaygroundService.persistPlayground({
          id: this.state.id,
          name:  this.state.name,
          description: this.state.description,
          tags: this.state.tags.map(v => v.text),
          lat: this.state.lat,
          lon: this.state.lon
        }).then(function(playground){
            if(shouldCreateAnother){
                window.location.reload();
            }else{
                this.props.history.push('/lekplats/' + (playground.id ? playground.id : playground[0].id));
            }
        }.bind(this));
    }

    handleRemove(){
        PlaygroundService.removePlaygroundById(this.state.id);
    }

    handleTagDelete(i) {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState(Object.assign({}, this.state, { tags: tags }));
    }

    handleTagAddition(tag) {
        let tags = this.state.tags;
        let notAlreadyAdded = !tags.some(v => v.text === tag);
        if(notAlreadyAdded){
            tags.push({
                id: tags.length + 1,
                text: tag
            });
        }
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
        return suggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(lowerCaseQuery) && !this.state.tags.some(v => v.text === suggestion)
        );
    }

    mapCenterMoved(lat, lon){
        this.setState(Object.assign({}, this.state, {
            lat: lat,
            lon: lon
        }));
    }

    render() {
    return (
        <div className="Edit">
            <h1>{this.state.id === 'ny' ? "Skapa ny lekplats" : ("Hantera " + this.state.name)}</h1>
            <h3>Namn</h3>
            <input placeholder="Lekplatsens namn" className="Edit-Name" name="name" type="text" onChange={this.handleChange.bind(this)} value={this.state.name}/>
            <h3>Beskrivning</h3>
            <textarea placeholder="En kort men ändå sammanfattande beskrivning av lekplatsen" className="Edit-Description" name="description" type="text" onChange={this.handleChange.bind(this)} value={this.state.description}/>
            <h3>Egenskaper</h3>
            <ReactTags tags={this.state.tags}
                       suggestions={this.state.suggestions}
                       placeholder={"#Lägg till ny egenskap"}
                       handleFilterSuggestions={this.tagSuggestionFilter.bind(this)}
                       handleDelete={this.handleTagDelete.bind(this)}
                       handleAddition={this.handleTagAddition.bind(this)}
                       handleDrag={this.handleTagDrag.bind(this)} />
            <h3>Plats</h3>
            <div className="Edit-Proximity">
                <button className="Edit-Proximity-Button button" onClick={this.useProximityToSetCoordinate.bind(this)}>Använd enhetens plats</button>
                <Map className="Edit-Proximity-Container-Map"
                      center={this.state}
                      mapCenterMoved={this.mapCenterMoved.bind(this)}
                      height='400px'
                      width='400px'
                      zoom={15}
                      playgrounds={[]}/>
            </div>
            <div>
                <button className="Edit-Submit button" type="submit" onClick={this.handleSave.bind(this, false)}>Spara</button>
                <button className="Edit-Submit button" type="submit" onClick={this.handleSave.bind(this, true)}>Spara och skapa en ny</button>
                {this.state.id !== 'ny' && (<button className="Edit-Remove button" type="submit" onClick={this.handleRemove.bind(this)}>Ta bort</button>)}
            </div>

        </div>
    );
  }
}

export default Edit;
