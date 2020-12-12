import React, {Component, useContext} from 'react';
import {AppContext} from "../../constance/appContext";
import RealTimeDbService from "../../FIREBASE/realtimeDbService";
import SubCardScoreHistory from "./SubCardScoreHistory";
import {Container, Dimmer} from "semantic-ui-react";


class SubScoreHistoryListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            scoreHistory: []
        };
    }

    componentDidMount() {
        let dbRef = this.props.db.database().ref(`/messages/${this.props.currentUserName}`);
        this.setState({loading: true})
        RealTimeDbService.getData(dbRef)
            .then((data) => {
                this.props.setTotalPoint(
                    data.reduce((totalPoint, d)=>{return totalPoint += d.point}, 0)
                )
                this.setState({
                    loading: false,
                    scoreHistory: data
                });
            }).catch(() => {
        })
    }

    render() {
        return (
            <Container>
                <Dimmer.Dimmable>
                    <Dimmer active={this.state.loading} inverted/>
                    {this.state.scoreHistory.map((history) => {
                        return (
                            <SubCardScoreHistory key={history.key} refKey={history.key} point={history.point}
                                                 equationBlocks={history.equationBlocks}
                                                 db={this.props.db}
                                                 onEditHistory={() => {
                                                     this.props?.onEditHistory(history)
                                                 }}/>
                        )
                    })}
                </Dimmer.Dimmable>
            </Container>
        );
    }
}


export const SubScoreHistoryList = (props) => {
    let appContext = useContext(AppContext);
    return <SubScoreHistoryListComponent {...props} {...appContext}/>
};
