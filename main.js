
const options = {
  url: 'https://dev98800.service-now.com',
  username: 'admin',
  password: 'Secure@123',
  serviceNowTable: 'change_request'
};
// Import built-in Node.js package path.
const path = require('path');


const ServiceNowConnector = require(path.join(__dirname, './connector.js'));


function mainOnObject() {
  // Instantiate an object from class ServiceNowConnector.
  const connector = new ServiceNowConnector(options);
  // Test the object's get and post methods.
  // You must write the arguments for get and post.
  connector.get((data, error) => {
    if (error) {
      console.error(`\nError returned from GET request:\n${JSON.stringify(error)}`);
    }
    console.log(`\nResponse returned from GET request:\n${JSON.stringify(data)}`)
  });
  connector.post((data, error) => {
    if (error) {
      console.error(`\nError returned from GET request:\n${JSON.stringify(error)}`);
    }
    console.log(`\nResponse returned from GET request:\n${JSON.stringify(data)}`)
  });

}

// Call mainOnObject to run it.
mainOnObject();