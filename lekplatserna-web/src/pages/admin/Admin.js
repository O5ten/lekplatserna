import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

class Admin extends Component {

  render() {
    return (
    <div className="Admin">
      <h1 className="Admin-Header">Admin area</h1>
      <div>
        <h1>Approval of Suggestions</h1>
        <h1>Approval of Modifications</h1>
        <h1>User Mgmt</h1>
      </div>
    </div>
    );
  }
}

export default Admin;
