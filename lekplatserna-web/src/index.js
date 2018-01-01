import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Home from './pages/Home';
import Edit from './pages/Edit';
import About from './pages/About';
import Lekplats from './pages/Lekplats';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

ReactDOM.render((
<BrowserRouter>
     <div>
        <Switch>
            //Admin Area
            <Route path="/login" component={Login} />
            <Route path="/admin/lekplats/:id" component={Edit} />
            <Route path="/admin/lekplats" component={Edit} />
            <Route path="/admin" component={Admin} />
            //Public
            <Route path="/lekplats/:id" component={Lekplats} />
            <Route path="/om" component={About} />
            <Route
              path="/kontakt"
              render={() => <h1>Kontaktuppgifter</h1>} />
            <Route path="/" component={Home} />
            <Route render={() => <h1>Page not found</h1>} />
        </Switch>
    </div>
</BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
