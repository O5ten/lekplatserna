import React, { Component } from 'react';

class Lekplats extends Component {


  constructor(id){
    super();
    console.log(arguments);
    console.log(id);
  }

  render() {
    return (
      <h1>Lekplats</h1>
    );
  }
}

export default Lekplats;
