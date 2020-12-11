import React from 'react';
import useTimer from "./useTimer";
import {formatTime} from "../../utils";
import {Button, Container, Grid, Header, Segment} from "semantic-ui-react";


const CardStopWatch = () => {
    const {timer, isActive, isPaused, handleStart, handlePause, handleResume, handleReset} = useTimer(0)

    return (
        <Container>
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Row>
                    <Grid.Column style={{maxWidth: 450}}>
                        <Segment>
                            <Header as={'h2'}>Stopwatch</Header>
                            <p style={{fontSize: '40px'}}>{formatTime(timer)}</p>
                            <div>
                                {
                                    !isActive ?
                                        <Button color={'blue'} basic onClick={handleStart}>Start</Button>
                                        : (
                                            !isPaused ? <Button color={'blue'} basic onClick={handlePause}>Pause</Button> :
                                                <Button color={'blue'} basic onClick={handleResume}>Resume</Button>
                                        )
                                }
                                <Button color={'blue'} basic onClick={handleReset} disabled={!isActive}>Reset</Button>
                            </div>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
}

export default CardStopWatch;
