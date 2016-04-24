
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
		//console.log(type + ' ' + generic + ' ' + val)
		if(generic.hasOwnProperty(type)) {
			var genericType = generic[type];
			Op._.typing.testTypes(genericType, val, generic);
		} else {
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
	if(classSpecObj && classSpecObj.hasOwnProperty('extends')) {
		baseClass = classSpecObj['extends'];
	}
	//Implementing Interfaces
	if(classSpecObj && classSpecObj.hasOwnProperty('implements')) {
		eimplements = classSpecObj['implements'];
	}

	//Generic information
	if(classSpecObj && classSpecObj.hasOwnProperty('generic')) {
		genericDeclaration = classSpecObj['generic'];
		if(!Array.isArray(genericDeclaration)) {
			throw new Error('Wrong generics declaration!');
		}
		isGeneric = true;
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
			baseClass.apply(this, arguments);
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
	newClass.prototype._self_ = newClass;
	//lock for private Constructors
	newClass.prototype._privateConstLock_ = privateConstructor;
	//Is Abstract?
	newClass.prototype._isAbstract_ = isAbstract;
	//Preserve properties from parent
	newClass.prototype._objPreserve_ = obj;
	//Preserve generics Information
	newClass.prototype._generic_ = genericDeclaration;
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