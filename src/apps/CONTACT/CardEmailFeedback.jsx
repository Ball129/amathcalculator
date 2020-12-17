import {Button, Card, Dimmer, Dropdown, Grid, GridColumn, GridRow, Menu, TextArea} from "semantic-ui-react";
import ModAlert from "../../components/ModAlert";
import React, {Component, useContext} from "react";
import {AppContext} from "../../constance/appContext";
import logger, {apiParser} from "../../CORE/services";
import axios from 'axios';


class CardCardEmailFeedbackComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            subject: `A-Math Calculator Feedback: BUG`,
            details: '',
        }

        this.alert = React.createRef()
    }

    sendFeedback = () => {
        logger(apiParser("emailFeedback"))
        this.setState({loading: true})

        const data = {
            subject: this.state.subject,
            details: this.state.details,
        }

        axios
            .post(apiParser("emailFeedback"), data)
            .then(res => {
                this.alert.current.header = 'Send Success'
                this.alert.current.show()
            })
            .catch((error) => {
                this.alert.current.header = 'Error'
                if (error.response.status === 400) {
                    this.alert.current.content = error.response.data
                } else {
                    this.alert.current.content = `${error.response.status}: ${error.response.data}`
                }
                this.alert.current.show()
            })
            .finally(() => {
                this.setState({loading: false})
            })
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
                                <Dropdown
                                    style={{minWidth: '10em'}}
                                    defaultValue={'BUG'}
                                    selection
                                    options={[
                                        {
                                            key: 'feature',
                                            text: 'Feature',
                                            value: 'FEATURE',
                                        },
                                        {
                                            key: 'bug',
                                            text: 'Bug',
                                            value: 'BUG',
                                        },
                                    ]}
                                    onChange={(e, {value}) => {
                                        this.setState({
                                            subject: `A-Math Calculator Feedback: ${value}`
                                        })
                                    }}
                                />
                            </GridRow>

                            <GridRow>
                                <TextArea
                                    style={{minWidth: '30em'}}
                                    rows={20}
                                    value={this.state.details}
                                    onChange={(e, {value}) => {
                                        this.setState({details: value})
                                    }}
                                />
                            </GridRow>

                            <GridRow>
                                <GridColumn>
                                    <Button
                                        floated={'right'}
                                        color={'blue'}
                                        circular
                                        onClick={() => {
                                            this.sendFeedback()
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </GridColumn>
                            </GridRow>
                        </Grid>
                    </Dimmer.Dimmable>
                </Card.Content>
            </Card>
        )
    }
}

export const CardEmailFeedback = (props) => {
    let appContext = useContext(AppContext);
    return <CardCardEmailFeedbackComponent {...props} {...appContext}/>
}
