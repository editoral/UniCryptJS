var assert = require('assert');
var build = require('../dist/demoBuilt.js');


describe('A first example', function() {
    it('will write names but can\'t', function () {
      assert.equal("Tom Dimitri", demo.execute());
    });
    it('will now have instance variables', function() {
    	assert.equal("Tom Dimitri", demo.execute2());
    });
    it('calls a private function', function() {
    	assert.equal("undefined", demo.execute3());
    });
    it('it calls a privileged', function() {
    	assert.equal(30, demo.execute4());
    });
});
