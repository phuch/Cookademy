import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
// Import routing components
import {BrowserRouter, Route, Switch} from 'react-router-dom';

// children component
import Main from './components/Main';
import Welcome from './components/Welcome';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/home" component={Main}/>
      <Route exact path="/" component={Welcome}/>
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
