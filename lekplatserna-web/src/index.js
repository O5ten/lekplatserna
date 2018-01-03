import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes.js'
import 'font-awesome/css/font-awesome.min.css';

import './index.css';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
   <Routes/>
), document.getElementById('root'));
registerServiceWorker();
