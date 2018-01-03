import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

class Admin extends Component {

  render() {
    //TODO loop through playgrounds that are scheduled to be enabled.
    return (
    <div className="Admin">
      <h1 className="Admin-Header">Admin area</h1>
      <Link to="/admin/lekplats"><i className="fa fa-circle-plus"/></Link>
    </div>
    );
  }
}

export default Admin;
