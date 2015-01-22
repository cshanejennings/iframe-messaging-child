var testModule = require('../../src/index');
var chai = require('chai');
//var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

describe('Browser context test', function () {
	before(function () {
	// runs before all tests in this block
	});
	after(function () {
	// runs after all tests in this block
	});
	beforeEach(function () {
	// runs before each test in this block
	});
	afterEach(function () {
	// runs after each test in this block
	});
	it('should have access to the window', function () {
		if (!window) {
			throw new Error('no window object');
		}
	});
	it('should be able to use the module', function () {
		if (testModule.test !== 'done') {
			throw new Error('test method not returning correct string');
		}
	});
});
