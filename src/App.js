import React from 'react';
import './App.css';
import {Redirect, Home, SignIn} from './components'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import PrivateRoute from './auth/PrivateRoute'
import { AuthProvider } from './auth/AuthProvider'

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Switch>
            <PrivateRoute exact path="/" component={Home}/>
            <Route exact path="/signin" component={SignIn}/>
            <Route exact path="/redirect" component={Redirect}/>
            <Route render={() => <p>not found.</p>} />
          </Switch>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
