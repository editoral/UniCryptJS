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
			functionTypingTwo: function() {
				return 'maybe';
			}.paramType(['Constructorless', 'object']),
            functionTypingThree: function() {
                return '20';
            }.paramType(['string']).returnType('int'),
            functionTypingFour: function() {
                return 20;
            }.paramType(['int']).returnType('int')
		});
		//Childclass inherits from BaseClass
		ChildClass = Op.Class('ChildClass',{
                'extends': BaseClass    
            }, {
			//override
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
				return this.preInitVariable + this.preInitVarChild;
			}
		});

		ClassWithoutConstructor = Op.Class('Constructorless', null,{

		});

	});
    //Checking static typing
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
    		baseClass.functionTypingTwo(childClass, {});
    	}
    	expect(test).to.throwError();
    });
	it('checks typing correctness in function parameter with named classes working', function() {
		var baseClass = new BaseClass(10);
		var constLess = new ClassWithoutConstructor(10,20);
		var test = function() {
    		baseClass.functionTypingTwo(constLess, {});
    	}
    	expect(test).to.not.throwError();
    });
    it('test typing correctness of return value', function() {
        var baseClass = new BaseClass(10);
        var test = function() {
            baseClass.functionTypingThree('hallo');
        }
        expect(test).to.throwError();
    });
    it('test typing correctness of return value 2', function() {
        var baseClass = new BaseClass(10);
        var test = function() {
            baseClass.functionTypingFour(10);
        }
        expect(test).to.not.throwError();
    });      
    //Testing correct Class generation
    it('tests correctness of properties in Baseclass', function() {
        var baseClass = new BaseClass(10);
        var number = baseClass.preInitVariable + baseClass.x;
        expect(number).to.be(30);
    });
    it('tests correctness of properties in ChildClass', function() {
        var childClass = new ChildClass(20,50);
        expect(childClass.combineVarsChildParent()).to.be(39);
    });
    it('tests correctness of overwriting properties in ChildClass', function() {
        var childClass = new ChildClass(20,50);
        expect(childClass.toBeOverwritten).to.be(30);
    });
    it('tests constructor and superconstructor in ChildClass', function() {
        var childClass = new ChildClass(20,50);
        expect(childClass.combineVarsFromBothConstructors()).to.be(70);
    });
    it('', function() {

    });
});

describe('Function overloading', function() {
    var BaseClass;
    before(function() {
        BaseClass = Op.Class('BaseClass', null,{
            func1: function(int1) {
                return int1;
            }.paramType(['int']).returnType('int'),
            func2: function(int1, int2) {
                return int1 + int2;
            }.paramType(['int','int']).returnType('int'),
            func3: function(int1, int2, string1) {
                return string1 + (int1 + int2);
            }.paramType(['int','int', 'string']).returnType('string'),
            func4: function(string1) {
                return string1 + ' one single argument';
            }.paramType(['string']).returnType('string')
        });
    });
    it('tests overload with int param', function() {
        var baseClass = new BaseClass();
        var result = baseClass.func(10);
        expect(result).to.be(10);
    });
    it('tests overload with string param', function() {
        var baseClass = new BaseClass();
        var result = baseClass.func('Just');
        expect(result).to.be('Just one single argument');
    });
    it('tests overload with double int param', function() {
        var baseClass = new BaseClass();
        var result = baseClass.func(10,40);
        expect(result).to.be(50);
    });    
    it('tests overload with tripple param', function() {
        var baseClass = new BaseClass();
        var result = baseClass.func(10,40, 'Result: ');
        expect(result).to.be('Result: 50');
    });  
});