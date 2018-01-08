import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';

import UserProfile from '../utils/UserProfile';
import AuthService from '../services/AuthService';

import './Login.css';

class Login extends Component {

  constructor(){
    super();
  }

  componentWillMount(){
    let session = UserProfile.getCurrentSession();
    if(this.props.location.pathname === '/logout'){
        this.logout();
    }else if(session ){
        this.validateSession(session);
    }
  }

  validateSession(session){
    AuthService.validateSession(session).then(function(auth){
        UserProfile.setCurrentSession(auth);
        this.props.history.push(this.props.location.state ? this.props.location.state.referrer : '/')
        window.location.reload();
    }.bind(this));
  }

  logout(){
      UserProfile.destroyCurrentSession();
      this.props.history.push('/');
      window.location.reload();
  }

  render() {
    if(!UserProfile.getCurrentSession()){
        return (
            <div className="Login">
                <h1 className="Login-Header">Sign In</h1>
                <FacebookLogin
                    appId="749047118627008"
                    isMobile={false}
                    fields="name,email"
                    icon="fa-facebook"
                    callback={this.validateSession.bind(this)} />
            </div>
            );
    }else{
        return (<div className="Login">
                   <h1 className="Login-Header">Login</h1>
                   <div className="Login-Message">{UserProfile.getCurrentSession().name} is logged in </div>
                   <button className="button" onClick={this.logout.bind(this)}>Logout</button>
               </div>);
    }
  }
}

export default Login;
