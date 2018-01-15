import React, { Component } from 'react';
import './ResultSet.css';
import ResultSetItem from './ResultSetItem';
import PlaygroundService from '../services/PlaygroundService';
import Dropdown from 'react-select';
class ResultSet extends Component {

    constructor(){
        super();
        this.state = {
            distances: [
                { value: '500 m', label: '500 m'},
                { value: '1 km', label: '1 km' },
                { value: '3 km', label: '3 km' },
                { value: '5 km', label: '5 km' },
                { value: '20 km', label: '2 mil' },
                { value: '50 km', label: '5 mil' }
            ]
        };
    }

  componentDidMount(){
    if(this.props.playgrounds.length > 0){
      this.scrollToResultSet();
    }
  }

  scrollToResultSet = () => {
      var resultSet = document.getElementsByClassName('Home-activity-resultset')[0];
      var resultSetLocation = resultSet.getBoundingClientRect().y;
      var initialY = document.body.scrollTop;
      var y = initialY + resultSetLocation;
      var baseY = (initialY + y) * 0.5;
      var difference = initialY - baseY;
      var startTime = performance.now();

      function step() {
          var normalizedTime = (performance.now() - startTime) / 500;
          if (normalizedTime > 1) normalizedTime = 1;
          window.scrollTo(0, baseY + difference * Math.cos(normalizedTime * Math.PI));
          if (normalizedTime < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
  }

  render() {
    return (
      <div className="ResultSet">
        <Dropdown
            className="ResultSet-Range-Dropdown"
            onBlurResetsInput={false}
            onSelectResetsInput={false}
            options={this.state.distances}
            simpleValue
            clearable={false}
            value={this.props.defaultDistance}
            onChange={(v) => {
                this.setState(Object.assign({}, this.state, {selectedDistance: {label: v, value: v}}));
                this.props.onDistanceSelection(v);
            }}
            searchable={false}/>
        <h2 className="ResultSet-header">{this.props.message}</h2>
        <div className="ResultSet-list">
            {
                this.props.playgrounds.length > 0 ? this.props.playgrounds.map(function(playground){
                    return <ResultSetItem
                                playground={playground}
                                key={playground.id + playground.distance}/>;
                }) : (<center>
                    <div className="ResultSet-list-Message">
                        <i className="ResultSet-list-Message-Arrow fa fa-arrow-up"/>
                        <br/>
                        <p>Det finns inga registrerade lekplatser så nära dig.</p>
                        <p>Prova expandera sökradien för att hitta fler resultat</p>
                    </div>
                </center>)
            }
        </div>
      </div>
    );
  }
}

export default ResultSet;
