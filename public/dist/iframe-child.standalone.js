/*! iframe-child - v1.0.0 - 2015-01-22
* Copyright (c) 2015 [object Object];*/

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
            if (JSAPI.hasOwnProperty(method)) {
                post('addMethod', method);
            }
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

},{}]},{},[1]);
