/*
var JSAPI = {};
var initialized = false;
var widgetId;
var api = {};
var pw; //parent window
var root;

function onMessage (event) {

    var data = event.data || {};
    var method = JSAPI[data.method] || {};
    var args = data.arguments || [];

    if (typeof args !== 'object' || args.hasOwnProperty('length')) {
        args = [args];
    }
    if (method && typeof method === 'function') {
        data.returnedBy = data.method;
        delete data[method];
        try {
            data.response = method.apply(null, args);
         } catch (e) {
             data.response = 'error:' + e;
         }
    }
    if (data.hasOwnProperty('callback')) {
        console.log('callback found');
    }
    data.widgetId = widgetId;
    pw.postMessage(data, '*');
}

function post () {
    var c = [];
    c = c.splice.call(arguments, 0);
    pw.postMessage({
        method: c.shift(),
        arguments: c,
        widgetId: widgetId
    }, '*');
}

function addCallback (name, method) {
    JSAPI[name] = method;
    if (initialized) {
        post('addMethod', name);
    }
}

function call (method) {
    if (!method) { return; }
    var params = [];
    params = params.splice.call(arguments, 0);
    post(params.shift(), params);
}

function addInitializeCallback () {
    //add JSAPI methods to the parent
    addCallback('initialize', function (iframe) {
        var method;
        widgetId = iframe;
        for (method in JSAPI) {
            post('addMethod', method);
        }
        delete JSAPI.initialize;
        initialized = true;
        api.objectID = widgetId;
    });
}

api = {
    addCallback: addCallback,
    call: call,
    objectID: widgetId,
    post: post
};

module.exports = function (config) {
    root = config.root;
    pw = config.parent;
    widgetId = config.id;
    addInitializeCallback();
    root.addEventListener('message', onMessage, false);
    return api;
};
*/
module.exports = {
	test: 'done'
};