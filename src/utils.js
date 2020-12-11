import {floor} from "mathjs";

export const formatTime = (millis) => {
    const getMillis = `0${(millis)}`.slice(-2)
    let timer = floor(millis / 100)
    const getSeconds = `0${(timer % 60)}`.slice(-2)
    const minutes = `${Math.floor(timer / 60)}`
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)

    return `${getHours} : ${getMinutes} : ${getSeconds} : ${getMillis}`
}
