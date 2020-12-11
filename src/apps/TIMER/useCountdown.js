import {useState, useRef, useEffect} from 'react';


const useCountdown = (initialState = 3*60*100) => {
    const [timer, setTimer] = useState(initialState)
    const [initial, setInitial] = useState(initialState)
    const [isActive, setIsActive] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const countRef = useRef(null)

    useEffect(() => {
        end()
        setTimer(initial)
    }, [initial]);

    useEffect(() => {
        if (timer <= 0) {
            end()
        }
    })

    const count = () => {
        setTimer((timer) => timer - 1)
    }

    const end = () => {
        clearInterval(countRef.current)
        setIsActive(false)
        setIsPaused(false)
    }

    const handleStart = () => {
        setTimer(initial)
        setIsActive(true)
        setIsPaused(false)
        countRef.current = setInterval(() => {
            count()
        }, 10)
    }

    const handlePause = () => {
        clearInterval(countRef.current)
        setIsPaused(true)
    }

    const handleResume = () => {
        setIsPaused(false)
        countRef.current = setInterval(() => {
            count()
        }, 10)
    }

    const handleReset = () => {
        end()
        setTimer(initial)
    }

    return {timer, setInitial, isActive, isPaused, handleStart, handlePause, handleResume, handleReset}
}

export default useCountdown
