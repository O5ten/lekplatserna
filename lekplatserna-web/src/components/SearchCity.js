import React, { Component } from 'react';
import './SearchCity.css';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import debounce from 'throttle-debounce/debounce';

class SearchCity extends Component {

  constructor(){
    super();
    this.fetchCitiesByKeyword = debounce(500, this.fetchCitiesByKeyword);
  }

  state = {
    selectedOption: '',
    cities: []
  };

  handleChange = (selectedOption) => {
    this.setState({
        selectedOption: selectedOption,
        cities: []
    });
    this.props.onCitySelected(selectedOption);
  }

  fetchCitiesByKeyword = (keyword) => {
      if(keyword.length < 2){
        return;
      }
      return fetch(`/api/city/${keyword}`)
        .then((response) => {
          return response.json();
        }).then((cities) => {
          this.setState(Object.assign({}, this.state, {
            cities: cities
          }));
      });
  };

  render() {
    return (
        //https://www.npmjs.com/package/react-select
        <Select
            autoFocus
            ref="searchCity"
            className="SearchCity"
            placeholder="Hitta en lekplats"
            name="form-field-name"
            value={this.state.selectedOption}
            onChange={this.handleChange}
            onInputChange={this.fetchCitiesByKeyword.bind(this)}
            options={this.state.cities}
        />
    );
  }
}

export default SearchCity;
