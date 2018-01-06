import React, { Component } from 'react';
import { Link, BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import UserProfile from './utils/UserProfile';

import Admin from './pages/admin/Admin';
import Edit from './pages/admin/Edit';
import Login from './pages/Login';
import Home from './pages/Home';
import About from './pages/About';
import Lekplats from './pages/Lekplats';

import './Routes.css';

class Routes extends Component {

    constructor(){
      super();
      this.state = {
        user: null
      };
    }

    requireAuth(Page, state){
        return UserProfile.getCurrentSession() ? (
                <Page {...state}/>
               ) : (
                <Redirect to={{
                     pathname: '/login',
                     state: { referrer: state.location.pathname }
                 }}/>
               );
    }

    render(){
        return (
        <BrowserRouter>
             <div>
                 <div className="Navigation">
                    <Link className="Navigation-Link" to="/"><i className="fa fa-home"/></Link>
                    {UserProfile.isAdmin() ? (<Link className="Navigation-Link" to="/admin/lekplats"><i className="fa fa-plus-circle"/></Link>) : (<span/>)}
                    {UserProfile.isAdmin() ? (<Link className="Navigation-Link" to="/admin"><i className="fa fa-cog"/></Link>) : (<span/>)}
                    {UserProfile.getCurrentSession() ?
                        (<Link className="Navigation-Link" to="/logout">{UserProfile.getCurrentSession().name} <i className="fa fa-sign-out"/></Link>) :
                        (<Link className="Navigation-Link" to="/login"><i className="fa fa-sign-in"/></Link>)}
                 </div>
                 <Switch>
                     <Route path="/login" component={Login} />
                     <Route path="/logout" component={Login} />
                     <Route exact path="/admin/lekplats/:id" render={this.requireAuth.bind(this, Edit)} />
                     <Route exact path="/admin/lekplats" render={this.requireAuth.bind(this, Edit)} />
                     <Route exact path="/admin" render={this.requireAuth.bind(this, Admin)} />

                     <Route path="/lekplats/:id" component={Lekplats} />
                     <Route path="/om" component={About} />
                     <Route path="/" component={Home} />
                     <Route render={() => <h1>404 Page not found</h1>} />
                 </Switch>
            </div>
        </BrowserRouter>
        );
    }
}

export default Routes;