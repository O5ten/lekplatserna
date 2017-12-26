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
      <div className="ResultSetItem">
            <a href={"/"+this.state.playground.id}>
                <h2 className="ResultSetItem-header">
                    {this.state.playground.name}
                </h2>
                <p className="ResultSetItem-content">{this.state.playground.description}</p>
                <div className="ResultSetItem-tags">
                    {
                        this.state.playground.tags.map((tag, i) =>
                            <label key={i} className="ResultSetItem-tags-tag">
                                {tag}
                            </label>
                        )
                    }
                </div>
            </a>
      </div>
    );
  }
}

export default ResultSetItem;
