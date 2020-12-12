import {SubScoreHistoryList} from "./SubScoreHistoryList";
import React, {useContext} from "react";
import {Grid, Modal, Button, Icon} from "semantic-ui-react";
import logger from "../../CORE/services";
import {AppContext} from "../../constance/appContext";
import ModConfirm from "../../components/ModConfirm";
import RealTimeDbService from "../../FIREBASE/realtimeDbService";


class ModScoreHistoryComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            totalPoint: 0
        }
    }

    componentDidMount() {
    }

    static defaultProps = {
        loading: false,
        openModal: false,
        openModalConfirm: false,
        onOpen: () => {
        },
        onClose: () => {
        },
        onEditHistory: () => {
        }
    }

    setClose = () => {
        this.props.onClose()
        logger("Close")
    }

    render() {
        return (
            <Modal
                size={'tiny'}
                open={this.props.openModal}
                onOpen={this.props.onOpen}
                onClose={this.setClose}
            >
                <Button floated={'right'} style={{backgroundColor: 'rgba(0, 0, 0, 0)', padding: '0.5em'}}
                        onClick={() => {
                            this.setClose()
                        }}
                >
                    <Icon className={'close'} color={'red'}/>
                </Button>

                <ModConfirm
                    loading={this.state.loading}
                    onClose={() => {
                        this.setState({openModalConfirm: false})
                    }}
                    onConfirm={() => {
                        let dbRef = this.props.db.database().ref(`/messages/${this.props.currentUserName}`);
                        this.setState({loading: true})
                        RealTimeDbService.removeAll(dbRef)
                            .then(() => {
                                logger('History Cleared')
                                this.props.setTotalPoint(0)
                                this.setState({
                                    loading: false,
                                    openModalConfirm: false
                                })
                            }).catch(() => {
                        })
                    }}
                    onDeny={() => {
                        this.setState({openModalConfirm: false})
                    }}
                    header={'Clear History ?'}
                    open={this.state.openModalConfirm}
                />

                <Modal.Header>{this.props.currentUserName}: Total Point = {this.state.totalPoint}
                    <Button floated={'right'} color={'grey'} basic onClick={() => {
                        this.setState({openModalConfirm: true})
                    }}>Clear History</Button>
                </Modal.Header>

                <Modal.Content>
                    <Grid textAlign={'center'} style={{maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden'}}>
                        <Grid.Row>
                            <Grid.Column>
                                <SubScoreHistoryList onEditHistory={this.props.onEditHistory}
                                                     setTotalPoint={(totalPoint) => {
                                                         this.setState({totalPoint: totalPoint})
                                                     }}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
            </Modal>
        );
    }
}

export const ModScoreHistory = (props) => {
    let appContext = useContext(AppContext);
    return <ModScoreHistoryComponent {...props} {...appContext}/>
};
