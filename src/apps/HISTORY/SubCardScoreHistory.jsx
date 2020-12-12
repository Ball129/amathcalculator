import React, {Component} from 'react';
import {Button, Card, CardContent} from "semantic-ui-react";
import {withFirestore} from "react-firestore";

let deleteBtnStyle = {
    float: "right"
};

class SubCardScoreHistory extends Component {

    constructor(props) {
        super(props);
        this.onClickDelete = this.onClickDelete.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange = (e) => {
        this.setState({
            messageUpdate: e.target.value
        });
    }

    onUpdate = (e) => {
        return this.props.onEditHistory()
    }

    onClickDelete = (e) => {
        e.preventDefault();

        let dbCon = this.props.db.database().ref(`/messages/${this.props.currentUserName}`);
        dbCon.child(this.props.refKey).remove();
    }

    getEquationSummary = () => {
        return this.props.equationBlocks.map((value => {
            return value?.value.toString()
        })).join(' ')
    }

    render() {
        return (
            <Card key={this.props.refKey} fluid>
                <CardContent textAlign={'left'}>
                    <p>{this.getEquationSummary()}: {this.props.point}</p>
                    <Button basic color='red' style={deleteBtnStyle} onClick={this.onClickDelete}>
                        Delete
                    </Button>
                    <Button basic color='orange' style={deleteBtnStyle} onClick={this.onUpdate}>
                        Update
                    </Button>
                </CardContent>
            </Card>
        )
    }
}

export default withFirestore(SubCardScoreHistory)