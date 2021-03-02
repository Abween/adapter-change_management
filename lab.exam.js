// Import built-in Node.js package path.
const path = require('path');


const ServiceNowConnector = require(path.join(__dirname, '/connector.js'));

const EventEmitter = require('events').EventEmitter;

class ServiceNowAdapter extends EventEmitter {

    constructor(id, adapterProperties) {
        // Call super or parent class' constructor.
        super();
        // Copy arguments' values to object properties.
        this.id = id;
        this.props = adapterProperties;
        // Instantiate an object from the connector.js module and assign it to an object property.
        this.connector = new ServiceNowConnector({
            url: this.props.url,
            username: this.props.auth.username,
            password: this.props.auth.password,
            serviceNowTable: this.props.serviceNowTable
        });
    }

    /**
     * @memberof ServiceNowAdapter
     * @method connect
     * @summary Connect to ServiceNow
     * @description Complete a single healthcheck and emit ONLINE or OFFLINE.
     *   IAP calls this method after instantiating an object from the class.
     *   There is no need for parameters because all connection details
     *   were passed to the object's constructor and assigned to object property this.props.
     */
    connect() {
        // As a best practice, Itential recommends isolating the health check action
        // in its own method.
        this.healthcheck();
    }

    /**
     * @memberof ServiceNowAdapter
     * @method healthcheck
     * @summary Check ServiceNow Health
     * @description Verifies external system is available and healthy.
     *   Calls method emitOnline if external system is available.
     *
     * @param {ServiceNowAdapter~requestCallback} [callback] - The optional callback
     *   that handles the response.
     */
    healthcheck(callback) {
        this.getRecord((result, error) => {
            /**
             * For this lab, complete the if else conditional
             * statements that check if an error exists
             * or the instance was hibernating. You must write
             * the blocks for each branch.
             */
            if (error) {
                /**
                 * Write this block.
                 * If an error was returned, we need to emit OFFLINE.
                 * Log the returned error using IAP's global log object
                 * at an error severity. In the log message, record
                 * this.id so an administrator will know which ServiceNow
                 * adapter instance wrote the log message in case more
                 * than one instance is configured.
                 * If an optional IAP callback function was passed to
                 * healthcheck(), execute it passing the error seen as an argument
                 * for the callback's errorMessage parameter.
                 */
                this.emitOffline();
            } else {
                /**
                 * Write this block.
                 * If no runtime problems were detected, emit ONLINE.
                 * Log an appropriate message using IAP's global log object
                 * at a debug severity.
                 * If an optional IAP callback function was passed to
                 * healthcheck(), execute it passing this function's result
                 * parameter as an argument for the callback function's
                 * responseData parameter.
                 */
                this.emitOnline();
            }
        });
    }
    /**
     * @memberof ServiceNowAdapter
     * @method emitOffline
     * @summary Emit OFFLINE
     * @description Emits an OFFLINE event to IAP indicating the external
     *   system is not available.
     */
    emitOffline() {
        this.emitStatus('OFFLINE');
        log.warn('ServiceNow: Instance is unavailable.');
    }

    /**
     * @memberof ServiceNowAdapter
     * @method emitOnline
     * @summary Emit ONLINE
     * @description Emits an ONLINE event to IAP indicating external
     *   system is available.
     */
    emitOnline() {
        this.emitStatus('ONLINE');
        log.info('ServiceNow: Instance is available.');
    }

    /**
     * @memberof ServiceNowAdapter
     * @method emitStatus
     * @summary Emit an Event
     * @description Calls inherited emit method. IAP requires the event
     *   and an object identifying the adapter instance.
     *
     * @param {string} status - The event to emit.
     */
    emitStatus(status) {
        this.emit(status, { id: this.id });
    }

    /**
     * @memberof ServiceNowAdapter
     * @method getRecord
     * @summary Get ServiceNow Record
     * @description Retrieves a record from ServiceNow.
     *
     * @param {ServiceNowAdapter~requestCallback} callback - The callback that
     *   handles the response.
     */
    getRecord(callback) {

        let result = [];
        var tickets = [];
        this.connector.get((data, error) => {
            if (error) {
                log.error(`\nError returned from GET request:\n${JSON.stringify(error)}`);
            }

            //console.log('data type:' + typeof data);
            if (data.body) {
                const bodyString = data.body;
               // console.log('data body type:' + typeof bodyString);
                const bodyObject = JSON.parse(bodyString);
               // console.log('body object type:' + typeof bodyObject);

                const result = JSON.parse(JSON.stringify(bodyObject.result));
               // console.log('body json type:' + typeof bodyJson);



               // console.log(bodyObject);

                for (let i = 0; i < result.length; i++) {
                    const res = {
                        change_ticket_number: result[i].number,
                        active:result[i].active,
                        priority:result[i].priority,
                        description:result[i].description,
                        work_start:result[i].work_start,
                        work_end:result[i].work_end,
                        change_ticket_key:result[i].sys_id
                    }
                    
                    tickets[i] = res;

                }
                //const arr []= bodyObject.result
                //const bodyJson = JSON.stringify(bodyObject);
                //console.log(arr[0]);
                //console.log(bodyJson.result[0]);
                //console.log(`\nResponse returned from GET request:\n${JSON.parse(data.body.number)}`)
                //console.log('\nResponse returned from GET request:\n'+JSON.stringify(JSON.parse(data.body)))
                //console.log(tickets[0].change_ticket_number);
               return tickets;
            }
        });

          
        
    }

   
    postRecord(callback) {
        /**
         * Write the body for this function.
         * The function is a wrapper for this.connector's post() method.
         * Note how the object was instantiated in the constructor().
         * post() takes a callback function.
         */
        this.connector.post(callback);

    }



}
/*
const test = new ServiceNowAdapter('123', {
    url: 'https://dev98800.service-now.com',
    auth: {
        username: 'admin',
        password: 'Secure@123'
    },
    serviceNowTable: 'change_request'
});
 */
//const t = test.getRecord();
//console.log(test.getRecord());
module.exports = ServiceNowAdapter;