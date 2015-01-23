
var JSAPI = {};
var widgetId;
var api = {};
var parentWindow; //parent window
var root;

// onMessage receives a message sent via postMessage from the parent.  The data
// parameter on the message comes with the following signature:
// @param method string - the name of the method as stored on the JSAPI
// @param widgetId string - the id of the widget intended to receive the message
// @param arguments array - the parameters to apply on the method
// onMessage will then call the registerd function (if there is one) and send
// the response back to the parent (if there is one) using the following format:
// @param method string = "routeReturn"
// @param widgetId string - the id of the widget intended to receive the message
// @param response * - the response of the function call, null if empty
// @param returnedBy string - the name of the method that is returning the value

function onMessage (event) {

    var data = event.data || {};
    var method = JSAPI[data.method] || {};
    var args = data.arguments || [];
    console.log('data', data);
    if ({}.toString.call(args) !== '[object Array]') {
        args = [args];
    }
    if (typeof method === 'function' && data.widgetId === widgetId) {
        try {
            data.response = method.apply(null, args);
        } catch (e) {
            data.response = 'error:' + e;
        }

        data.returnedBy = data.method;
        data.method = 'routeReturn';

        delete data.arguments;

        if (data.hasOwnProperty('callback')) {
            console.log('callback found');
        }
        parentWindow.postMessage(data, '*');
    }
}

function post (method, args) {
    args = args || [];
    parentWindow.postMessage({
        method: method,
        arguments: args,
        widgetId: widgetId
    }, '*');
}

function addCallback (name, method) {
    JSAPI[name] = method;
    post('addMethod', name);
}

function call (method) {
    if (!method) { return; }
    var params = [].splice.call(arguments, 0);
    post(params.shift(), params);
}

function addConnectionCallback () {
    addCallback('ping', function () {
        return true;
    });
}

api = {
    addCallback: addCallback,
    call: call
};

module.exports = function (config) {
    root = config.root;
    widgetId = config.id;
    parentWindow = config.parent;
    api.objectID = config.id;
    addConnectionCallback();
    // In the browser, "root" is the window object
    root.addEventListener('message', onMessage, false);

    return api;
};
