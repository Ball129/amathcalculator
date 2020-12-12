import React, {Component} from 'react';
import firebase from 'firebase';
import firebaseConfig from "./constance/firebaseConfig";
import {FirestoreProvider} from "react-firestore";
import {AppContext} from "./constance/appContext";
import {CardAMathCalculator} from "./apps/CAL/CardAMathCalculator";
import CardStopWatch from "./apps/TIMER/CardStopWatch";
import {Container, Dropdown, GridRow, Menu} from "semantic-ui-react";
import CardCountdown from "./apps/TIMER/CardCoundown";
import {ModScoreHistory} from "./apps/HISTORY/ModScoreHistory";


let menuHeight = '4em'

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            db: firebase,
            currentCard: 0,
            currentUserName: null,
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
    }

    selectCard = () => {
        switch (this.state.currentCard) {
            case 0:
                return (
                    <Container style={{height: '100vh', paddingTop: menuHeight, boxShadow: 'None'}}>
                        <CardAMathCalculator/>
                    </Container>
                )
            case 1:
                return <CardStopWatch/>
            case 2:
                return <CardCountdown/>
            case 99:
                return <ModScoreHistory
                        openModal={true}
                    />
            default:
                return <div/>
        }
    }

    render() {
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
                                                    <Dropdown
                        style={{minWidth: '10em'}}
                        placeholder='user'
                        selection
                        options={[
                            {
                                key: 'ball',
                                text: 'Ball',
                                value: 'Ball',
                            },
                            {
                                key: 'nun',
                                text: 'Nun',
                                value: 'Nun',
                            },
                        ]}
                        onChange={(e, {value}) => {
                            this.setState({currentUserName: value})
                        }}
/>
                            </Menu.Item>
                            <Menu.Item>
                                <p>V. 2.1</p>
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu>

                    {this.selectCard()}
                </FirestoreProvider>
            </AppContext.Provider>
        );
    }
}

export default App;


