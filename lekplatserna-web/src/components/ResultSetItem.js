import React, { Component } from 'react';
import './ResultSetItem.css';

class ResultSetItem extends Component {

  state = {
    playground: {}
  }

  constructor(playground) {
    super();
    this.state = playground
  }

  render() {
    return (
      <a href={"/lekplats/" + this.state.playground.id}>
        <div className="ResultSetItem">
            <h2 className="ResultSetItem-header">
                {this.state.playground.name}
            </h2>
            <p className="ResultSetItem-content">{this.state.playground.description}</p>
            <div className="ResultSetItem-tags tag-container">
                {
                    this.state.playground.tags.map((tag, i) =>
                        <div key={i} className="ResultSetItem-tags-tag tag">
                            <i className="fa fa-tag"/>{tag}
                        </div>
                    )
                }
          </div>
        </div>
      </a>
    );
  }
}

export default ResultSetItem;
