import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
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
            <Route path="/lekplats/hantera/:id" component={Edit} />
            <Route path="/lekplats/ny" component={Edit} />
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
