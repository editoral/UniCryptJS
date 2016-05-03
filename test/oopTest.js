var assert = require('assert');
var expect = require('expect.js');
var build = require('../dist/demoBuild.js');

describe('Class declaration and inheritance', function() {
	var BaseClass;
	var ClassWithoutConstructor;
	var ChildClass;
    var GrandChild;
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

        GrandChild = Op.Class('GrandChild', {
            'extends': ChildClass
        },{
            grandChildFunction: function() {
                return 'hi from grandchild';
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
    it('instantiate a grandchild and tests function', function() {
        var grandChild = new GrandChild();
        expect(grandChild.grandChildFunction()).to.be('hi from grandchild');
    });
    it('instantiate a grandchild and tests parent function', function() {
        var grandChild = new GrandChild();
        expect(grandChild.functionTypingFour(20)).to.be(20);
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

describe('Abstract classes and inheritance', function() {
    var AbstractClass;
    var RealClass1;
    var RealClass2;
    var AbstractClass2;
    var GrandChild;
    before(function() {
        AbstractClass = Op.AbstractClass('AbstractClass', null, {
            init: function(constructorParam) {
                this.constructorParam = constructorParam;
                this.z = 40;
            },
            z: 20,
            $abstractFunction: function(){},
            $abstractVariable: 30,
            constructorParam: null,
            $abstractNewFunction: function(){},
            normalFunction: function() {
                return 'hi';
            }
        });

        RealClass1 = Op.Class('RealClass1', {
            'extends': AbstractClass
        },{
            init: function(constructorParam) {
                this.l += constructorParam;
                this.$$super(constructorParam);
            },
            l: 20,
            abstractFunction: function(int1) {
                return 10 + int1;
            },
            abstractNewFunction: function(int1) {
                return 10 + this.abstractFunction(int1);
            }
        });
        RealClass2 = Op.Class('RealClass2', {
            'extends': AbstractClass
        },{
            init: function(constructorParam) {
                this.l += constructorParam;
                this.$$super(constructorParam);
            },
            l: 20
        })
        AbstractClass2 = Op.AbstractClass('AbstractClass2', null, {
            init: function(constructorParam) {
                this.l += constructorParam;
                this.$$super(constructorParam);
            },
            l: 20,        
        });
        SemiAbstract = Op.Class('SemiAbstract', null, {
            init: function(constructorParam) {
                this.l += constructorParam;
            },
            l: 20,
            $abstractFunction: function(){},

        });
        GrandChild = Op.Class('GrandChild', {
            'extends': RealClass1
        }, {
            init: function(constructorParam) {
                this.b += constructorParam;
            },
            b: 20,
            grandChildsFunction: function(){
                return ('hallo from grandchild');
            },
        });
    });
    it('tries to instantiate an abstract class', function() {
        var test = function() {
            var abstractClass = new AbstractClass(20);
        }
        expect(test).to.throwError();
    });
    it('tires to instantiate a class not implementing abstract Functions', function() {
        var test = function() {
            var realClass = new RealClass2(20);
        }
        expect(test).to.throwError();    
    });
    it('instantiate a class implementing all abstract methods', function() {
        var test = function() {
            var realClass1 = new RealClass1(20);
        }
        expect(test).to.not.throwError();
    });
    it('instantiating a abstract class without abstract methods fails', function() {
        var test = function() {
            var abstractClass2 = new AbstractClass2(20);
        }
        expect(test).to.throwError();
    });
    it('tests constructor of abstract parent class', function() {
        var realClass1 = new RealClass1(20);
        expect(realClass1.z).to.be(40);
    });
    it('tests constructor of abstract parent class 2', function() {
        var realClass1 = new RealClass1(20);
        expect(realClass1.constructorParam).to.be(20);
    });
    it('tests multiple abstract Functions', function() {
        var realClass1 = new RealClass1(20);
        var sum = realClass1.abstractFunction(10) + realClass1.abstractNewFunction(10);
        expect(sum).to.be(50);
    });
    // it('tries to call the abstract Functions and fails', function() {
    //     var realClass1 = new RealClass1(20);
    //     var test = function() {
    //         realClass1.$abstractFunction();
    //     }
    //     expect(test).to.throwError(); 
    // });
    it('varables have no inpact on abstractness of class', function() {
        var realClass1 = new RealClass1(20);
        expect(realClass1.$abstractVariable).to.be(30);
    });
    it('normal classes can be made abstract by adding abstract Methods', function() {
        var test = function() {
            var semiAbstract = new SemiAbstract(20);
        }
        expect(test).to.throwError();
    });
    it('can instantiate a grandchild and call a grandparent function', function() {
        var grandChild = new GrandChild(20);
        expect(grandChild.normalFunction()).to.be('hi');
    });
});

describe('Generic Typing', function() {
    var GenericClass1;
    var GenericClass2;
    before(function() {
        GenericClass1 = Op.Class('GenericClass1', {
            'generic': [
                'T', 'V'
            ]
        },{
            genericFunction: function(gen1, gen2) {
                return gen1 + " " + gen2;
            }.paramType(['V','T'])
        });
        GenericClass2 = Op.Class('GenericClass2', {
            'generic': [
                'T', 'K'
            ],
            'extends': {
                'class' : GenericClass1,
                'generic': [
                    'T', 'string'
                ]
            }
        },{
            init: function(int, int2) {
                this.x = int * int2;
            }.paramType(['int', 'int']),
            x: 0,
            genericFunc: function(gen1, gen2) {
                return gen1 + gen2;
            }.paramType(['T','K'])
        });
    });
    it('fails if no generic type is delared', function() {
        var test = function(){
            var genericClass1 = new GenericClass1();
        }
        expect(test).to.throwError();
    });
    it('delcared types working', function() {
        var genericClass1 = new GenericClass1(['int','string']);
        expect(genericClass1.genericFunction('Apfel:', 5)).to.be('Apfel: 5');
    });
    it('fails if generic type missmatch', function() {
        var genericClass1 = new GenericClass1(['int','string']);
        var test = function(){
            genericClass1.genericFunction(10,10);
        }
        expect(test).to.throwError();
    }); 
    // it('', function() {
    //     var test = {
    //     }
    //     expect(test).to.throwError();        
    // });
    it('generic class extends another generic class', function() {
        var genericClass2 = new GenericClass2(['int','int'], 13, 13);
        var test = function() {
            return genericClass2.genericFunction('Apfel:', 5);
        }
        expect(test()).to.be('Apfel: 5');
    });
});

describe('Static Variables, Functions and private constructors', function() {
    var StaticVariables;
    var PrivateConstructor;
    before(function() {
        StaticVariables = Op.Class('StaticVariables', null, {
            _init: function(int) {
                this.x = int;
            },
            x: 0,
            static: {
                z: 2,
                increment: function() {
                    StaticVariables.z += 1;
                    return StaticVariables.z;
                },
                getInstance: function() {
                    return new StaticVariables(10);
                }
            },
            publicFunction: function() {
                StaticVariables.z += 100;
                return StaticVariables.z;
            },
            otherWayToAccesStatic: function() {
                this.static.z = 5;
                return this.static.z;
            }
        });
    }); 
    it('uses a static Variable ', function(){
        expect(StaticVariables.z).to.be(2);
    });
    it('uses a static Function', function() {
        expect(StaticVariables.increment()).to.be(3);
    });
    it('fails when there is a private constructor and no getInstance method', function() {
        var test = function() {
            PrivateConstructor = Op.Class('PrivateConstructor', null, {
                _init: function(int) {
                    this.x = int;
                },
                x: 10
            });   
        }
        expect(test).to.throwError();
    });    
    it('uses the getInstance Method to get an Instance', function() {
        var staticVariables = new StaticVariables.getInstance();
        expect(staticVariables.x).to.be(10);
    });
    it('uses a publicFunction which accesses a static variable', function() {
        var staticVariables = new StaticVariables.getInstance();
        expect(staticVariables.publicFunction()).to.be(103);
    });
    it('other and shorter form to access static Variables', function() {
        var staticVariables = new StaticVariables.getInstance();
        expect(staticVariables.otherWayToAccesStatic()).to.be(5);
    });
});