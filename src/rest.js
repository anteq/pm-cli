const axios = require('axios');
const CancelToken = axios.CancelToken;

class ApiCall {
    constructor(promise, cancelFunc) {
        this.promise = promise;
        this.cancelFunc = cancelFunc;
    }
    then(func) {
        this.promise = this.promise.then(func);
        return this;
    }
    cancel() {
        this.cancelFunc();
    }
}


function get(url, headers) {
    let cancel;
    let promise = axios({
        headers,
        method: 'GET',
        url,
        cancelToken: new CancelToken((c) => { cancel = c; })
    });
    return new ApiCall(promise, cancel);
}

function post(url, headers, body) {
    return axios({ headers, method: 'POST', body, url });
}

module.exports = { get, post };