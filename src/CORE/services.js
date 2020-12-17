import apis from '../constance/apis.json'

const logger = (data) => {
    if (process.env.NODE_ENV === 'production') return;
    console.log(data);
}

export const apiParser = (apiName) => {
    let baseApi = apis.baseApis
    if (process.env.NODE_ENV === 'production') {
        return baseApi + apis[apiName];
    }
    else {
        return 'http://localhost:8080' + apis[apiName]
    }
}

export default logger;