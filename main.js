
const options = {
  url: 'https://dev98800.service-now.com',
  username: 'admin',
  password: 'Secure@123'
};

const request = require('request');

const validResponseRegex = /(2\d\d)/;


/**
 * This is a [JSDoc comment]{@link http://usejsdoc.org/tags-description.html}.
 * See http://usejsdoc.org/tags-description.html.
 *
 * @callback iapCallback
 * @description A [callback function]{@link
 *   https://developer.mozilla.org/en-US/docs/Glossary/Callback_function}
 *   is a function passed into another function as an argument, which is
 *   then invoked inside the outer function to complete some kind of
 *   routine or action.
 *
 * @param {*} responseData - When no errors are caught, return data as a
 *   single argument to callback function.
 * @param {error} [errorMessage] - If an error is caught, return error
 *   message in optional second argument to callback function.
 */

/**
 * @function get
 * @description Call the ServiceNow GET API.
 *
 * @param {string} serviceNowTable - The table target of the ServiceNow table API.
 * @param {iapCallback} callback - Callback a function.
 * @param {*} callback.data - The API's response. Will be an object if sunnyday path.
 *   Will be HTML text if hibernating instance.
 * @param {error} callback.error - The error property of callback.
 */
function get(serviceNowTable, callback) {
  let callbackData = null;
  let callbackError = null;

  const requestOptions = {
    method: 'GET',
    auth: {
      user: options.username,
      pass: options.password,
    },
    baseUrl: options.url,
    uri: `/api/now/table/${serviceNowTable}?sysparm_limit=1`,
  };

  request(requestOptions, (error, response, body) => {
    if (error) {
      console.error('Error present.');
      callbackError = error;
    } else if (!validResponseRegex.test(response.statusCode)) {
      console.error('Bad response code.');
      callbackError = response;
    } else if (response.body.includes('Instance Hibernating page')) {
      callbackError = 'Service Now instance is hibernating';
      console.error(callbackError);
    } else {
      callbackData = response;
    }
    return callback(callbackData, callbackError);
  });

}

/**
 * @function post
 * @description Call the ServiceNow POST API.
 *
 * @param {string} serviceNowTable - The table target of the ServiceNow table API.
 * @param {iapCallback} callback - Callback a function.
 * @param {*} callback.data - The API's response. Will be an object if sunnyday path.
 *   Will be HTML text if hibernating instance.
 * @param {error} callback.error - The error property of callback.
 */
function post(serviceNowTable, callback) {
  let callbackData = null;
  let callbackError = null;

  const requestOptions = {
    method: 'POST',
    auth: {
      user: options.username,
      pass: options.password,
    },
    baseUrl: options.url,
    uri: `/api/now/table/${serviceNowTable}`,
  };

  request(requestOptions, (error, response, body) => {
    if (error) {
      console.error('Error present.');
      callbackError = error;
    } else if (!validResponseRegex.test(response.statusCode)) {
      console.error('Bad response code.');
      callbackError = response;
    } else if (response.body.includes('Instance Hibernating page')) {
      callbackError = 'Service Now instance is hibernating';
      console.error(callbackError);
    } else {
      callbackData = response;
    }
    return callback(callbackData, callbackError);
  });

}

function main() {
  get('change_request', (data, error) => {
    if (error) {
      console.error(`\nError returned from GET request:\n${JSON.stringify(error)}`);
    }
    console.log(`\nResponse returned from GET request:\n${JSON.stringify(data)}`)
  });
  post('change_request', (data, error) => {
    if (error) {
      console.error(`\nError returned from POST request:\n${JSON.stringify(error)}`);
    }
    console.log(`\nResponse returned from POST request:\n${JSON.stringify(data)}`)
  });
}
main();