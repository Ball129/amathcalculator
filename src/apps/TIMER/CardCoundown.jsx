import React, {useEffect, useState} from 'react';
import {formatTime} from "../../utils";
import {Button, Container, Dropdown, Grid, Header, Segment} from "semantic-ui-react";
import useCountdown from "./useCountdown";


const CardCountdown = () => {
    const defaultTime = 3 * 60 * 100
    const [countTime, setCountTime] = useState(defaultTime)
    const [timerColor, setTimerColor] = useState('#0000ff')
    const {timer, setInitial, isActive, isPaused, handleStart, handlePause, handleResume, handleReset} = useCountdown(defaultTime)

    useEffect(() => {
        if (isPaused) {
            setTimerColor('#0000ff')
        } else if (timer <= 0) {
            setTimerColor('#ff0000')
        } else if (timer <= countTime * 0.2) {
            setTimerColor('#ff7f43')
        } else if (isActive) {
            setTimerColor('#00ff00')
        } else {
            setTimerColor('#000000')
        }
    }, [isPaused, timer, countTime, isActive])

    return (
        <Container>
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Row>
                    <Grid.Column style={{maxWidth: 450}}>
                        <Segment>
                            <Header as={'h2'}>Countdown</Header>

                            <Dropdown
                                defaultValue={3 * 60 * 100}

                                selection
                                options={[
                                    {
                                        key: '10',
                                        text: '10 sec',
                                        value: 10 * 100,
                                    },
                                    {
                                        key: '1',
                                        text: '1 min',
                                        value: 1 * 60 * 100,
                                    },
                                    {
                                        key: '3',
                                        text: '3 min',
                                        value: 3 * 60 * 100,
                                    },
                                    {
                                        key: '5',
                                        text: '5 min',
                                        value: 5 * 60 * 100,
                                    },
                                ]}
                                onChange={(e, {value}) => {
                                    setCountTime(value)
                                    setInitial(value)
                                }}
                            />
                            <p style={{fontSize: '40px', color: timerColor}}>{formatTime(timer)}</p>
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

export default CardCountdown;
