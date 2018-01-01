import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import FacebookLogin from 'react-facebook-login';

import './Login.css';

class Login extends Component {

  componentClicked(){
    console.log("Clicked!");
  }

  responseFacebook(res){
    console.log(res);
  }

  render() {
    return (
    <div className="Login">
        <h1 className="Login-Header">Login</h1>
        <FacebookLogin
            appId="749047118627008"
            autoLoad={true}
            fields="name,email"
            onClick={this.componentClicked}
            callback={this.responseFacebook} />
    </div>
    );
  }
}

export default Login;
