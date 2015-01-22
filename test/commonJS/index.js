var externalInterface = require('../../src/index');
var chai = require('chai');
//var sinon = require('sinon'),
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Test Method Availability', function () {
	var child;
	var simParentWindow;
	var stub;
	var parentPostMessage;
	var simChildWindow = {
		addEventListener: function (id, func) { parentPostMessage = func; }
	};
	var widgetId = '000000000';
	var config = {
		root: simChildWindow,
		parent: simParentWindow,
		id: widgetId
	};

	beforeEach(function () {
		simParentWindow = {
			'postMessage': stub
		};
		child = externalInterface(config);
	// runs before each test in this block
	});

	it('should have the correct signature', function () {
		if (typeof child.addCallback !== 'function') {
			throw new Error('missing addCallback method');
		}
		if (typeof child.call !== 'function') {
			throw new Error('missing call method');
		}
		if (child.objectID !== widgetId) {
			throw new Error('objectID incorrect');
		}
	});

	it('should send a message when the call methods is used', function () {

	});
});
