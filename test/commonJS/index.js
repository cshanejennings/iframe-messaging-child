var testModule = require('../../src/index');
var chai = require('chai');
//var sinon = require('sinon'),
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

describe('Sample Test', function () {
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
	it('should be using mocha', function () {
		if (false) {
			throw new Error('false is true, buckle up...');
		}
	});
	if (testModule.test !== 'done') {
		throw new Error('test method not returning correct string');
	}
});
