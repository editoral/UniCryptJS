//Very useless and distached method
GLOBAL.printConsoleObj = function printConsoleObj(obj) {
	for(var prop in obj) {
		console.log(prop + ' : ' + obj[prop]);
	}
}


//Op Framework to add class based inheritance as known from Java


GLOBAL.Op = {}

//Extend the function prototype, so it is possible to assign a paramType
Function.prototype.paramType = function paramType() {
	var arr = arguments[0];
	if(!Array.isArray(arr)) {
		throw new Error("Parameter types need to be in an array!");
	}
	this.prototype._paramType_ = arr;
	return this;
}

//Extend the function prototype, so the return param of the function is typed
Function.prototype.returnType = function returnType() {
	var str = arguments[0];
	if(typeof str !== 'string') {
		throw new Error("Return specification must be a string!");
	}
	this.prototype._returnType_ = str;
	return this;
}

// Function.prototype.genericType = function genericType() {
// 	var gen = arguments[0];
// 	if(typeof gen !== 'object') {
// 		console.log(gen);
// 		throw new Error("Generic Types needs to be an object with types inside");
// 	}
// 	this.prototype._genericType_ = gen;
// 	return this;
// }

Function.prototype.storeFunction = function storeFunction() {
	var obj = arguments[0];
	if(typeof obj !== 'object') {
		throw new Error("Parameter needs to be an object with functions inside");
	}
	this.prototype._storedFunctions_ = arguments[0];
	return this;
}


//Intern functions. Should not be used from the outside.
Op._ = {}

Op._.helper = {}

Op._.helper.matchParamsArgs = function(paramType, args, generic) {
	if(paramType.length !== args.length) {
		throw new Error("Number of parameter types and number of parameters missmatch!");
	}
	for(var i = 0; i < paramType.length; i++) {
		Op._.typing.testTypes(paramType[i], args[i], generic);
	}	
}

Op._.helper.matchReturnType = function(returnType, result, name, generic) {
	var didPass = true;
	try {
		Op._.typing.testTypes(returnType, result, generic);	
	} catch(err) {
		didPass = false;
	}
	if(!didPass) {
		throw new Error('The return value from function ' + name + ' was not from type ' + returnType);
	}
}

Op._.helper.FunctionOverload = function FunctionOverload(obj) {
	this.obj = obj;
	this.prepOverload = {};
	this.overloadedFunctions = {};
	this.loopFunctions();
	this.prepareOverloadedFunctions();
}

Op._.helper.FunctionOverload.prototype.retrieveOverloadedFunctions = function retrieveOverloadedFunctions() {
	return this.overloadedFunctions;
}

Op._.helper.FunctionOverload.prototype.prepareOverloadedFunctions = function() {
	for(var prop in this.prepOverload) {
		var distributor = function distributor() {
			var self = arguments.callee;
			var args = Array.prototype.slice.call(arguments);
			var len = args.length;
			var executables = self.prototype._storedFunctions_;
			//console.log('hi: ' + prop);
			var executed = false;
			var result;
			var lastErrorMsg = '';
			for(var fn in executables) {
				//var paramType = executables[fn].prototype._paramType_;
				//if(len === paramType.length) {
					try {
						result = executables[fn].apply(this,args);
						executed = true;			
					} catch(err) {
						lastErrorMsg = err;
					}	
				//}
			}
			if (!executed) {
				throw new Error('No overloaded Function found!');
			}
			return result;

		}.storeFunction(this.prepOverload[prop]);
		//distributor.prototype = this.prepOverload[prop].prototype;
		this.overloadedFunctions[prop] = distributor;
		this.overloadedFunctions[prop].prototype = distributor.prototype;
	}
}

Op._.helper.FunctionOverload.prototype.loopFunctions = function() {
	for(var prop in this.obj) {
		if(typeof this.obj[prop] === 'function') {
			this.addFunction(prop, this.obj[prop])
		}
	}
}

Op._.helper.FunctionOverload.prototype.addFunction = function(name, fn) {
	if(this.isOverloaded(name)) {
		var endName = this.retrieveRealName(name);
		if(!this.prepOverload.hasOwnProperty(endName)) {
			this.prepOverload[endName] = {}
		}
		//insert typing Wrapper
		var typingWrapper = Op._.helper.generateTypingWrapper();

		typingWrapper.prototype = fn.prototype; 
		typingWrapper.prototype.toExecFunc = fn;

		this.prepOverload[endName][name] = typingWrapper;
		this.prepOverload[endName][name].prototype = typingWrapper.prototype;
	}
}

Op._.helper.FunctionOverload.prototype.isOverloaded = function(name){
	return name.match(/[^\s]+[0-9]+/) ? true : false;
}


Op._.helper.FunctionOverload.prototype.retrieveRealName = function(name) {
	return name.match(/[^\s]*[a-zA-Z][^0-9]/)[0];
}


/**
 * JavaScript Rename Function
 * @author Nate Ferrero
 * @license Public Domain
 * @date Apr 5th, 2014
 */
 Op._.helper.renameFunction = function (name, fn) {
 	return (new Function("return function (call) { return function " + name + " () { return call(this, arguments) }; };")())(Function.apply.bind(fn));
 };  

 Op._.helper.isAbstractParam = function(param) {
 	return param.match(/^[\$][a-zA-Z0-9]/) ? true : false;
 }

Op._.helper.generateTypingWrapper = function() {
	var typingWrapper = function() {
		//Tests for the correctnes of the typing
		var self = arguments.callee;
		var execFuncIntern = self.prototype.toExecFunc;
		var intParamType = self.prototype._paramType_;
		var intReturnType = self.prototype._returnType_;
		var genericType = this._generic_;
		if (Array.isArray(intParamType)) {
			Op._.helper.matchParamsArgs(intParamType, arguments,genericType);
		}
		//Execute the actual function
		var result = execFuncIntern.apply(this, arguments);
		if(intReturnType) {
			Op._.helper.matchReturnType(intReturnType, result, self.name);	
		}
		return result;
	}
	return typingWrapper;
}

 Op._.typing = {}

 Op._.typing.TestTypes = function() {

 }

 Op._.typing.TestTypes.prototype = {
 	integer: function(val) {
		//As there is no such things as Integer in JavaScript, because every number is internally represented as floating
		//point value, it is only possible to test if it is a number.
		//Afterwards it can be determined, wether it is an Integer
		if (!((typeof val === "number") && Math.floor(val) === val)) {
			throw new Error("param " + val + " is not an integer!");
		}
	},
	boolean: function(val) {
		if (!(typeof val === "boolean")) {
			throw new Error("param " + val + " is not a boolean!");
		}	
	},
	strTest: function(val) {
		if (!(typeof val === "string")) {
			throw new Error("param " + val + " is not a string!");
		}	
	},
	untypedObj: function(val) {
		if (!(typeof val === "object")) {
			throw new Error("param " + val + " is not an object!");
		}	
	},
	obj: function(type, val) {
		if (typeof val === "object") {
			if(!(val.constructor.name === type)) {
				throw new Error("param " + val + " is not from type " + type + "!");
			}
		} else {
			throw new Error("param " + val + " is not an object!");
		}
	},
	generic: function(type, generic, val) {
		if(generic.hasOwnProperty(type)) {
			var genericType = generic[type];
			Op._.typing.testTypes(genericType, val, generic);
		} else {
			//console.log(type + ' ' + generic + ' ' + val);
			throw new Error("param " + val + " is not known to be generic!");
		}
	}
}

Op._.typing.testTypes = function(type, val, generic) {
	var h = new Op._.typing.TestTypes();
	switch(type) {
		case 'int':
		h.integer(val);
		break;
		case 'boolean':
		h.boolean(val);
		break;
		case 'byte':
		break;
		case 'char':
		break;
		case 'short':
		break;
		case 'long':
		break;
		case 'float':
		break;
		case 'double':
		break;
		case 'string':
		h.strTest(val);
		break;
		case 'object':
		h.untypedObj(val);
		break;
		default:
		if(type.match(/^[A-Z]$/)) {
			h.generic(type, generic, val)
		} else {
			h.obj(type,val);
		}	
	}
}


/** 
* Creates a new Class
* 
* @param {string} name - The name of the new Class
* @param {object} actualClass - JavaScript Object to define the Class
* @param {function} [inheritClass] - An existing base class to inherit from
**/
Op.Class = function() {
	//Fetch the parameters
	var className = arguments[0];
	var obj = arguments[2];
	//Function Overload
	var functionOverload = new Op._.helper.FunctionOverload(obj);
	// optional parameter: Class to inherit
	var classSpecObj = arguments[1];
	var baseClass;
	var genericDeclaration;
	var generic = {};
	var isGeneric = false;
	var eimplements;
	var extendObjGeneric = null;

	//Generic information
	if(classSpecObj && classSpecObj.hasOwnProperty('generic')) {
		genericDeclaration = classSpecObj['generic'];
		if(!Array.isArray(genericDeclaration)) {
			throw new Error('Wrong generics declaration!');
		}
		isGeneric = true;
	}
	//Inheritance	
	if(classSpecObj && classSpecObj.hasOwnProperty('extends')) {
		var extendsOptionSpec = classSpecObj['extends'];
		if(typeof extendsOptionSpec === 'function') {
			baseClass = extendsOptionSpec;	
		} else if (typeof extendsOptionSpec === 'object') {
			if(!extendsOptionSpec.hasOwnProperty('class') && !extendsOptionSpec.hasOwnProperty('generic')) {
				throw new Error('If extending a generic class, the extends obtion has to be an object with property "class" and "generic"');
			}
			baseClass = extendsOptionSpec['class'];
			extendObjGeneric = extendsOptionSpec['generic'];
		} else {
			throw new Error('Unknown extends format!');
		}
		
	}
	//Implementing Interfaces
	if(classSpecObj && classSpecObj.hasOwnProperty('implements')) {
		eimplements = classSpecObj['implements'];
	}


	// Option parameters
	var options = arguments[3];
	var isAbstract = false;
	if(options && options.hasOwnProperty('abstract')) {
		isAbstract = options['abstract'];
	}	


	var isChild = typeof baseClass === 'function' ? true : false;

	//Makes sure, that there is a constructor function avaliable
	var privateConstructor = false;
	if(!obj.hasOwnProperty('init') || typeof obj.init !== 'function') {
		if(!obj.hasOwnProperty('_init') || typeof obj._init !== 'function')  {
			obj.init = function init() {}	
		} else {
			privateConstructor = true;
			obj.init = obj._init;
		}
	}


	//define a new constructor
	var newClass = function() {
		//Tests if Abstract
		if(this._isAbstract_) {
			throw new Error('There are method signatures which are not implemented! It is therefore an abstract Class');
		}
		//Tests if constructor is private
		if(this._privateConstLock_) {
			throw new Error('Private Constructor. Please use getInstance()');
		}
		var args = Array.prototype.slice.call(arguments);
		//Generic Handling
		if(this._isGeneric_) {
			var genericDec = this._generic_;
			this._generic_ = {};
			var genericDef = args[0];
			if(!Array.isArray(genericDef)) {
				throw new Error('Generic classes need to be typed as a first arguement!');
			}
			if(genericDef.length ==! this._generic_.length) {
				throw new Error('Generic parameter missmatch!');
			}
			for(var i = 0; i < genericDec.length; i++) {
				var genType = genericDec[i];
				if(typeof genType === 'string') {
					this._generic_[genType] = genericDef[i];
				}
			}
			//var tempArrayGeneric = [];
			var extendObjGenericTemp = this._extendObjGeneric_;
			if(Array.isArray(extendObjGenericTemp)) {
				//var baseClassGeneric = this._baseClass_.prototype._generic_;
				var baseClassGeneric = this._baseClass_.prototype._generic_;
				if(baseClassGeneric.length !== extendObjGenericTemp.length) {
					throw new Error('Extends object does not specify the generic params of parent class!');
				} 
				for(var i = 0; i < extendObjGenericTemp.length; i++) {
					var comparableObj = extendObjGenericTemp[i];
					if(comparableObj.match(/^[A-Z]$/)) {
						if(!this._generic_.hasOwnProperty(comparableObj)) {
							throw new Error('Unknown generic Parameter in extends property!');
						}
						//tempArrayGeneric.push(this._generic_[comparableObj])
					} else {
						this._generic_[baseClassGeneric[i]] = comparableObj;
						//tempArrayGeneric.push(comparableObj);
					}
				}
			}
			args.shift();
		}
		//Tests the typing
		var paramType = obj.init.prototype._paramType_;
		if(Array.isArray(paramType)) {
			Op._.helper.matchParamsArgs(paramType, args);
		}
		if(!this._initializedProps_){
			//assign all instance variables
			for(var prop in obj) {
				if(!(['init', 'static','_init'].indexOf(prop) >= 0)) {
					if(['number', 'boolean', 'string', 'object'].indexOf(typeof obj[prop]) >= 0) {
						this[prop] = obj[prop];
					}
				}
			}
			this._initializedProps_ = true;
		}
		//execute the defined init function, as the oop constructor
		obj.init.apply(this, args);
	}

	//name the new Class
	newClass = Op._.helper.renameFunction(className, newClass);

	//Start inheritance
	if(isChild) {
		newClass.prototype = Object.create(baseClass.prototype);
		newClass.prototype.constructor = newClass;
		// call the constructor of the baseClass
		newClass.prototype.$$super = function() {
			if(this._isGeneric_) {
				
			} else {
				baseClass.apply(this, arguments);
			}
		}
		var oldObj = baseClass.prototype._objPreserve_;
		for(var prop in oldObj) {
			if(!(['init', 'static', '_init'].indexOf(prop) >= 0)) {
				if(['number', 'boolean', 'string', 'object'].indexOf(typeof oldObj[prop]) >= 0) {
					if(!obj.hasOwnProperty(prop)) {
						obj[prop] = oldObj[prop];
					}
				}
			}
		}
	}

	//Checks if there are static things to treat differently
	//Append them to Class
	if(obj.hasOwnProperty('static') && typeof obj.static === 'object') {
		var statics = obj['static'];
		for(var prop in statics) {
			if(typeof statics[prop] === 'function') {
				var typingWrapper = Op._.helper.generateTypingWrapper();
				typingWrapper.prototype = statics[prop].prototype; 
				typingWrapper.prototype.toExecFunc = statics[prop];
				if(prop !== 'getInstance'){
					newClass[prop] = typingWrapper;	
				} else {
					newClass._getInstance_ = typingWrapper;
				}
			} else {
				newClass[prop] = statics[prop];
			}
		}
	}

	//append all defined functions to prototype of the new JavaScript function
	//they will be wrapped in another function to ensure the right types of the parameters
	for(var prop in obj) {
		if(!(['init', 'static','_init'].indexOf(prop) >= 0) && typeof obj[prop] === 'function'){

			// tests wheter it is an abstract param
			if(!Op._.helper.isAbstractParam(prop)) {
				//If the type of the Params are spezified a wrapper is defined
				var typingWrapper = Op._.helper.generateTypingWrapper();
				typingWrapper.prototype = obj[prop].prototype; 
				typingWrapper.prototype.toExecFunc = obj[prop];
				newClass.prototype[prop] = typingWrapper;			
			} else {
				// It is an abstract function, so check if the method has been overwritten
				isAbstract = true;
				newClass.prototype[prop] = obj[prop];
			}
		}
	}

	//Append overloadedFunctions.
	//They override possible functions with same name
	var overloadedFunctions = functionOverload.retrieveOverloadedFunctions();
	for(var fn in overloadedFunctions) {
		newClass.prototype[fn] = overloadedFunctions[fn];
	}

	//checks if all abstract methods from parent and from interfaces are implemented
	//Abstract Methods from Praent
	if (isChild) {
		for(var prop in baseClass.prototype) {
			if(Op._.helper.isAbstractParam(prop)) {
				prop = prop.substring(1);
				if((!(obj.hasOwnProperty(prop) && typeof obj[prop] === 'function')) && (!(baseClass.prototype.hasOwnProperty(prop) && typeof baseClass.prototype[prop] === 'function'))) {
					isAbstract = true;
				}				
			}
		}		
	}
	//Interfaces
	if(eimplements) {
		var TempInterface = Op.Interface('TempInterface', {
			'extends': eimplements
		}, {});
		var tempInterface = new TempInterface();
		var functionsList = tempInterface.getFunctions();
		//var inter = new eimplements[0]();
		//console.log(inter.getFunctions());
		for(var prop in functionsList) {
			if(!(newClass.prototype.hasOwnProperty(prop) && typeof newClass.prototype[prop] === 'function')) {
				isAbstract = true;
			} else {
				var funcFromInterface = functionsList[prop];
				var funcFromClass = newClass.prototype[prop];
				var par1 =  funcFromInterface.prototype._paramType_;
				var par2 =  funcFromClass.prototype._paramType_;
				var ret1 =  funcFromInterface.prototype._returnType_;
				var ret2 =  funcFromClass.prototype._returnType_;
				if(ret1 !== ret2) {
					isAbstract = true;
				}
				if(par1.length === par2.length) {
					for(var i = 0; i < par1.length; i++) {
						if(par1[i] !== par2[i]) {
							isAbstract = true;
						}
					}
				} else {
					isAbstract = true;
				}
			}	

		}
	}

	//Treat a getInstance Method differently
	if(privateConstructor) {
		if(!newClass.hasOwnProperty('_getInstance_') && typeof newClass.getInstance !== 'function') {
			throw new Error('If constructor is private the class needs a static getInstance method!');
		} else { 
			newClass.getInstance = function getInstance() {
				newClass.prototype._privateConstLock_ = false;
				var instance = newClass._getInstance_.apply(this, arguments);
				newClass.prototype._privateConstLock_ = true;
				return instance;
			}
		}
	}

	//Simplify static access
	newClass.prototype.static = newClass;
	//lock for private Constructors
	newClass.prototype._privateConstLock_ = privateConstructor;
	//Is Abstract?
	newClass.prototype._isAbstract_ = isAbstract;
	//Preserve properties from parent
	newClass.prototype._objPreserve_ = obj;
	//Preserve generics Information
	newClass.prototype._generic_ = genericDeclaration;
	//Preserve extends obj generics
	newClass.prototype._extendObjGeneric_ = extendObjGeneric;
	//Perserve BaseClass
	newClass.prototype._baseClass_ = baseClass;
	newClass.prototype._isGeneric_ = isGeneric;
	newClass.prototype._type_ = 'Class';

	return newClass;
}


Op.AbstractClass = function() {
	var args = Array.prototype.slice.call(arguments);
	var options = {
		'abstract': true
	}
	args[3] = options;
	return Op.Class.apply(this, args)
}

Op.Interface = function() {
	var interfaceName = arguments[0];
	var interSpecObj = arguments[1];	
	var obj = arguments[2];
	var newObj = {};
	var xtends = null;
	// extends other Interfaces interfaces
	if(interSpecObj && interSpecObj.hasOwnProperty('extends')) {
		xtends = interSpecObj['extends'];
	}
	if(xtends) {
		if(!Array.isArray(xtends)) {
			throw new Error('Interfaces to extend need to be defined in an array!');
		}
		for(var i = 0; i < xtends.length; i++) {
			var interface = new xtends[i]();
			var functions = interface.getFunctions();
			for(var prop in functions) {
				newObj[prop] = functions[prop];
				newObj[prop].prototype = functions[prop].prototype;
			}
		}
	}
	for(var prop in obj) {
		if(!typeof obj[prop] === 'function') {
			throw new Error('Only functions are allowed inside an interface!');
		}
		newObj[prop] = obj[prop]; 
	}
	var newInt = function() {
		this.abstractFunctions = newObj;
	}
	//name the new Interface
	newInt = Op._.helper.renameFunction(interfaceName, newInt);
	newInt.prototype.getFunctions = function() {
		return this.abstractFunctions;
	}
	newInt.prototype._type_ = 'Interface';

	
	return newInt;
}
GLOBAL.u = {},
u.BigInteger = Op.Class('BigInteger',null, {
	init: function init(argument) {
		
	},
	valueOf: function() {
		
	}
		
});
GLOBAL.unicrypt = {};
unicrypt.math = {};
unicrypt.math.algebra = {};
unicrypt.math.algebra.general = {};
unicrypt.math.algebra.general.interfaces = {};
unicrypt.math.algebra.general.abstracts = {};
unicrypt.math.algebra.multiplicative = {};
unicrypt.math.algebra.multiplicative.abstracts = {};
unicrypt.math.algebra.general.abstracts.AbstractCyclicGroup = Op.AbstractClass('AbstractCyclicGroup', {
	'generic': {
		'E', 'V'
	},
	'extends': {
		'class': unicrypt.math.algebra.general.abstracts.AbstractGroup,
		'generic': [
			'E','V'
		]
	}
},{
	_defaultGenerator: null,
	_generatorLists: {}
	_init: function() {
			
	},

});
unicrypt.math.algebra.general.abstracts.AbstractGroup = Op.AbstractClass('AbstractGroup', {
	'generic': {
		'E', 'V'
	},
	'extends': {
		'class': unicrypt.math.algebra.general.abstracts.AbstractMonoid,
		'generic': [
			'E','V'
		]
	}
},{
	
});
unicrypt.math.algebra.general.abstracts.AbstractMonoid = Op.AbstractClass('AbstractMonoid', {
	'generic': {
		'E', 'V'
	},
	'extends': {
		'class': unicrypt.math.algebra.general.abstracts.AbstractSemiGroup,
		'generic': [
			'E','V'
		]
	}
},{
	
});
unicrypt.math.algebra.general.abstracts.AbstractSemiGroup = Op.AbstractClass('AbstractSemiGroup', {
	'generic': {
		'E', 'V'
	},
	'extends': {
		'class': unicrypt.math.algebra.general.abstracts.AbstractSet,
		'generic': [
			'E','V'
		]
	}
},{
	
});
unicrypt.math.algebra.general.abstracts.AbstractSet = Op.AbstractClass('AbstractSet', {
	'extends': unicrypt.UniCrypt,
	//'implements': [unicrypt.math.algebra.general.interfaces.Set],
	'generic': [
		'E', 'V'
	]
}, {
	_valueClass: null,
	_order:null,
	_lowerBound:null,
	_upperBound:null,
	_minimum: null,
	_bigIntegerConverter: null,
	_stringConverter: null,
	_byteArrayConverter: null,
	INFINITE: BigInteger.valueOf(-1),
	UNKNOWN: BigInteger.valueOf(-2),
	init: function(valueClass) {
		this._valueClass = valueClass;
	},
	isSemiGroup: function() {
		 return this instanceof SemiGroup;
	}.returnType('boolean'),
	isMonoid: function() {
		 return this instanceof Monoid;
	}.returnType('boolean'),
	isGroup: function() {
		 return this instanceof Group;
	}.returnType('boolean'),
	isSemiRing: function() {
		 return this instanceof SemiRing;
	}.returnType('boolean'),
	isRing: function() {
		 return this instanceof Ring;
	}.returnType('boolean'),
	isField: function() {
		 return this instanceof Field;
	}.returnType('boolean'),
	isCyclic: function() {
		 return this instanceof CyclicGroup;
	}.returnType('boolean'),
	isAdditive: function() {
		 return this instanceof AdditiveSemiGroup;
	}.returnType('boolean'),
	isMultiplicative: function() {
		 return this instanceof MultiplicativeSemiGroup;
	}.returnType('boolean'),
	isConcatenative: function() {
		 return this instanceof ConcatenativeSemiGroup;
	}.returnType('boolean'),
	isProduct: function() {
		 return this instanceof ProductSet;
	}.returnType('boolean'),
	isFinite: function() {
		return !this.getOrder().equals(Set.INFINITE);
	}.returnType('boolean'),
	hasKnownOrder: function() {
		return !this.getOrder().equals(Set.UNKNOWN);
	}.returnType('boolean'),
	getOrder: function() {
		if (this.order == null) {
			this.order = this.abstractGetOrder();
		}
		return this.order;
	}.returnType('BigInteger'),
	getOrderLowerBound: function() {
		if (this._lowerBound == null) {
			if (this.hasKnownOrder()) {
				this._lowerBound = this.getOrder();
			} else {
				this._lowerBound = this.defaultGetOrderLowerBound();
			}
		}
		return this._lowerBound;
	}.returnType('BigInteger'),
	getOrderUpperBound: function() {
		if (this._upperBound == null) {
			if (this.hasKnownOrder()) {
				this._upperBound = this.getOrder();
			} else {
				this._upperBound = this.defaultGetOrderUpperBound();
			}
		}
		return this._upperBound;
	}.returnType('BigInteger'),
	getMinimalOrder: function() {
		if (this._minimum == null) {
			this._minimum = this.defaultGetMinimalOrder();
		}
		return this._minimum;
	}.returnType('BigInteger'),
	isSingleton: function() {
		return this.getOrder().equals(BigInteger.ONE);
	}.returnType(''),
	getZModOrder: function() {
		if (!(this.isFinite() && this.hasKnownOrder())) {
			throw new Error('UnsupportedOperationException');
		}
		return ZMod.getInstance(this.getOrder());
	}.returnType('ZMod'),
	getZStarModOrder: function() {
		if (!(this.isFinite() && this.hasKnownOrder())) {
			throw new Error('UnsupportedOperationException');
		}
		return ZStarMod.getInstance(this.getOrder());
	}.returnType('ZStarMod'),
	getElement: function(value) {
		if (!this.contains(value)) {
			throw new Error('IllegalArgumentException');
		}
		return this.abstractGetElement(value);
	}.paramType(['V']).returnType('E'),
	contains1: function(value) {
		if (value == null) {
			throw new Error('IllegalArgumentException');
		}
		return this.abstractContains(value);
	}.paramType(['V']).returnType('boolean'),
	contains2: function(element) {
		if (element == null) {
			throw new Error('IllegalArgumentException');
		}
		if (!this.valueClass.isInstance(element.getValue())) {
			return false;
		}
		return this.defaultContains(element);
	}.paramType(['Element']).returnType('boolean'),
	getRandomElement1: function() {
		return this.abstractGetRandomElement(HybridRandomByteSequence.getInstance());
	}.returnType('E'),
	getRandomElement2: function(randomByteSequence) {
		if (randomByteSequence == null) {
			throw new Error('IllegalArgumentException');
		}
		return this.abstractGetRandomElement(randomByteSequence);
	}.paramType(['RandomByteSequence']).returnType('E'),
	getRandomElements1: function() {
		return this.getRandomElements(HybridRandomByteSequence.getInstance());
	}.returnType('Sequence'),
	getRandomElements2: function(n) {
		if (n < 0) {
			throw new Error('IllegalArgumentException');
		}
		return this.getRandomElements().limit(n);
	}.paramType(['long']).returnType('Sequence'),
	// getRandomElements3: function(randomByteSequence) {
	// 	if (randomByteSequence == null) {
	// 		throw new Error('IllegalArgumentException');
	// 	}
	// 	return new Sequence([E]) {

	// 		@Override
	// 		public ExtendedIterator<E> iterator() {
	// 			return new ExtendedIterator<E>() {

	// 				@Override
	// 				public boolean hasNext() {
	// 					return true;
	// 				}

	// 				@Override
	// 				public E next() {
	// 					return abstractGetRandomElement(randomByteSequence);
	// 				}
	// 			};
	// 		}
	// 	};
	// }.paramType(['RandomByteSequence']).returnType('Sequence'),
	getRandomElements4: function(n) {
		if (n < 0) {
			throw new Error('IllegalArgumentException');
		}
		return this.getRandomElements().limit(n);
	}.paramType(['long']).returnType('Sequence'),
	getRandomElements5: function(n) {
		if (n < 0) {
			throw new Error('IllegalArgumentException');
		}
		return this.getRandomElements().limit(n);
	}.paramType(['long']).returnType('Sequence'),

	func: function() {

	}.paramType(['']).returnType(''),
	func: function() {

	}.paramType(['']).returnType(''),
	func: function() {

	}.paramType(['']).returnType(''),
	func: function() {

	}.paramType(['']).returnType(''),
});
// unicrypt.math.algebra.general.interfaces.Set = Op.Interface('Set',null, {
// 	isSemiGroup: function() {

// 	}.returnType('boolean'),
// 	isMonoid: function() {

// 	}.returnType('boolean'),
// 	isGroup: function() {

// 	}.returnType('boolean'),
// 	isSemiRing: function() {

// 	}.returnType('boolean'),
// 	isRing: function() {

// 	}.returnType('boolean'),
// 	isField: function() {

// 	}.returnType('boolean'),
// 	isCyclic: function() {

// 	}.returnType('boolean'),
// 	isAdditive: function() {

// 	}.returnType('boolean'),
// 	isMultiplicative: function() {

// 	}.returnType('boolean'),
// 	isConcatenative: function() {

// 	}.returnType('boolean'),
// 	isProduct: function() {

// 	}.returnType('boolean'),
// 	isFinite: function() {

// 	}.returnType('boolean'),
// 	hasKnownOrder: function() {

// 	}.returnType('boolean'),
// 	getOrder: function() {

// 	}.returnType('BigInteger'),
// 	getOrderLowerBound: function() {

// 	}.returnType('BigInteger'),
// 	getOrderUpperBound: function() {

// 	}.returnType('BigInteger'),
// 	getOrderUpperBound: function() {

// 	}.returnType('BigInteger'),
// 	getOrderUpperBound: function() {

// 	}.returnType('BigInteger'),
// 	getOrderUpperBound: function() {

// 	}.returnType('BigInteger'),
// 	getOrderUpperBound: function() {

// 	}.returnType('BigInteger'),
// 	getOrderUpperBound: function() {

// 	}.returnType('BigInteger'),
	


// });
unicrypt.math.algebra.multiplicative.abstracts.AbstractMultiplicativeCyclicGroup = Op.AbstractClass('AbstractMultiplicativeCyclicGroup', {
	'generic': {
		'E', 'V'
	},
	'extends': {
		'class': unicrypt.math.algebra.general.abstracts.AbstractCyclicGroup,
		'generic': [
			'E','V'
		]
	}
},{
	_init: function(valueClass) {
		this.$$super(valueClass);
	},
	multiply1: function(element1, element2) {
		return this.apply(element1, element2);
	}.paramType(['Element', 'Element']).returnType('E'),
	// multiply2: function() {

	// }.paramType(['']).returnType(''),
	// multiply3: function() {

	// }.paramType(['']).returnType(''),
	power1: function(element, amount) {
		return this.selfApply(element, amount);
	}.paramType(['Element','BigInteger']).returnType('E'),
	power2: function(element, amount) {
		return this.selfApply(element, amount);
	}.paramType(['Element', 'long']).returnType('E'),
	// power3: function() {

	// }.paramType(['']).returnType(''),
	square: function(element) {
		return this.selfApply(element);
	}.paramType(['Element']).returnType('E'),
	productOfPowers: function(elements, amounts) {
		return this.multiSelfApply(elements, amounts);
	}.returnType('E'),
	divide: function(element1, element2) {
		return this.applyInverse(element1, element2);
	}.paramType(['Element', 'Element']).returnType('E'),
	oneOver: function(element) {
		return this.invert(element);
	}.paramType(['Element']).returnType('E'),
	getOneElement: function() {
		return this.getIdentityElement();
	}.returnType('E'),
	isOneElement: function(element) {
		return this.isIdentityElement(element);
	}.paramType(['Element']).returnType('boolean')

});

unicrypt.math.algebra.multiplicative.classes.GStarMod =  Op.Class('GStarMod', {
	'extends': {
		'class': unicrypt.math.algebra.multiplicative.abstracts.AbstractMultiplicativeCyclicGroup,
		'generic': ['GStarModElement', 'BigInteger']
	}
},{
	_modulus: null,
	_moduloFactorization: null,
	_orderFactorization: null,
	_superGroup: null,
	_init: function(moduloFactorization, orderFactorization) {
		this.$$super(u.BigInteger);
		this._modulus = moduloFactorization.getValue();
		this._moduloFactorization = moduloFactorization;
		this._orderFactorization = orderFactorization;
	}.paramType(['SpecialFactorization', 'Factorization']),
	getModulus: function() {
		return this._modulus;
	}.returnType('BigInteger'),
	getModuloFactorization: function() {
		return this._moduloFactorization;
	}.returnType('SpecialFactorization'),
	getOrderFactorization: function() {
		return this._orderFactorization;		
	}.returnType('Factorization'),
	getZStarMod: function() {
		if (this._superGroup == null) {
			this._superGroup = ZStarMod.getInstance(this.getModuloFactorization());
		}
		return this._superGroup;
	}.returnType('ZStarMod'),
	contains: function(integerValue) {
		return this.contains(u.BigInteger.valueOf(integerValue));
	}.paramType(['long']).returnType('boolean'),
	getElement: function(integerValue) {
		return this.getElement(u.BigInteger.valueOf(integerValue));
	}.paramType(['long']).returnType('GStarModElement'),
	getCoFactor: function() {
		return this.getZStarMod().getOrder().divide(this.getOrder());
	}.returnType('BigInteger'),
	_defaultSelfApplyAlgorithm: function(element,posAmount) {
		return this.abstractGetElement(element.getValue().modPow(posAmount, this._modulus));
	}.paramType(['GStarModElement','BigInteger']).returnType('GStarModElement'),
	_defaultToStringContent: function() {
		return this.getModulus().toString() + "," + this.getOrder().toString();
	}.returnType('string'),
	_abstractContains: function(value) {
		return value.signum() > 0
			   && value.compareTo(this._modulus) < 0
			   && MathUtil.areRelativelyPrime(value, this._modulus)
			   && value.modPow(this.getOrder(), this._modulus).equals(u.BigInteger.ONE);
	}.paramType(['BigInteger']).returnType('boolean'),
	_abstractGetElement: function(value) {
		return new GStarModElement(this, value);
	}.paramType(['BigInteger']).returnType('GStarModElement'),
	// _abstractGetBigIntegerConverter: function() {
	// 	return BigIntegerToBigInteger.getInstance(0);
	// }.returnType('Converter'),
	_abstractGetRandomElement: function(randomByteSequence) {
		var randomElement = this.getZStarMod().getRandomElement(randomByteSequence);
		return this.getElement(randomElement.power(this.getCoFactor()).convertToBigInteger());
	}.paramType(['RandomByteSequence']).returnType('GStarModElement'),
	_abstractGetOrder: function() {
		return this.getOrderFactorization().getValue();
	}.returnType('BigInteger'),
	_abstractGetIdentityElement: function() {
		return this._abstractGetElement(u.BigInteger.ONE);
	}.returnType('GStarModElement'),
	_abstractApply: function(element1,element2) {
		return this._abstractGetElement(element1.getValue().multiply(element2.getValue()).mod(this._modulus));
	}.paramType(['GStarModElement','GStarModElement']).returnType('GStarModElement'),
	_abstractInvert: function(element) {
		return this._abstractGetElement(element.getValue().modInverse(this._modulus));
	}.paramType(['GStarModElement']).returnType('GStarModElement'),
	_abstractGetDefaultGenerator: function() {
		var alpha = u.BigInteger.ZERO;
		var element;
		do {
			do {
				alpha = alpha.add(u.BigInteger.ONE);
			} while (!MathUtil.areRelativelyPrime(alpha, this.getModulus()));
			element = this.abstractGetElement(alpha.modPow(this.getCoFactor(), this._modulus));
		} while (!this.isGenerator(element)); // this test could be skipped for a prime order
		return element;
	}.returnType('GStarModElement'),
	_abstractIsGenerator: function(element) {
		for (var prime in this.getOrderFactorization().getPrimeFactors()) {
			if (element.selfApply(this.getOrder().divide(prime)).isEquivalent(this.getIdentityElement())) {
				return false;
			}
		}
		return true;
	}.paramType(['GStarModElement']).returnType('boolean'),
	_abstractEquals: function(set) {
		var other = set;
		return this.getModulus().equals(other.getModulus()) && this.getOrder().equals(other.getOrder());
	}.paramType(['Set']).returnType('boolean'),
	_abstractHashCode: function() {
		var hash = 7;
		hash = 47 * hash + this.getModulus().hashCode();
		hash = 47 * hash + this.getOrder().hashCode();
		return hash;
	}.returnType('int'),
	static: {
		getInstance: function(moduloFactorization, orderFactorization) {
			var group = new GStarMod(moduloFactorization, orderFactorization);
			if (!group.getOrder().mod(orderFactorization.getValue()).equals(u.BigInteger.ZERO)) {
				throw new Error('IllegalArgumentException');
			}
			return group;
		}.paramType(['SpecialFactorization','Factorization']).returnType('GStarMod')
	}
});
 unicrypt.math.algebra.multiplicative.classes.GStarModElement = Op.Class('GStarModElement', {
	'generic': [
		'E'
	],
	'extends': {
		'class' : ,
		'generic': [
			'T', 'string'
		]
	}
},{
	init: function() {
		this.$$super();
		
	}.paramType(['int']),
	func: function() {

	}.paramType(['E']).returnType(''),
});
unicrypt.UniCrypt = Op.AbstractClass('UniCrypt', null, {
	toString: function() {
		var str1 = this._defaultToStringType();
		var str2 = this._defaultToStringContent();
		if(str1.length() == 0) {
			return str2;
		}
		if(str2.length() == 0) {
			return str1;
		}
		return str1 + "[" + str2 + "]";
	}.returnType('string'),
	_defaultToStringType: function() {
		return this.constructor.name;
	},
	_defaultToStringContent: function() {
		return "";
	}
});
