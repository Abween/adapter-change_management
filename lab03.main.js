
const options = {
  url: 'https://dev98800.service-now.com',
  username: 'admin',
  password: 'Secure@123'
};

const request = require('request');

const validResponseRegex = /(2\d\d)/;

function constructUri(serviceNowTable, query = null) {
  let uri = `/api/now/table/${serviceNowTable}`;
  if (query) {
    uri = uri + '?' + query;
  }
  return uri;
}


function isHibernating(response) {
  return response.body.includes('Instance Hibernating page')
  && response.body.includes('<html>')
  && response.statusCode === 200;
}



function processRequestResults(error, response, body, callback) {
     let callbackData = null;
    let callbackError = null;
    
   if (error) {
      console.error('Error present.');
      callbackError = error;
    } else if (!validResponseRegex.test(response.statusCode)) {
      console.error('Bad response code.');
      callbackError = response;
    } else if (isHibernating(response)) {
      callbackError = 'Service Now instance is hibernating';
      console.error(callbackError);
    } else {
      callbackData = response;
    }
    return callback(callbackData, callbackError);
}


function sendRequest(callOptions, callback) {
  // Initialize return arguments for callback
  let uri;
  if (callOptions.query)
    uri = constructUri(callOptions.serviceNowTable, callOptions.query);
  else
    uri = constructUri(callOptions.serviceNowTable);
  
  const requestOptions = {
       method: callOptions.method,
    auth: {
      user: options.username,
      pass: options.password,
    },
    baseUrl: options.url,
    uri: uri,
  };
  
  request(requestOptions, (error, response, body) => {
    processRequestResults(error, response, body, (processedResults, processedError) => callback(processedResults, processedError));
  });
}


function get(callOptions, callback) {
  callOptions.method = 'GET';
  callOptions.query = 'sysparm_limit=1';
  //console.log(JSON.stringify(callOptions));
  sendRequest(callOptions, (results, error) => callback(results, error));
}


function post(callOptions, callback) {
  callOptions.method = 'POST';
  sendRequest(callOptions, (results, error) => callback(results, error));
}



function main() {
  get({ serviceNowTable: 'change_request' }, (data, error) => {
    if (error) {
      console.error(`\nError returned from GET request:\n${JSON.stringify(error)}`);
    }
    console.log(`\nResponse returned from GET request:\n${JSON.stringify(data)}`)
  });
  post({ serviceNowTable: 'change_request' }, (data, error) => {
    if (error) {
      console.error(`\nError returned from POST request:\n${JSON.stringify(error)}`);
    }
    console.log(`\nResponse returned from POST request:\n${JSON.stringify(data)}`)
  });
}


main();