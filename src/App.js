import React, {Component} from 'react';
import './App.css';
import firebase from 'firebase';
import firebaseConfig from "./constance/firebaseConfig";
import {FirestoreProvider} from "react-firestore";
import {AppContext} from "./constance/appContext";
import {CardAMathCalculator} from "./apps/CardAMathCalculator";


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
        db: firebase,
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

  }

  render() {
    return (
        <AppContext.Provider value={this.state}>
          <FirestoreProvider firebase={firebase}>
            <CardAMathCalculator/>
          </FirestoreProvider>
        </AppContext.Provider>
    );
  }
}

export default App;


