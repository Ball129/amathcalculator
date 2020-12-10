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
import {AppContext} from "../constance/appContext";
import logger from "../CORE/services";


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
        }

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
                alert(error);
            });
    }

    static defaultProps = {}

    clear = () => {
        this.setState({
            equationBlocks: [],
            point: 0,
            valid: false,
        })
    }

    generateButton = (_key) => {
        let btnSize = '11vw'
        return (
            <Button
                key={_key}
                circular
                style={{width: btnSize, height: btnSize, padding: '0px', margin: '2px', textAlign: 'center'}}
                color={'teal'}
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
                <GridRow>
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
                                value: ['x2', 2],
                            },
                            {
                                key: 'x3',
                                text: 'x3',
                                value: ['x3', 3],
                            },
                            {
                                key: 'x2eq',
                                text: 'x2eq',
                                value: ['x2eq', 2],
                            },
                            {
                                key: 'x3eq',
                                text: 'x3eq',
                                value: ['x3eq', 3],
                            }
                        ]}
                        onChange={(e, {value}) => {
                            let equationBlocks = this.state.equationBlocks;
                            if (['x2eq', 'x3eq'].includes(value[0])) {
                                equationBlocks[index].multiply = 1
                                equationBlocks[index].equationMultiply = value[1]
                            } else if(value) {
                                equationBlocks[index].multiply = value[1]
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
                            onChange={(e, {value}) => {
                                if (pieces.includes(value)) {
                                    let equationBlocks = this.state.equationBlocks;
                                    equationBlocks[index].value = value
                                    this.setState({equationBlocks: equationBlocks}, this.calculatePoint)
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
            })).join('').replace(/[^0-9*\/()\-+.=]/g, '').split('=')
            logger({eqTextList})
            if (eqTextList.length < 2) {
                this.setState({valid: false})
                return
            }
            let result = null
            let valid = true
            eqTextList.forEach((eq) => {
                if (result === null) {
                    result = eval(eq)
                } else {
                    let newResult = eval(eq)

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
            <Card style={{height: '100vh'}} fluid>
                {/*<Button*/}
                {/*    onClick={(event => {*/}
                {/*        let firestore = this.props.db.firestore()*/}
                {/*        let collection = firestore.collection('config')*/}
                {/*        let data = {}*/}
                {/*        pieces.forEach((piece) => {*/}
                {/*            data[piece] = {*/}
                {/*                'name': piece,*/}
                {/*                'value': piece,*/}
                {/*                'point': 1*/}
                {/*            }*/}
                {/*        })*/}
                {/*        FirestoreService.setDocument(collection, 'pieces', data)*/}
                {/*    })}*/}
                {/*/>*/}

                <Card.Content>
                    <Dimmer.Dimmable>
                        <Dimmer active={this.state.loading} inverted/>

                        <Grid style={{padding: '1vw'}}>
                            <GridRow>
                                <Label detail={this.state.equationBlocks.map((value => {
                                    return value?.value.toString()
                                })).join(' ')} style={{fontSize: '1.5vh', backgroundColor: 'rgba(0, 0, 0, 0)'}}/>
                            </GridRow>
                            <GridRow>
                                <Label detail={`Point: ${this.state.point}`} style={{fontSize: '1.5vh', backgroundColor: 'rgba(0, 0, 0, 0)'}}/>
                                <div/>
                                <Label detail={'Valid:'} style={{fontSize: '1.5vh', backgroundColor: 'rgba(0, 0, 0, 0)'}}/>
                                {this.state.valid ? <Icon name={'checkmark'} color={'green'}/> : <Icon name={'close'} color={'red'}/>}
                            </GridRow>
                            <GridRow>
                                <GridColumn>
                                    <GridRow>
                                        {
                                            pieces.slice(0, 5).map((_key) => {
                                                return this.generateButton(_key)
                                            })
                                        }
                                        {this.generateButton(pieces[21])}
                                        {this.generateButton(pieces[24])}
                                    </GridRow>
                                    <GridRow>
                                        {
                                            pieces.slice(5, 10).map((_key) => {
                                                return this.generateButton(_key)
                                            })
                                        }
                                        {this.generateButton(pieces[22])}
                                        {this.generateButton(pieces[25])}
                                    </GridRow>
                                    <GridRow>
                                        {
                                            pieces.slice(10, 15).map((_key) => {
                                                return this.generateButton(_key)
                                            })
                                        }
                                        {this.generateButton(pieces[23])}
                                        {this.generateButton(pieces[26])}
                                    </GridRow>
                                    <GridRow>
                                        {
                                            pieces.slice(15, 20).map((_key) => {
                                                return this.generateButton(_key)
                                            })
                                        }
                                        {this.generateButton(pieces[20])}
                                        {this.generateButton(pieces[27])}
                                    </GridRow>
                                    <GridRow>
                                        {this.generateButton(pieces[28])}
                                    </GridRow>
                                </GridColumn>
                            </GridRow>
                            <GridRow>
                                <GridColumn>
                                    <Button floated={'right'} color={'red'} circular
                                            onClick={() => {
                                                this.clear()
                                            }}
                                    >Clear</Button>
                                    <Button floated={'right'} color={'red'} circular
                                            onClick={() => {
                                                let equationBlocks = this.state.equationBlocks;
                                                equationBlocks.pop()
                                                this.setState({equationBlocks: equationBlocks}, this.calculatePoint)
                                            }}
                                    >Undo</Button>
                                </GridColumn>
                            </GridRow>
                            <GridRow>
                                <p>เพิ่มตัวคูณ</p>
                                <Segment style={{
                                    height: '30vh',
                                    width: '90%',
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    border: '10px'
                                }}>
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
