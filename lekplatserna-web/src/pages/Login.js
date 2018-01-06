import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import UserProfile from '../utils/UserProfile';

import './Login.css';

class Login extends Component {

  constructor(){
    super();
    this.user = new UserProfile();
  }

  componentWillMount(){
    if(this.props.location.pathname === '/logout'){
        this.logout();
    }else if(this.user.getCurrentSession()){
        this.validateSession(this.user.getCurrentSession());
    }
  }

  validateSession(session){
    return fetch("/api/auth", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(session)
      }
    ).then(function(result){
        if(result.status < 202){
            return result.json().then( function(auth) {
                this.user.setCurrentSession(auth);
                this.props.history.push(this.props.location.state ? this.props.location.state.referrer : '/')
                window.location.reload();
            }.bind(this));
        }
    }.bind(this));
  }

  logout(){
      this.user.destroyCurrentSession();
      this.props.history.push('/');
      window.location.reload();
  }

  render() {
    if(!this.user.getCurrentSession()){
        return (
            <div className="Login">
                <h1 className="Login-Header">Sign In</h1>
                <FacebookLogin
                    appId="749047118627008"
                    fields="name,email"
                    icon="fa-facebook"
                    callback={this.validateSession.bind(this)} />
            </div>
            );
    }else{
        return (<div className="Login">
                   <h1 className="Login-Header">Login</h1>
                   <div className="Login-Message">{this.user.getCurrentSession().name} is logged in </div>
                   <button className="button" onClick={this.logout.bind(this)}>Logout</button>
               </div>);
    }
  }
}

export default Login;
