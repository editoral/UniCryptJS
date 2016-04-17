var assert = require('assert');
var expect = require('expect.js');
var build = require('../dist/demoBuild.js');

describe('Class declaration and inheritance', function() {
	var BaseClass;
	var ClassWithoutConstructor;
	var ChildClass;
	before(function() {
		// Named Base class
		BaseClass = Op.Class('BaseClass', null,{
			//in constructor assigned variable
			preInitVariable: null,
			//instance variable with preset value
			x: 20,
			//variable to override
			toBeOverwritten: null,
			// constructor function
			init: function(initVar) {
				this.preInitVariable = initVar;
			//paramType, spezifies input type
			}.paramType(['int']),
			//function to test the typing
			functionTyping: function() {
				return 'ok';
			}.paramType(['int', 'boolean', 'string']),
			//second function to test typing
			functionTyping2: function() {
				return 'ok';
			}.paramType(['Constructorless', 'object'])
		});
		//Childclass inherits from BaseClass
		ChildClass = Op.Class('ChildClass',{
                'extends': demo.fw.BaseClass    
            }, {
			//oberride
			toBeOverwritten: 30,
			//Own constructor assigned Variable
			preInitVarChild: null,
			//Instance variable
			y: 19,
			init: function(initVar, superInitVar) {
				this.preInitVarChild = initVar;
				this.$$super(superInitVar);
			},
			combineVarsChildParent: function() {
				return this.x + this.y;
			},
			combineVarsFromBothConstructors: function() {
				return preInitVariable + preInitVarChild;
			}
		});

		ClassWithoutConstructor = Op.Class('Constructorless', null,{

		});

	});
    it('checks typing correctness in constructor', function() {
    	var test = function () {
    		var b = new BaseClass('10');
    	}
    	expect(test).to.throwError();
    });
    it('checks typing correctness in function parameter int', function() {
    	var baseClass = new BaseClass(10);
    	var test = function() {
    		baseClass.functionTyping('10', true, 'String');
    	}
    	expect(test).to.throwError();
    });
    it('checks typing correctness in function parameter int', function() {
    	var baseClass = new BaseClass(10);
    	var test = function() {
    		baseClass.functionTyping('10', true, 'String');
    	}
    	expect(test).to.throwError();
    });
    it('checks typing correctness in function parameter boolean', function() {
    	var baseClass = new BaseClass(10);
    	var test = function() {
    		baseClass.functionTyping(10, 20, 'String');
    	}
    	expect(test).to.throwError();
    });
    it('checks typing correctness in function parameter string', function() {
    	var baseClass = new BaseClass(10);
    	var test = function() {
    		baseClass.functionTyping(10, true, 20);
    	}
    	expect(test).to.throwError();
    });      
    it('checks typing correctness in function parameter working', function() {
    	var baseClass = new BaseClass(10);
        baseClass.functionTyping(10, true, 'hallo');
    	var test = function() {
    		baseClass.functionTyping(10, true, 'hallo');
    	}
    	expect(test).to.not.throwError();
    });
    it('checks typing correctness wrong nr of params', function() {
    	var baseClass = new BaseClass(10);
    	var test = function() {
    		baseClass.functionTyping(10, true);
    	}
    	expect(test).to.throwError();
    });             
    it('checks typing correctness in function parameter with named classes', function() {
		var baseClass = new BaseClass(10);
		var childClass = new ChildClass(10,20);
		var test = function() {
    		baseClass.functionTyping2(childClass, {});
    	}
    	expect(test).to.throwError();
    });
	it('checks typing correctness in function parameter with named classes working', function() {
		var baseClass = new BaseClass(10);
		var constLess = new ClassWithoutConstructor(10,20);
		var test = function() {
    		baseClass.functionTyping2(constLess, {});
    	}
    	expect(test).to.not.throwError();
    });

});