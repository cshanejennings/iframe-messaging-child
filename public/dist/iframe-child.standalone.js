/*! iframe-child - v1.0.0 - 2015-01-26
* Copyright (c) 2015 [object Object];*/

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var JSAPI;
var widgetId;
var parentWindow;
var root;

// callAPIMethod attempts to take a message coming in from the parent and
// resolve it to a method stored on the JSAPI object.  It then calls that
// method with any arguments that might have been sent, captures the return
// of that function call and sends it back to the parent in the format

// @param method string = "routeReturn"
// @param widgetId string - the id of the widget intended to receive the message
// @param response * - the response of the function call, null if empty
// @param returnedBy string - the name of the method that is returning the value

function callAPIMethod (method, args, data) {
    args = (typeof args === 'undefined') ? [] : args;
    if ({}.toString.call(args) !== '[object Array]') {
        args = [args];
    }
    try {
        data.response = method.apply(null, args);
    } catch (e) {
        data.response = 'error:' + e;
    }
    parentWindow.postMessage(data, '*');
}

// onPostMessage receives a message sent via postMessage from the parent. The
// data parameter on the message comes with the following signature:

// @param method string - the name of the method as stored on the JSAPI
// @param widgetId string - the id of the widget intended to receive the message
// @param arguments array - the parameters to apply on the method

// onPostMessage will then verify the existence of the function and pass the
// necessary data on to callAPIMethod

function onPostMessage (event) {

    var data = event.data || {};
    var method = JSAPI[data.method] || {};

    if (typeof method === 'function' && data.widgetId === widgetId) {
        callAPIMethod(method, data.arguments, {
            widgetId: widgetId,
            method: 'routeReturn',
            returnedBy: data.method
        });
    }
}

// post is an internal method that wraps wraps the window's postmessage function
// it takes method and an optional args param

function post (method, args) {
    args = args || [];
    parentWindow.postMessage({
        method: method,
        arguments: args,
        widgetId: widgetId
    }, '*');
}

// addCallback is an exposed method that allows the user to expose a method to
// the parent's api.  It does this by using calling the "addMethod" method in
// the parent with the name of the function as the argument to that method

function addCallback (name, method) {
    JSAPI[name] = method;
    post('addMethod', name);
}

// call is an exposed method that allows the user to call an arbitrary method in
// the parent.  This might not be a good long term approach, but it is available
// for now to mimic flash's ExternalInterface signature since it is widely
// established and proven

function call (method) {
    if (!method) { return; }
    var params = [].splice.call(arguments, 0);
    post(params.shift(), params);
}

// createConnection adds a "ping" method to the parent that allows the user of
// parent to call widget.api.ping().response(function(val) {//true}); to see if
// the connection is active.

function createConnection () {
    root.addEventListener('message', onPostMessage, false);
    addCallback('ping', function () {
        return true;
    });
}

// internal initialization function that sets the environment variables and
// and creates the api object

function createJSAPI (c) {
    JSAPI = {};
    // In the browser, "root" will be the window object
    root = c.root;
    widgetId = c.id;
    parentWindow = c.parent;
}

module.exports = function (config) {
    createJSAPI(config);
    createConnection();
    return {
        addCallback: addCallback,
        call: call,
        objectID: widgetId
    };
};

},{}]},{},[1]);
