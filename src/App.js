import React from 'react';
import firebase from './firebase';
import { HashRouter as Router, Route } from "react-router-dom";
import MainView from './components/MainView.js';
import './styles/App.scss';

class App extends React.Component {
  state = {
    plants: []
  }

  componentDidMount() {
    const dbRef = firebase.database().ref();

    dbRef.on('value', (response) => {
      console.log(response.val());
    })
  }

  render() {
    return (
      <div className="App">
        <div className="menu"/>
        <div className="wrapper">
          <Router basename={"/"}>
            <Route path="/" component={MainView}/>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
