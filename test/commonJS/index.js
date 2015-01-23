var externalInterface = require('../../src/index');
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Test Method Availability', function () {
	var child;
	var simParentWindow;
	var stub;
	var sendParentPostMessage;
	var simChildWindow = {
		addEventListener: function (id, func) { sendParentPostMessage = func; }
	};
	var widgetId = '000000000';

	beforeEach(function () {
		stub = sinon.spy();
		simParentWindow = {
			'postMessage': stub
		};
		child = externalInterface({
			root: simChildWindow,
			parent: simParentWindow,
			id: widgetId
		});
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

	it('should send a message when the call method is used', function () {
		child.call('test');
		/*jshint -W030 */
		expect(stub).to.have.been.called;
	});

	it('message should have the correct content', function () {
		child.call('test');
		/*jshint -W030 */
		var respData = stub.firstCall.args[0];
		expect(respData.widgetId).to.equal(widgetId);
		expect(respData.method).to.equal('test');
		expect(respData.arguments).to.be.empty;
	});
});
