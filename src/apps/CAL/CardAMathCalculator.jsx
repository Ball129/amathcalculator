import React, {Component, useContext} from 'react';
import {
    Button,
    Card,
    Dimmer,
    Dropdown,
    Grid,
    GridColumn,
    GridRow, Icon,
    Label, Radio, Segment, TextArea,
} from "semantic-ui-react";
import {AppContext} from "../../constance/appContext";
import RealTimeDbService from "../../FIREBASE/realtimeDbService";
import {ModScoreHistory} from "../HISTORY/ModScoreHistory";
import stringMath from 'string-math'
import ModAlert from "../../components/ModAlert";
import _ from 'lodash'


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
            point: 0,
            valid: false,
            openScoreHistory: false,
            refKey: null,
            leftChecked: false,

            leftEquationBlocks: [],
            midEquationBlocks: [],
            rightEquationBlocks: [],
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

    clear = (callback) => {
        this.setState({
            loading: false,
            point: 0,
            valid: false,
            openScoreHistory: false,
            refKey: null,
            leftChecked: false,

            leftEquationBlocks: [],
            midEquationBlocks: [],
            rightEquationBlocks: [],
        }, _.isFunction(callback) ? callback : null)
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
                    if ((this.state.leftEquationBlocks.length + this.state.midEquationBlocks.length + this.state.rightEquationBlocks.length) >= 15) {
                        return
                    }

                    let newBlock = JSON.parse(JSON.stringify(this.state.pieces_data[_key]))
                    newBlock.multiply = null

                    let leftEquationBlocks = this.state.leftEquationBlocks
                    let rightEquationBlocks = this.state.rightEquationBlocks
                    if (this.state.leftChecked) {
                        leftEquationBlocks.push(newBlock)
                    } else {
                        rightEquationBlocks.push(newBlock)
                    }

                    let point = 0
                    leftEquationBlocks.forEach((item) => {
                        point += item.point
                    })
                    rightEquationBlocks.forEach((item) => {
                        point += item.point
                    })

                    this.setState({
                        leftEquationBlocks: leftEquationBlocks,
                        rightEquationBlocks: rightEquationBlocks,
                        point: point,
                    }, this.calculatePoint)
                }}
            >{_key}</Button>
        )
    }

    generateEquationBlock = (stateName) => {
        return this.state[stateName].map((item, index) => {
            return (
                <GridRow key={index}>
                    <GridColumn>
                        <Label detail={`${index + 1}. ${item.name}`} style={{backgroundColor: 'rgba(0, 0, 0, 0)'}}/>
                        <Dropdown
                            style={{minWidth: '6em'}}
                            placeholder='x1'
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
                                let equationBlocks = this.state[stateName];
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
                                this.setState({[stateName]: equationBlocks}, this.calculatePoint)
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
                                    let equationBlocks = this.state[stateName];
                                    equationBlocks[index].value = value
                                    this.setState({[stateName]: equationBlocks}, this.calculatePoint)
                                }}
                            /> : <div/>
                        }
                        {
                            pieces[28] === item.name ? <TextArea
                                style={{width: '6em'}}
                                rows={1}
                                value={item.value}
                                onChange={(e, {value}) => {
                                    let equationBlocks = this.state[stateName];
                                    equationBlocks[index].value = value
                                    if (pieces.includes(value)) {
                                        this.setState({[stateName]: equationBlocks}, this.calculatePoint)
                                    } else {
                                        this.setState({[stateName]: equationBlocks})
                                    }
                                }}
                            /> : <div/>
                        }
                    </GridColumn>
                </GridRow>
            )
        })
    }

    calculatePoint = () => {
        let point = 0;
        let equationMultiply = 1
        this.state.leftEquationBlocks.forEach((item) => {
            point += item.point * (item.multiply || 1)
            equationMultiply *= (item.equationMultiply || 1)
        })
        this.state.midEquationBlocks.forEach((item) => {
            point += item.point
        })
        this.state.rightEquationBlocks.forEach((item) => {
            point += item.point * (item.multiply || 1)
            equationMultiply *= (item.equationMultiply || 1)
        })
        point *= equationMultiply
        this.validate()
        this.setState({point: point})
    }

    validate = () => {
        try {
            let eqTextList = this.state.leftEquationBlocks.concat(this.state.midEquationBlocks, this.state.rightEquationBlocks).map((value => {
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
                                <p
                                    style={{
                                        paddingLeft: '0px',
                                        paddingRight: '0px',
                                        margins: '0px',
                                        color: 'purple',
                                        fontSize: fontSize,
                                        backgroundColor: 'rgba(0, 0, 0, 0)'
                                    }}
                                >
                                    {
                                        this.state.leftEquationBlocks.map((value => {
                                            return value?.value.toString()
                                        })).join(' ')
                                    }
                                </p>
                                <p
                                    style={{
                                        paddingLeft: '0px',
                                        paddingRight: '0px',
                                        margins: '0px',
                                        color: 'green',
                                        fontSize: fontSize,
                                        backgroundColor: 'rgba(0, 0, 0, 0)'
                                    }}
                                >
                                    {
                                        this.state.midEquationBlocks.map((value => {
                                            return value?.value.toString()
                                        })).join(' ')
                                    }
                                </p>
                                <p

                                    style={{
                                        paddingLeft: '0px',
                                        paddingRight: '0px',
                                        margins: '0px',
                                        color: 'blue',
                                        fontSize: fontSize,
                                        backgroundColor: 'rgba(0, 0, 0, 0)'
                                    }}
                                >
                                    {
                                        this.state.rightEquationBlocks.map((value => {
                                            return value?.value.toString()
                                        })).join(' ')
                                    }
                                </p>
                            </GridRow>
                            <GridRow columns={2}>
                                <GridColumn>
                                    <Label
                                        detail={`Point: ${this.state.point}`}
                                        style={{fontSize: fontSize, backgroundColor: 'rgba(0, 0, 0, 0)'}}
                                    />
                                </GridColumn>
                                <GridColumn>
                                    <Radio
                                        toggle
                                        label={this.state.leftChecked ? 'left' : 'right'}
                                        checked={this.state.leftChecked}
                                        onChange={(e, {value}) => {
                                            this.setState({
                                                leftChecked: !this.state.leftChecked
                                            })
                                        }}
                                    />
                                </GridColumn>
                            </GridRow>
                            <GridRow columns={2}>
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
                                            this.clear(() => {
                                                let midEquationBlocks = []
                                                let rightEquationBlocks = []
                                                if (history.key) {
                                                    rightEquationBlocks = history.equationBlocks.map((block) => {
                                                        block.multiply = 1
                                                        block.equationMultiply = 1
                                                        return block
                                                    })
                                                } else {
                                                    midEquationBlocks = history.equationBlocks.map((block) => {
                                                        block.multiply = 1
                                                        block.equationMultiply = 1
                                                        return block
                                                    })
                                                }
                                                this.setState({
                                                    openScoreHistory: false,
                                                    refKey: history.key,
                                                    midEquationBlocks: midEquationBlocks,
                                                    rightEquationBlocks: rightEquationBlocks,
                                                }, this.calculatePoint)
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
                                            let leftEquationBlocks = this.state.leftEquationBlocks
                                            let rightEquationBlocks = this.state.rightEquationBlocks
                                            if (this.state.leftChecked) {
                                                leftEquationBlocks.pop()
                                            } else {
                                                rightEquationBlocks.pop()
                                            }
                                            this.setState({
                                                leftEquationBlocks: leftEquationBlocks,
                                                rightEquationBlocks: rightEquationBlocks,
                                            }, this.calculatePoint)
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
                                                equationBlocks: this.state.leftEquationBlocks.concat(this.state.midEquationBlocks, this.state.rightEquationBlocks),
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
                                        <GridRow columns={this.state.leftEquationBlocks.length > 0 ? 2 : 1}>
                                            <GridColumn>
                                                {this.state.leftEquationBlocks.length > 0 ? this.generateEquationBlock('leftEquationBlocks') :
                                                    <div/>}
                                            </GridColumn>
                                            <GridColumn>
                                                {this.generateEquationBlock('rightEquationBlocks')}
                                            </GridColumn>
                                        </GridRow>
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
