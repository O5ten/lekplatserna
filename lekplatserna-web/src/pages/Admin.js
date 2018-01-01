import React, { Component } from 'react';
import './Admin.css';

class Admin extends Component {

  render() {
    return (
    <div className="Admin">
      <h1 className="Admin-Header">Admin area</h1>
      <a href="/admin/lekplats">
        <button className="Admin-New" >Ny Lekplats</button>
      </a>
    </div>
    );
  }
}

export default Admin;
