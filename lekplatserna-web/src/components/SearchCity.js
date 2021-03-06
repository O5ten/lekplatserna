import React, { Component } from 'react';
import Select from 'react-select';

import debounce from 'throttle-debounce/debounce';
import CityService from '../services/CityService';

import 'react-select/dist/react-select.css';
import './SearchCity.css';

class SearchCity extends Component {

  constructor(){
    super();
    this.fetchCitiesByKeyword = debounce(500, this.fetchCitiesByKeyword.bind(this));
  }

  state = {
    selectedOption: '',
    cities: [],
    isLoading: false
  };

  handleChange = (selectedOption) => {
    this.setState(Object.assign({}, this.state, {
        selectedOption: selectedOption,
        cities: []
    }));
    this.props.onCitySelected(selectedOption);
  }

  fetchCitiesByKeyword = (keyword) => {
      if(keyword.length < 2){
        return;
      }
      this.setState(Object.assign({}, this.state, {
        isLoading: true
      }));
      return CityService.fetchCitiesByKeyword(keyword).then((cities) => {
          this.setState(Object.assign({}, this.state, {
            cities: cities,
            isLoading: false
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
            placeholder="Ange stad eller ort"
            noResultsText="Inga resultat"
            onBlurResetsInput={false}
            onSelectResetsInput={false}
            arrowRenderer={null}
            isLoading={this.state.isLoading}
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
