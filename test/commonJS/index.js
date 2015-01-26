var externalInterface = require('../../src/index');
var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Test Child\'s api', function () {
	var child;
	var simParentWindow;
	var stub;
	var sendPMFromParent;
	var simChildWindow = {
		addEventListener: function (id, func) { sendPMFromParent = func; }
	};
	var widgetId = '000000001';

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
	});

	describe('Test child\'s ping method registration', function () {

		it('should have the correct parameters', function () {
			var respData = stub.firstCall.args[0];
			expect(respData).to.have.property('widgetId');
			expect(respData).to.have.property('method');
			expect(respData).to.have.property('arguments');
		});

		it('should have the correct content', function () {
			var respData = stub.firstCall.args[0];
			expect(respData.widgetId).to.equal(widgetId);
			expect(respData.method).to.equal('addMethod');
			expect(respData.arguments).to.contain('ping');
		});

	});

	describe('Test child\'s method signature', function () {

		it('child api should have the correct signature', function () {
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

		it('should produce a response to a method call', function () {
			var messageData = {
				data: {
					method: 'ping',
					widgetId: widgetId,
					arguments: []
				}
			};
			sendPMFromParent(messageData);
			var respData = stub.lastCall.args[0];
			expect(respData.widgetId).to.equal(widgetId);
			expect(respData.method).to.equal('routeReturn');
			expect(respData.response).to.equal(true);
			expect(respData.returnedBy).to.equal('ping');
		});
	});

	describe([
			'Test child\'s receiving an Add Method window message for a method',
			' called "test"'
			].join(''), function () {

		it('should have the correct content', function () {
			child.call('test');
			var respData = stub.secondCall.args[0];
			/*jshint -W030 */
			expect(respData.widgetId).to.equal(widgetId);
			expect(respData.method).to.equal('test');
			expect(respData.arguments).to.be.empty;
		});

		it('should produce a response to a method call', function () {
			var messageData = {
				data: {
					method: 'ping',
					widgetId: widgetId,
					arguments: []
				}
			};
			sendPMFromParent(messageData);
			var respData = stub.lastCall.args[0];
			expect(respData.widgetId).to.equal(widgetId);
			expect(respData.method).to.equal('routeReturn');
			expect(respData.response).to.equal(true);
			expect(respData.returnedBy).to.equal('ping');
		});

	});
});
