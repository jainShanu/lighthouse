import React from 'react'
import ReactDOM from 'react-dom'
// import 'bootstrap/dist/css/bootstrap.css';
import App from './components/App.jsx'
import {BrowserRouter} from 'react-router-dom';
import routes from './routes.js';
import Error404 from './components/Error404.jsx';

var forPath = window.location.pathname.toString();


for (var route in routes) {
  if (forPath === routes[route].path.toString()) {
    ReactDOM.render(<BrowserRouter>
      <App />
    </BrowserRouter>, document.getElementById('app_id'));
    break;
  } else {
    if (++route == routes.length) {
      ReactDOM.render(<Error404 />, document.getElementById('app_id'));
      break;
    }
  }
}
