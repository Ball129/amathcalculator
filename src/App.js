import React, {Component} from 'react';
import firebase from 'firebase';
import firebaseConfig from "./constance/firebaseConfig";
import {FirestoreProvider} from "react-firestore";
import {AppContext} from "./constance/appContext";
import {CardAMathCalculator} from "./apps/CAL/CardAMathCalculator";
import CardStopWatch from "./apps/TIMER/CardStopWatch";
import {Container, Dropdown, Menu} from "semantic-ui-react";
import CardCountdown from "./apps/TIMER/CardCoundown";
import {CardEmailFeedback} from "./apps/CONTACT/CardEmailFeedback";


let menuHeight = '4em'
let cardList = ['calculator', 'stopwatch', 'countdown', 'feedback']

// eslint-disable-next-line no-extend-native
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            db: firebase,
            currentCard: cardList[0],
            currentUserName: null,
        }

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
    }

    selectCard = () => {
        switch (this.state.currentCard) {
            case cardList[0]:
                return (
                    <Container style={{height: '95vh', paddingTop: menuHeight, boxShadow: 'None'}}>
                        <CardAMathCalculator/>
                    </Container>
                )
            case cardList[1]:
                return <CardStopWatch/>
            case cardList[2]:
                return <CardCountdown/>
            case cardList[3]:
                return (
                    <Container style={{height: '100vh', paddingTop: menuHeight, boxShadow: 'None'}}>
                        <CardEmailFeedback/>
                    </Container>
                )
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

                        <Menu.Item>
                            <Dropdown item text='Menu'>
                                <Dropdown.Menu>
                                    {
                                        cardList.map((cardId, index) => {
                                            if (cardId === this.state.currentCard) return <div key={index}/>;
                                            return (
                                                <Dropdown.Item
                                                    key={index}
                                                    onClick={(e) => {
                                                        this.setState({currentCard: cardId})
                                                    }}
                                                >
                                                    {cardId.capitalize()}
                                                </Dropdown.Item>
                                            )
                                        })
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Item>

                        <Menu.Item>
                            <p>{this.state.currentCard.capitalize()}</p>
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
                                <p align={'right'}>V. 2.2.2</p>
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


