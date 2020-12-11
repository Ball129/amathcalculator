import React, {Component} from 'react';
import firebase from 'firebase';
import firebaseConfig from "./constance/firebaseConfig";
import {FirestoreProvider} from "react-firestore";
import {AppContext} from "./constance/appContext";
import {CardAMathCalculator} from "./apps/CAL/CardAMathCalculator";
import CardStopWatch from "./apps/TIMER/CardStopWatch";
import {Button, Container, Label, Menu} from "semantic-ui-react";
import CardCountdown from "./apps/TIMER/CardCoundown";


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            db: firebase,
            currentCard: 0,
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
    }

    render() {
        let menuHeight = '4em'

        return (
            <AppContext.Provider value={this.state}>
                <FirestoreProvider firebase={firebase}>
                    <Menu fluid fixed={'top'} pointing borderless
                          style={{height: menuHeight}}
                          color={'blue'} inverted>
                        <Menu.Item
                            key={0}
                            color={'teal'}
                            onClick={(e) => {
                                this.setState({currentCard: 0})
                            }}>
                            Calculator
                        </Menu.Item>
                        <Menu.Item
                            key={1}
                            color={'red'}
                            onClick={(e) => {
                                this.setState({currentCard: 1})
                            }}>
                            StopWatch
                        </Menu.Item>
                        <Menu.Item
                            key={2}
                            color={'red'}
                            onClick={(e) => {
                                this.setState({currentCard: 2})
                            }}>
                            Countdown
                        </Menu.Item>

                        <Menu.Menu position={'right'}>
                            <Menu.Item>
                                <p>V. 2.0</p>
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>

                    <Container fluid style={{marginTop: menuHeight}}>
                        {this.state.currentCard === 0 ? <CardAMathCalculator/> : <div/>}
                        {this.state.currentCard === 1 ? <CardStopWatch/> : <div/>}
                        {this.state.currentCard === 2 ? <CardCountdown/> : <div/>}
                    </Container>
                </FirestoreProvider>
            </AppContext.Provider>
        );
    }
}

export default App;


