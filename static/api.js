const axios = require('axios');

// axios client that sends access token in the header
export const client = axios.create({
    withCredentials: true,
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    }
});

/*
    This chunk defines the token refresh mechanism. Taken from (https://www.techynovice.com/setting-up-JWT-token-refresh-mechanism-with-axios/)
*/
var isAlreadyFetchingAccessToken = false;
var subscribers = [];

async function resetTokenAndReattemptRequest(error) {
    try {
        const { response: errorResponse } = error; // get the config that was denied because of an invalid token
        const resetToken = localStorage.getItem('refresh_token')
        if (!resetToken) {
            // if no reset token is found, reject
            return Promise.reject(error);
        }
        // new Promise to retry the original request from the list of subscribers
        const retryOriginalRequest = new Promise(resolve => {
            addSubscriber(access_token => {
                errorResponse.config.headers.Authorization = 'Bearer ' + access_token; // set the new access token as a header to the response that was denied
                resolve(client(errorResponse.config)); // try the api call again
            });
        });

        if (!isAlreadyFetchingAccessToken) {
            // If not already getting a new token, get a new one (await the response before continuing)
            isAlreadyFetchingAccessToken = true;
            const response = await axios({ // use global client to not send access token header, only reset token
                method: 'post',
                url: '/api/token-refresh/',
                headers: {
                    Authorization: 'Bearer ' + resetToken
                }
            });

            if (!response.data) {
                // If there is an error, send a reject
                return Promise.reject(error);
            }

            const newToken = response.data['access_token'];
            localStorage.setItem('access_token', newToken); // store the new token
            isAlreadyFetchingAccessToken = false;
            onAccessTokenFetched(newToken);
        }
        return retryOriginalRequest;
    } catch(err) {
        console.log(err);
    }
}
function onAccessTokenFetched(access_token) {
    // Process the list of subscribers once the access token has been refreshed
    subscribers.forEach(callback => callback(access_token));
    subscribers = [];
}
function addSubscriber(callback) {
    // Add a subscriber to the list while the access token is being refreshed
    subscribers.push(callback);
}

client.interceptors.response.use(function(response) {
    // Intercept the response. If there is no error, just return the normal response
    return response;
}, function(error) {
    // if there is an error, and it was a 401 (access denied)
    if (error.response.status == 401) {
        return resetTokenAndReattemptRequest(error); // retry the request (accepts the error config)
    };
    return Promise.reject(error); // If it wasn't a 401, it is uncaught and a reject is thrown
});

export default client;
