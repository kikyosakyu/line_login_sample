import React from 'react';
import './App.css';
import {Home, SignIn} from './components'
import {BrowserRouter as Router, Route} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/home" component={Home}/>
        <Route exact path="/" component={SignIn}/>
      </Router>
    </div>
  );
}

export default App;
