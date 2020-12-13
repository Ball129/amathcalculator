import React, {Component, useContext} from 'react';
import {
    Button,
    Card,
    Dimmer,
    Dropdown,
    Grid,
    GridColumn,
    GridRow, Icon,
    Label, Segment, TextArea,
} from "semantic-ui-react";
import {AppContext} from "../../constance/appContext";
import RealTimeDbService from "../../FIREBASE/realtimeDbService";
import {ModScoreHistory} from "../HISTORY/ModScoreHistory";
import stringMath from 'string-math'
import ModAlert from "../../components/ModAlert";


let fontSize = '18px'
let btnSize = '3em'

let pieces = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '0', '+', '-', '(+/-)', 'x', '/', '(x//)',
    '=', '*'
]

let piecesOptions = {}
piecesOptions[pieces[23]] = [
    {
        key: '+',
        text: '+',
        value: '+',
    },
    {
        key: '-',
        text: '-',
        value: '-',
    }
]
piecesOptions[pieces[26]] = [
    {
        key: '*',
        text: '*',
        value: '*',
    },
    {
        key: '/',
        text: '/',
        value: '/',
    }
]

class CardAMathCalculatorComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            pieces_data: {},
            loading: false,
            equationBlocks: [],
            point: 0,
            valid: false,
            openScoreHistory: false,
            refKey: null,
        }
        this.alert = React.createRef()
    }

    componentDidMount() {
        this.setState({loading: true})
        let firestore = this.props.db.firestore()
        firestore.collection("config").doc('pieces').get().then(

        ).then((snapShot) => {
            this.setState({
                pieces_data: snapShot.data(),
                loading: false
            })
        })
            .catch((error) => {
                this.alert.current.header = 'Somethings not right'
                this.alert.current.content = error
                this.alert.current.show()
            });
    }

    static defaultProps = {}

    clear = () => {
        this.setState({
            equationBlocks: [],
            point: 0,
            valid: false,
            openScoreHistory: false,
            refKey: null,
        })
    }

    generateButton = (_key, color = 'teal') => {
        return (
            <Button
                key={_key}
                circular
                style={{
                    width: btnSize,
                    height: btnSize,
                    padding: '0px',
                    margin: '2px',
                    textAlign: 'center',
                    fontSize: fontSize
                }}
                color={color}
                value={_key}
                onClick={(e) => {
                    let equationBlocks = this.state.equationBlocks;
                    if (equationBlocks.length >= 15) {
                        return
                    }

                    let newBlock = JSON.parse(JSON.stringify(this.state.pieces_data[_key]))
                    newBlock.multiply = null
                    equationBlocks.push(newBlock)

                    let point = 0
                    equationBlocks.forEach((item) => {
                        point += item.point
                    })

                    this.setState({
                        point: point,
                        equationBlocks: equationBlocks,
                    }, this.calculatePoint)
                }}
            >{_key}</Button>
        )
    }

    generateEquationBlock = () => {
        return this.state.equationBlocks.map((item, index) => {
            return (
                <GridRow key={index}>
                    <Label detail={`${index + 1}. ${item.name}`} style={{backgroundColor: 'rgba(0, 0, 0, 0)'}}/>
                    <Dropdown
                        style={{minWidth: '6em'}}
                        placeholder='คูณ'
                        selection
                        clearable
                        options={[
                            {
                                key: 'x2',
                                text: 'x2',
                                value: 2,
                            },
                            {
                                key: 'x3',
                                text: 'x3',
                                value: 3,
                            },
                            {
                                key: 'x2eq',
                                text: 'x2eq',
                                value: 20,
                            },
                            {
                                key: 'x3eq',
                                text: 'x3eq',
                                value: 30,
                            }
                        ]}
                        value={item.equationMultiply > 1 ? item.equationMultiply * 10 : item.multiply}
                        onChange={(e, {value}) => {
                            let equationBlocks = this.state.equationBlocks;
                            if ([20, 30].includes(value)) {
                                equationBlocks[index].multiply = 1
                                equationBlocks[index].equationMultiply = value / 10
                            } else if (value) {
                                equationBlocks[index].multiply = value
                                equationBlocks[index].equationMultiply = 1
                            } else {
                                equationBlocks[index].multiply = 1
                                equationBlocks[index].equationMultiply = 1
                            }
                            this.setState({equationBlocks: equationBlocks}, this.calculatePoint)
                        }}
                    />
                    {
                        [pieces[23], pieces[26]].includes(item.name) ? <Dropdown
                            style={{minWidth: '6em'}}
                            placeholder={item.name}
                            selection
                            options={piecesOptions[item.name]}
                            value={item.value}
                            onChange={(e, {value}) => {
                                let equationBlocks = this.state.equationBlocks;
                                equationBlocks[index].value = value
                                this.setState({equationBlocks: equationBlocks}, this.calculatePoint)
                            }}
                        /> : <div/>
                    }
                    {
                        pieces[28] === item.name ? <TextArea
                            style={{minWidth: '6em'}}
                            rows={1}
                            value={item.value}
                            onChange={(e, {value}) => {
                                let equationBlocks = this.state.equationBlocks;
                                equationBlocks[index].value = value
                                if (pieces.includes(value)) {
                                    this.setState({equationBlocks: equationBlocks}, this.calculatePoint)
                                } else {
                                    this.setState({equationBlocks: equationBlocks})
                                }
                            }}
                        /> : <div/>
                    }
                </GridRow>
            )
        })
    }

    calculatePoint = () => {
        let point = 0;
        let equationMultiply = 1
        this.state.equationBlocks.forEach((item) => {
            point += item.point * (item.multiply || 1)
            equationMultiply *= (item.equationMultiply || 1)
        })
        point *= equationMultiply
        this.validate()
        this.setState({point: point})
    }

    validate = () => {
        try {
            let eqTextList = this.state.equationBlocks.map((value => {
                return value?.value.toString()
            })).join('').replace(/[^0-9*/()\-+.=]/g, '').split('=')

            if (eqTextList.length < 2) {
                this.setState({valid: false})
                return
            }
            let result = null
            let valid = true
            eqTextList.forEach((eq) => {
                if (result === null) {
                    result = stringMath(eq)
                } else {
                    let newResult = stringMath(eq)

                    if (newResult !== result) {
                        valid = false
                    }
                }
            })
            this.setState({valid: valid})
        } catch (error) {
            this.setState({valid: false})
        }
    }

    render() {
        return (
            <Card centered style={{boxShadow: 'None', maxWidth: '35em'}} fluid>
                <ModAlert ref={this.alert}/>
                <Card.Content>
                    <Dimmer.Dimmable>
                        <Dimmer active={this.state.loading} inverted/>

                        <Grid textAlign={'center'} style={{padding: '1vw'}}>
                            <GridRow>
                                <Label
                                    detail={this.state.equationBlocks.map((value => {
                                        return value?.value.toString()
                                    })).join(' ')}
                                    style={{fontSize: fontSize, backgroundColor: 'rgba(0, 0, 0, 0)'}}
                                />
                            </GridRow>
                            <GridRow columns={3}>
                                <GridColumn>
                                    <Label
                                        detail={`Point: ${this.state.point}`}
                                        style={{fontSize: fontSize, backgroundColor: 'rgba(0, 0, 0, 0)'}}
                                    />
                                </GridColumn>
                                <GridColumn>
                                    <Label detail={'Valid:'}
                                           style={{fontSize: fontSize, backgroundColor: 'rgba(0, 0, 0, 0)'}}
                                    />
                                    {
                                        this.state.valid ?
                                            <Icon name={'checkmark'} color={'green'}/>
                                            : <Icon name={'close'} color={'red'}/>
                                    }
                                </GridColumn>
                                <GridColumn>
                                    <ModScoreHistory
                                        openModal={this.state.openScoreHistory}
                                        onClose={() => {
                                            this.setState({openScoreHistory: false})
                                        }}
                                        onEditHistory={(history) => {
                                            this.setState({
                                                openScoreHistory: false,
                                                refKey: history.key,
                                                equationBlocks: history.equationBlocks,
                                                point: history.point
                                            })
                                        }}
                                    />
                                    <Button
                                        onClick={() => {
                                            this.setState({openScoreHistory: true})
                                        }}
                                    >
                                        History
                                    </Button>
                                </GridColumn>
                            </GridRow>
                            <GridRow>
                                <GridColumn textAlign={'center'}>
                                    <GridRow>
                                        {
                                            pieces.slice(0, 5).map((_key) => {
                                                return this.generateButton(_key)
                                            })
                                        }
                                        {this.generateButton(pieces[21], 'blue')}
                                        {this.generateButton(pieces[24], 'blue')}
                                    </GridRow>
                                    <GridRow>
                                        {
                                            pieces.slice(5, 10).map((_key) => {
                                                return this.generateButton(_key)
                                            })
                                        }
                                        {this.generateButton(pieces[22], 'blue')}
                                        {this.generateButton(pieces[25], 'blue')}
                                    </GridRow>
                                    <GridRow>
                                        {
                                            pieces.slice(10, 15).map((_key) => {
                                                return this.generateButton(_key)
                                            })
                                        }
                                        {this.generateButton(pieces[23], 'blue')}
                                        {this.generateButton(pieces[26], 'blue')}
                                    </GridRow>
                                    <GridRow>
                                        {
                                            pieces.slice(15, 20).map((_key) => {
                                                return this.generateButton(_key)
                                            })
                                        }
                                        {this.generateButton(pieces[20])}
                                        {this.generateButton(pieces[27], 'orange')}
                                    </GridRow>
                                    <GridRow>
                                        {this.generateButton(pieces[28], 'yellow')}
                                        {[...Array(6).keys()].map((a) => {
                                            return <Button key={a * 99} circular style={{
                                                width: btnSize,
                                                height: btnSize,
                                                padding: '0px',
                                                margin: '2px',
                                                textAlign: 'center',
                                                fontSize: fontSize,
                                                backgroundColor: 'inherit'
                                            }} disabled={true}> </Button>
                                        })}
                                    </GridRow>
                                </GridColumn>
                            </GridRow>
                            <GridRow>
                                <GridColumn>
                                    <Button
                                        floated={'right'}
                                        color={'red'}
                                        circular
                                        onClick={() => {
                                            this.clear()
                                        }}
                                    >
                                        Clear
                                    </Button>
                                    <Button
                                        floated={'right'}
                                        color={'orange'}
                                        circular
                                        onClick={() => {
                                            let equationBlocks = this.state.equationBlocks;
                                            equationBlocks.pop()
                                            this.setState({equationBlocks: equationBlocks}, this.calculatePoint)
                                        }}
                                    >
                                        Undo
                                    </Button>
                                    <Button
                                        floated={'right'}
                                        color={this.state.refKey ? 'yellow' : 'green'}
                                        circular
                                        onClick={() => {
                                            this.setState({loading: true})

                                            if (!this.props.currentUserName) {
                                                this.alert.current.header = 'Select User!!'
                                                this.alert.current.show()
                                                this.setState({loading: false})
                                                return
                                            }
                                            if (!this.state.valid) {
                                                this.alert.current.header = 'Not valid equation!!'
                                                this.alert.current.show()
                                                this.setState({loading: false})
                                                return
                                            }

                                            let dbCon = this.props.db.database().ref(`/messages/${this.props.currentUserName}`);

                                            let timestamp = Date.now()
                                            let rKey = this.state.refKey || timestamp.toString()
                                            RealTimeDbService.setData(dbCon, rKey, {
                                                equationBlocks: this.state.equationBlocks,
                                                point: this.state.point
                                            }).then(success => {
                                                this.alert.current.header = 'Saved'
                                                this.alert.current.show()
                                                }, failed => {

                                                }
                                            ).finally(() => {
                                                this.setState({loading: false})
                                            })

                                        }}
                                    >
                                        {this.state.refKey ? 'Edit' : 'Save'}
                                    </Button>
                                </GridColumn>
                            </GridRow>
                            <GridRow>
                                <p>เพิ่มตัวคูณ</p>
                                <Segment
                                    style={{
                                        height: '20em',
                                        width: '90%',
                                        overflowY: 'auto',
                                        overflowX: 'hidden',
                                        border: '10px'
                                    }}
                                >
                                    <Grid>
                                        {this.generateEquationBlock()}
                                    </Grid>
                                </Segment>
                            </GridRow>
                        </Grid>
                    </Dimmer.Dimmable>
                </Card.Content>
            </Card>
        )
    }
}

CardAMathCalculatorComponent.propTypes = {

}

export const CardAMathCalculator = (props) => {
    let appContext = useContext(AppContext);
    return <CardAMathCalculatorComponent {...props} {...appContext}/>
}
