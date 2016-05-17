GLOBAL.navigator = "Test";
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
			Op._.helper.matchReturnType(intReturnType, result, self.name, genericType);	
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
	array: function(val) {
		if (!Array.isArray(val)) {
			throw new Error("param " + val + " is not an array!");
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
		case 'array':
		h.array(val);
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
			//throw new Error('Unknown extends format ' + typeof extendObjGeneric + ' in ' + className + '!');
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
			//throw new Error('If constructor is private the class needs a static getInstance method in ' + className + '!');
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
// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Basic JavaScript BN library - subset useful for RSA encryption.

// Bits per digit
var dbits;

// JavaScript engine analysis
var canary = 0xdeadbeefcafe;
var j_lm = ((canary&0xffffff)==0xefcafe);

// (public) Constructor
function BigInteger(a,b,c) {
  if(a != null)
    if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}

// return new, unset BigInteger
function nbi() { return new BigInteger(null); }

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i,x,w,j,c,n) {
  while(--n >= 0) {
    var v = x*this[i++]+w[j]+c;
    c = Math.floor(v/0x4000000);
    w[j++] = v&0x3ffffff;
  }
  return c;
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i,x,w,j,c,n) {
  var xl = x&0x7fff, xh = x>>15;
  while(--n >= 0) {
    var l = this[i]&0x7fff;
    var h = this[i++]>>15;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);
    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);
    w[j++] = l&0x3fffffff;
  }
  return c;
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i,x,w,j,c,n) {
  var xl = x&0x3fff, xh = x>>14;
  while(--n >= 0) {
    var l = this[i]&0x3fff;
    var h = this[i++]>>14;
    var m = xh*l+h*xl;
    l = xl*l+((m&0x3fff)<<14)+w[j]+c;
    c = (l>>28)+(m>>14)+xh*h;
    w[j++] = l&0xfffffff;
  }
  return c;
}
if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {
  BigInteger.prototype.am = am2;
  dbits = 30;
}
else if(j_lm && (navigator.appName != "Netscape")) {
  BigInteger.prototype.am = am1;
  dbits = 26;
}
else { // Mozilla/Netscape seems to prefer am3
  BigInteger.prototype.am = am3;
  dbits = 28;
}

BigInteger.prototype.DB = dbits;
BigInteger.prototype.DM = ((1<<dbits)-1);
BigInteger.prototype.DV = (1<<dbits);

var BI_FP = 52;
BigInteger.prototype.FV = Math.pow(2,BI_FP);
BigInteger.prototype.F1 = BI_FP-dbits;
BigInteger.prototype.F2 = 2*dbits-BI_FP;

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
var BI_RC = new Array();
var rr,vv;
rr = "0".charCodeAt(0);
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;
rr = "a".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;
rr = "A".charCodeAt(0);
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;

function int2char(n) { return BI_RM.charAt(n); }
function intAt(s,i) {
  var c = BI_RC[s.charCodeAt(i)];
  return (c==null)?-1:c;
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];
  r.t = this.t;
  r.s = this.s;
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1;
  this.s = (x<0)?-1:0;
  if(x > 0) this[0] = x;
  else if(x < -1) this[0] = x+this.DV;
  else this.t = 0;
}

// return bigint initialized to value
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }

// (protected) set from string and radix
function bnpFromString(s,b) {
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 256) k = 8; // byte array
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else { this.fromRadix(s,b); return; }
  this.t = 0;
  this.s = 0;
  var i = s.length, mi = false, sh = 0;
  while(--i >= 0) {
    var x = (k==8)?s[i]&0xff:intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-") mi = true;
      continue;
    }
    mi = false;
    if(sh == 0)
      this[this.t++] = x;
    else if(sh+k > this.DB) {
      this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;
      this[this.t++] = (x>>(this.DB-sh));
    }
    else
      this[this.t-1] |= x<<sh;
    sh += k;
    if(sh >= this.DB) sh -= this.DB;
  }
  if(k == 8 && (s[0]&0x80) != 0) {
    this.s = -1;
    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;
  }
  this.clamp();
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s&this.DM;
  while(this.t > 0 && this[this.t-1] == c) --this.t;
}

// (public) return string representation in given radix
function bnToString(b) {
  if(this.s < 0) return "-"+this.negate().toString(b);
  var k;
  if(b == 16) k = 4;
  else if(b == 8) k = 3;
  else if(b == 2) k = 1;
  else if(b == 32) k = 5;
  else if(b == 4) k = 2;
  else return this.toRadix(b);
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;
  var p = this.DB-(i*this.DB)%k;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }
    while(i >= 0) {
      if(p < k) {
        d = (this[i]&((1<<p)-1))<<(k-p);
        d |= this[--i]>>(p+=this.DB-k);
      }
      else {
        d = (this[i]>>(p-=k))&km;
        if(p <= 0) { p += this.DB; --i; }
      }
      if(d > 0) m = true;
      if(m) r += int2char(d);
    }
  }
  return m?r:"0";
}

// (public) -this
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }

// (public) |this|
function bnAbs() { return (this.s<0)?this.negate():this; }

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s-a.s;
  if(r != 0) return r;
  var i = this.t;
  r = i-a.t;
  if(r != 0) return (this.s<0)?-r:r;
  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;
  return 0;
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1, t;
  if((t=x>>>16) != 0) { x = t; r += 16; }
  if((t=x>>8) != 0) { x = t; r += 8; }
  if((t=x>>4) != 0) { x = t; r += 4; }
  if((t=x>>2) != 0) { x = t; r += 2; }
  if((t=x>>1) != 0) { x = t; r += 1; }
  return r;
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if(this.t <= 0) return 0;
  return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n,r) {
  var i;
  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];
  for(i = n-1; i >= 0; --i) r[i] = 0;
  r.t = this.t+n;
  r.s = this.s;
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n,r) {
  for(var i = n; i < this.t; ++i) r[i-n] = this[i];
  r.t = Math.max(this.t-n,0);
  r.s = this.s;
}

// (protected) r = this << n
function bnpLShiftTo(n,r) {
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<cbs)-1;
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;
  for(i = this.t-1; i >= 0; --i) {
    r[i+ds+1] = (this[i]>>cbs)|c;
    c = (this[i]&bm)<<bs;
  }
  for(i = ds-1; i >= 0; --i) r[i] = 0;
  r[ds] = c;
  r.t = this.t+ds+1;
  r.s = this.s;
  r.clamp();
}

// (protected) r = this >> n
function bnpRShiftTo(n,r) {
  r.s = this.s;
  var ds = Math.floor(n/this.DB);
  if(ds >= this.t) { r.t = 0; return; }
  var bs = n%this.DB;
  var cbs = this.DB-bs;
  var bm = (1<<bs)-1;
  r[0] = this[ds]>>bs;
  for(var i = ds+1; i < this.t; ++i) {
    r[i-ds-1] |= (this[i]&bm)<<cbs;
    r[i-ds] = this[i]>>bs;
  }
  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;
  r.t = this.t-ds;
  r.clamp();
}

// (protected) r = this - a
function bnpSubTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]-a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c -= a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c -= a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c -= a.s;
  }
  r.s = (c<0)?-1:0;
  if(c < -1) r[i++] = this.DV+c;
  else if(c > 0) r[i++] = c;
  r.t = i;
  r.clamp();
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a,r) {
  var x = this.abs(), y = a.abs();
  var i = x.t;
  r.t = i+y.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);
  r.s = 0;
  r.clamp();
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs();
  var i = r.t = 2*x.t;
  while(--i >= 0) r[i] = 0;
  for(i = 0; i < x.t-1; ++i) {
    var c = x.am(i,x[i],r,2*i,0,1);
    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {
      r[i+x.t] -= x.DV;
      r[i+x.t+1] = 1;
    }
  }
  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);
  r.s = 0;
  r.clamp();
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m,q,r) {
  var pm = m.abs();
  if(pm.t <= 0) return;
  var pt = this.abs();
  if(pt.t < pm.t) {
    if(q != null) q.fromInt(0);
    if(r != null) this.copyTo(r);
    return;
  }
  if(r == null) r = nbi();
  var y = nbi(), ts = this.s, ms = m.s;
  var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }
  else { pm.copyTo(y); pt.copyTo(r); }
  var ys = y.t;
  var y0 = y[ys-1];
  if(y0 == 0) return;
  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;
  var i = r.t, j = i-ys, t = (q==null)?nbi():q;
  y.dlShiftTo(j,t);
  if(r.compareTo(t) >= 0) {
    r[r.t++] = 1;
    r.subTo(t,r);
  }
  BigInteger.ONE.dlShiftTo(ys,t);
  t.subTo(y,y);	// "negative" y so we can replace sub with am later
  while(y.t < ys) y[y.t++] = 0;
  while(--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);
    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out
      y.dlShiftTo(j,t);
      r.subTo(t,r);
      while(r[i] < --qd) r.subTo(t,r);
    }
  }
  if(q != null) {
    r.drShiftTo(ys,q);
    if(ts != ms) BigInteger.ZERO.subTo(q,q);
  }
  r.t = ys;
  r.clamp();
  if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder
  if(ts < 0) BigInteger.ZERO.subTo(r,r);
}

// (public) this mod a
function bnMod(a) {
  var r = nbi();
  this.abs().divRemTo(a,null,r);
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);
  return r;
}

// Modular reduction using "classic" algorithm
function Classic(m) { this.m = m; }
function cConvert(x) {
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);
  else return x;
}
function cRevert(x) { return x; }
function cReduce(x) { x.divRemTo(this.m,null,x); }
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

Classic.prototype.convert = cConvert;
Classic.prototype.revert = cRevert;
Classic.prototype.reduce = cReduce;
Classic.prototype.mulTo = cMulTo;
Classic.prototype.sqrTo = cSqrTo;

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if(this.t < 1) return 0;
  var x = this[0];
  if((x&1) == 0) return 0;
  var y = x&3;		// y == 1/x mod 2^2
  y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4
  y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly;
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y>0)?this.DV-y:-y;
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m;
  this.mp = m.invDigit();
  this.mpl = this.mp&0x7fff;
  this.mph = this.mp>>15;
  this.um = (1<<(m.DB-15))-1;
  this.mt2 = 2*m.t;
}

// xR mod m
function montConvert(x) {
  var r = nbi();
  x.abs().dlShiftTo(this.m.t,r);
  r.divRemTo(this.m,null,r);
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);
  return r;
}

// x/R mod m
function montRevert(x) {
  var r = nbi();
  x.copyTo(r);
  this.reduce(r);
  return r;
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while(x.t <= this.mt2)	// pad x so am has enough room later
    x[x.t++] = 0;
  for(var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i]&0x7fff;
    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;
    // use am to combine the multiply-shift-add into one call
    j = i+this.m.t;
    x[j] += this.m.am(0,u0,x,i,0,this.m.t);
    // propagate carry
    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }
  }
  x.clamp();
  x.drShiftTo(this.m.t,x);
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = "xy/R mod m"; x,y != r
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Montgomery.prototype.convert = montConvert;
Montgomery.prototype.revert = montRevert;
Montgomery.prototype.reduce = montReduce;
Montgomery.prototype.mulTo = montMulTo;
Montgomery.prototype.sqrTo = montSqrTo;

// (protected) true iff this is even
function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e,z) {
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;
  g.copyTo(r);
  while(--i >= 0) {
    z.sqrTo(r,r2);
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);
    else { var t = r; r = r2; r2 = t; }
  }
  return z.revert(r);
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e,m) {
  var z;
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);
  return this.exp(e,z);
}

// protected
BigInteger.prototype.copyTo = bnpCopyTo;
BigInteger.prototype.fromInt = bnpFromInt;
BigInteger.prototype.fromString = bnpFromString;
BigInteger.prototype.clamp = bnpClamp;
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
BigInteger.prototype.drShiftTo = bnpDRShiftTo;
BigInteger.prototype.lShiftTo = bnpLShiftTo;
BigInteger.prototype.rShiftTo = bnpRShiftTo;
BigInteger.prototype.subTo = bnpSubTo;
BigInteger.prototype.multiplyTo = bnpMultiplyTo;
BigInteger.prototype.squareTo = bnpSquareTo;
BigInteger.prototype.divRemTo = bnpDivRemTo;
BigInteger.prototype.invDigit = bnpInvDigit;
BigInteger.prototype.isEven = bnpIsEven;
BigInteger.prototype.exp = bnpExp;

// public
BigInteger.prototype.toString = bnToString;
BigInteger.prototype.negate = bnNegate;
BigInteger.prototype.abs = bnAbs;
BigInteger.prototype.compareTo = bnCompareTo;
BigInteger.prototype.bitLength = bnBitLength;
BigInteger.prototype.mod = bnMod;
BigInteger.prototype.modPowInt = bnModPowInt;

// "constants"
BigInteger.ZERO = nbv(0);
BigInteger.ONE = nbv(1);

// Copyright (c) 2005-2009  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.

// Extended JavaScript BN functions, required for RSA private ops.

// Version 1.1: new BigInteger("0", 10) returns "proper" zero
// Version 1.2: square() API, isProbablePrime fix

// (public)
function bnClone() { var r = nbi(); this.copyTo(r); return r; }

// (public) return value as integer
function bnIntValue() {
  if(this.s < 0) {
    if(this.t == 1) return this[0]-this.DV;
    else if(this.t == 0) return -1;
  }
  else if(this.t == 1) return this[0];
  else if(this.t == 0) return 0;
  // assumes 16 < DB < 32
  return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];
}

// (public) return value as byte
function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }

// (public) return value as short (assumes DB>=16)
function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }

// (protected) return x s.t. r^x < DV
function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }

// (public) 0 if this == 0, 1 if this > 0
function bnSigNum() {
  if(this.s < 0) return -1;
  else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;
  else return 1;
}

// (protected) convert to radix string
function bnpToRadix(b) {
  if(b == null) b = 10;
  if(this.signum() == 0 || b < 2 || b > 36) return "0";
  var cs = this.chunkSize(b);
  var a = Math.pow(b,cs);
  var d = nbv(a), y = nbi(), z = nbi(), r = "";
  this.divRemTo(d,y,z);
  while(y.signum() > 0) {
    r = (a+z.intValue()).toString(b).substr(1) + r;
    y.divRemTo(d,y,z);
  }
  return z.intValue().toString(b) + r;
}

// (protected) convert from radix string
function bnpFromRadix(s,b) {
  this.fromInt(0);
  if(b == null) b = 10;
  var cs = this.chunkSize(b);
  var d = Math.pow(b,cs), mi = false, j = 0, w = 0;
  for(var i = 0; i < s.length; ++i) {
    var x = intAt(s,i);
    if(x < 0) {
      if(s.charAt(i) == "-" && this.signum() == 0) mi = true;
      continue;
    }
    w = b*w+x;
    if(++j >= cs) {
      this.dMultiply(d);
      this.dAddOffset(w,0);
      j = 0;
      w = 0;
    }
  }
  if(j > 0) {
    this.dMultiply(Math.pow(b,j));
    this.dAddOffset(w,0);
  }
  if(mi) BigInteger.ZERO.subTo(this,this);
}

// (protected) alternate constructor
function bnpFromNumber(a,b,c) {
  if("number" == typeof b) {
    // new BigInteger(int,int,RNG)
    if(a < 2) this.fromInt(1);
    else {
      this.fromNumber(a,c);
      if(!this.testBit(a-1))	// force MSB set
        this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);
      if(this.isEven()) this.dAddOffset(1,0); // force odd
      while(!this.isProbablePrime(b)) {
        this.dAddOffset(2,0);
        if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);
      }
    }
  }
  else {
    // new BigInteger(int,RNG)
    var x = new Array(), t = a&7;
    x.length = (a>>3)+1;
    b.nextBytes(x);
    if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
    this.fromString(x,256);
  }
}

// (public) convert to bigendian byte array
function bnToByteArray() {
  var i = this.t, r = new Array();
  r[0] = this.s;
  var p = this.DB-(i*this.DB)%8, d, k = 0;
  if(i-- > 0) {
    if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)
      r[k++] = d|(this.s<<(this.DB-p));
    while(i >= 0) {
      if(p < 8) {
        d = (this[i]&((1<<p)-1))<<(8-p);
        d |= this[--i]>>(p+=this.DB-8);
      }
      else {
        d = (this[i]>>(p-=8))&0xff;
        if(p <= 0) { p += this.DB; --i; }
      }
      if((d&0x80) != 0) d |= -256;
      if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;
      if(k > 0 || d != this.s) r[k++] = d;
    }
  }
  return r;
}

function bnEquals(a) { return(this.compareTo(a)==0); }
function bnMin(a) { return(this.compareTo(a)<0)?this:a; }
function bnMax(a) { return(this.compareTo(a)>0)?this:a; }

// (protected) r = this op a (bitwise)
function bnpBitwiseTo(a,op,r) {
  var i, f, m = Math.min(a.t,this.t);
  for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);
  if(a.t < this.t) {
    f = a.s&this.DM;
    for(i = m; i < this.t; ++i) r[i] = op(this[i],f);
    r.t = this.t;
  }
  else {
    f = this.s&this.DM;
    for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);
    r.t = a.t;
  }
  r.s = op(this.s,a.s);
  r.clamp();
}

// (public) this & a
function op_and(x,y) { return x&y; }
function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }

// (public) this | a
function op_or(x,y) { return x|y; }
function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }

// (public) this ^ a
function op_xor(x,y) { return x^y; }
function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }

// (public) this & ~a
function op_andnot(x,y) { return x&~y; }
function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }

// (public) ~this
function bnNot() {
  var r = nbi();
  for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];
  r.t = this.t;
  r.s = ~this.s;
  return r;
}

// (public) this << n
function bnShiftLeft(n) {
  var r = nbi();
  if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);
  return r;
}

// (public) this >> n
function bnShiftRight(n) {
  var r = nbi();
  if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);
  return r;
}

// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
  if(x == 0) return -1;
  var r = 0;
  if((x&0xffff) == 0) { x >>= 16; r += 16; }
  if((x&0xff) == 0) { x >>= 8; r += 8; }
  if((x&0xf) == 0) { x >>= 4; r += 4; }
  if((x&3) == 0) { x >>= 2; r += 2; }
  if((x&1) == 0) ++r;
  return r;
}

// (public) returns index of lowest 1-bit (or -1 if none)
function bnGetLowestSetBit() {
  for(var i = 0; i < this.t; ++i)
    if(this[i] != 0) return i*this.DB+lbit(this[i]);
  if(this.s < 0) return this.t*this.DB;
  return -1;
}

// return number of 1 bits in x
function cbit(x) {
  var r = 0;
  while(x != 0) { x &= x-1; ++r; }
  return r;
}

// (public) return number of set bits
function bnBitCount() {
  var r = 0, x = this.s&this.DM;
  for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);
  return r;
}

// (public) true iff nth bit is set
function bnTestBit(n) {
  var j = Math.floor(n/this.DB);
  if(j >= this.t) return(this.s!=0);
  return((this[j]&(1<<(n%this.DB)))!=0);
}

// (protected) this op (1<<n)
function bnpChangeBit(n,op) {
  var r = BigInteger.ONE.shiftLeft(n);
  this.bitwiseTo(r,op,r);
  return r;
}

// (public) this | (1<<n)
function bnSetBit(n) { return this.changeBit(n,op_or); }

// (public) this & ~(1<<n)
function bnClearBit(n) { return this.changeBit(n,op_andnot); }

// (public) this ^ (1<<n)
function bnFlipBit(n) { return this.changeBit(n,op_xor); }

// (protected) r = this + a
function bnpAddTo(a,r) {
  var i = 0, c = 0, m = Math.min(a.t,this.t);
  while(i < m) {
    c += this[i]+a[i];
    r[i++] = c&this.DM;
    c >>= this.DB;
  }
  if(a.t < this.t) {
    c += a.s;
    while(i < this.t) {
      c += this[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += this.s;
  }
  else {
    c += this.s;
    while(i < a.t) {
      c += a[i];
      r[i++] = c&this.DM;
      c >>= this.DB;
    }
    c += a.s;
  }
  r.s = (c<0)?-1:0;
  if(c > 0) r[i++] = c;
  else if(c < -1) r[i++] = this.DV+c;
  r.t = i;
  r.clamp();
}

// (public) this + a
function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }

// (public) this - a
function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }

// (public) this * a
function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }

// (public) this^2
function bnSquare() { var r = nbi(); this.squareTo(r); return r; }

// (public) this / a
function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }

// (public) this % a
function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }

// (public) [this/a,this%a]
function bnDivideAndRemainder(a) {
  var q = nbi(), r = nbi();
  this.divRemTo(a,q,r);
  return new Array(q,r);
}

// (protected) this *= n, this >= 0, 1 < n < DV
function bnpDMultiply(n) {
  this[this.t] = this.am(0,n-1,this,0,0,this.t);
  ++this.t;
  this.clamp();
}

// (protected) this += n << w words, this >= 0
function bnpDAddOffset(n,w) {
  if(n == 0) return;
  while(this.t <= w) this[this.t++] = 0;
  this[w] += n;
  while(this[w] >= this.DV) {
    this[w] -= this.DV;
    if(++w >= this.t) this[this.t++] = 0;
    ++this[w];
  }
}

// A "null" reducer
function NullExp() {}
function nNop(x) { return x; }
function nMulTo(x,y,r) { x.multiplyTo(y,r); }
function nSqrTo(x,r) { x.squareTo(r); }

NullExp.prototype.convert = nNop;
NullExp.prototype.revert = nNop;
NullExp.prototype.mulTo = nMulTo;
NullExp.prototype.sqrTo = nSqrTo;

// (public) this^e
function bnPow(e) { return this.exp(e,new NullExp()); }

// (protected) r = lower n words of "this * a", a.t <= n
// "this" should be the larger one if appropriate.
function bnpMultiplyLowerTo(a,n,r) {
  var i = Math.min(this.t+a.t,n);
  r.s = 0; // assumes a,this >= 0
  r.t = i;
  while(i > 0) r[--i] = 0;
  var j;
  for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);
  for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);
  r.clamp();
}

// (protected) r = "this * a" without lower n words, n > 0
// "this" should be the larger one if appropriate.
function bnpMultiplyUpperTo(a,n,r) {
  --n;
  var i = r.t = this.t+a.t-n;
  r.s = 0; // assumes a,this >= 0
  while(--i >= 0) r[i] = 0;
  for(i = Math.max(n-this.t,0); i < a.t; ++i)
    r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);
  r.clamp();
  r.drShiftTo(1,r);
}

// Barrett modular reduction
function Barrett(m) {
  // setup Barrett
  this.r2 = nbi();
  this.q3 = nbi();
  BigInteger.ONE.dlShiftTo(2*m.t,this.r2);
  this.mu = this.r2.divide(m);
  this.m = m;
}

function barrettConvert(x) {
  if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);
  else if(x.compareTo(this.m) < 0) return x;
  else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }
}

function barrettRevert(x) { return x; }

// x = x mod m (HAC 14.42)
function barrettReduce(x) {
  x.drShiftTo(this.m.t-1,this.r2);
  if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }
  this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);
  this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);
  while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);
  x.subTo(this.r2,x);
  while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);
}

// r = x^2 mod m; x != r
function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }

// r = x*y mod m; x,y != r
function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }

Barrett.prototype.convert = barrettConvert;
Barrett.prototype.revert = barrettRevert;
Barrett.prototype.reduce = barrettReduce;
Barrett.prototype.mulTo = barrettMulTo;
Barrett.prototype.sqrTo = barrettSqrTo;

// (public) this^e % m (HAC 14.85)
function bnModPow(e,m) {
  var i = e.bitLength(), k, r = nbv(1), z;
  if(i <= 0) return r;
  else if(i < 18) k = 1;
  else if(i < 48) k = 3;
  else if(i < 144) k = 4;
  else if(i < 768) k = 5;
  else k = 6;
  if(i < 8)
    z = new Classic(m);
  else if(m.isEven())
    z = new Barrett(m);
  else
    z = new Montgomery(m);

  // precomputation
  var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;
  g[1] = z.convert(this);
  if(k > 1) {
    var g2 = nbi();
    z.sqrTo(g[1],g2);
    while(n <= km) {
      g[n] = nbi();
      z.mulTo(g2,g[n-2],g[n]);
      n += 2;
    }
  }

  var j = e.t-1, w, is1 = true, r2 = nbi(), t;
  i = nbits(e[j])-1;
  while(j >= 0) {
    if(i >= k1) w = (e[j]>>(i-k1))&km;
    else {
      w = (e[j]&((1<<(i+1))-1))<<(k1-i);
      if(j > 0) w |= e[j-1]>>(this.DB+i-k1);
    }

    n = k;
    while((w&1) == 0) { w >>= 1; --n; }
    if((i -= n) < 0) { i += this.DB; --j; }
    if(is1) {	// ret == 1, don't bother squaring or multiplying it
      g[w].copyTo(r);
      is1 = false;
    }
    else {
      while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }
      if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }
      z.mulTo(r2,g[w],r);
    }

    while(j >= 0 && (e[j]&(1<<i)) == 0) {
      z.sqrTo(r,r2); t = r; r = r2; r2 = t;
      if(--i < 0) { i = this.DB-1; --j; }
    }
  }
  return z.revert(r);
}

// (public) gcd(this,a) (HAC 14.54)
function bnGCD(a) {
  var x = (this.s<0)?this.negate():this.clone();
  var y = (a.s<0)?a.negate():a.clone();
  if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }
  var i = x.getLowestSetBit(), g = y.getLowestSetBit();
  if(g < 0) return x;
  if(i < g) g = i;
  if(g > 0) {
    x.rShiftTo(g,x);
    y.rShiftTo(g,y);
  }
  while(x.signum() > 0) {
    if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);
    if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);
    if(x.compareTo(y) >= 0) {
      x.subTo(y,x);
      x.rShiftTo(1,x);
    }
    else {
      y.subTo(x,y);
      y.rShiftTo(1,y);
    }
  }
  if(g > 0) y.lShiftTo(g,y);
  return y;
}

// (protected) this % n, n < 2^26
function bnpModInt(n) {
  if(n <= 0) return 0;
  var d = this.DV%n, r = (this.s<0)?n-1:0;
  if(this.t > 0)
    if(d == 0) r = this[0]%n;
    else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;
  return r;
}

// (public) 1/this % m (HAC 14.61)
function bnModInverse(m) {
  var ac = m.isEven();
  if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;
  var u = m.clone(), v = this.clone();
  var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);
  while(u.signum() != 0) {
    while(u.isEven()) {
      u.rShiftTo(1,u);
      if(ac) {
        if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }
        a.rShiftTo(1,a);
      }
      else if(!b.isEven()) b.subTo(m,b);
      b.rShiftTo(1,b);
    }
    while(v.isEven()) {
      v.rShiftTo(1,v);
      if(ac) {
        if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }
        c.rShiftTo(1,c);
      }
      else if(!d.isEven()) d.subTo(m,d);
      d.rShiftTo(1,d);
    }
    if(u.compareTo(v) >= 0) {
      u.subTo(v,u);
      if(ac) a.subTo(c,a);
      b.subTo(d,b);
    }
    else {
      v.subTo(u,v);
      if(ac) c.subTo(a,c);
      d.subTo(b,d);
    }
  }
  if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;
  if(d.compareTo(m) >= 0) return d.subtract(m);
  if(d.signum() < 0) d.addTo(m,d); else return d;
  if(d.signum() < 0) return d.add(m); else return d;
}

var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509,521,523,541,547,557,563,569,571,577,587,593,599,601,607,613,617,619,631,641,643,647,653,659,661,673,677,683,691,701,709,719,727,733,739,743,751,757,761,769,773,787,797,809,811,821,823,827,829,839,853,857,859,863,877,881,883,887,907,911,919,929,937,941,947,953,967,971,977,983,991,997];
var lplim = (1<<26)/lowprimes[lowprimes.length-1];

// (public) test primality with certainty >= 1-.5^t
function bnIsProbablePrime(t) {
  var i, x = this.abs();
  if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {
    for(i = 0; i < lowprimes.length; ++i)
      if(x[0] == lowprimes[i]) return true;
    return false;
  }
  if(x.isEven()) return false;
  i = 1;
  while(i < lowprimes.length) {
    var m = lowprimes[i], j = i+1;
    while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];
    m = x.modInt(m);
    while(i < j) if(m%lowprimes[i++] == 0) return false;
  }
  return x.millerRabin(t);
}

// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
function bnpMillerRabin(t) {
  var n1 = this.subtract(BigInteger.ONE);
  var k = n1.getLowestSetBit();
  if(k <= 0) return false;
  var r = n1.shiftRight(k);
  t = (t+1)>>1;
  if(t > lowprimes.length) t = lowprimes.length;
  var a = nbi();
  for(var i = 0; i < t; ++i) {
    //Pick bases at random, instead of starting at 2
    a.fromInt(lowprimes[Math.floor(Math.random()*lowprimes.length)]);
    var y = a.modPow(r,this);
    if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
      var j = 1;
      while(j++ < k && y.compareTo(n1) != 0) {
        y = y.modPowInt(2,this);
        if(y.compareTo(BigInteger.ONE) == 0) return false;
      }
      if(y.compareTo(n1) != 0) return false;
    }
  }
  return true;
}

// protected
BigInteger.prototype.chunkSize = bnpChunkSize;
BigInteger.prototype.toRadix = bnpToRadix;
BigInteger.prototype.fromRadix = bnpFromRadix;
BigInteger.prototype.fromNumber = bnpFromNumber;
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
BigInteger.prototype.changeBit = bnpChangeBit;
BigInteger.prototype.addTo = bnpAddTo;
BigInteger.prototype.dMultiply = bnpDMultiply;
BigInteger.prototype.dAddOffset = bnpDAddOffset;
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
BigInteger.prototype.modInt = bnpModInt;
BigInteger.prototype.millerRabin = bnpMillerRabin;

// public
BigInteger.prototype.clone = bnClone;
BigInteger.prototype.intValue = bnIntValue;
BigInteger.prototype.byteValue = bnByteValue;
BigInteger.prototype.shortValue = bnShortValue;
BigInteger.prototype.signum = bnSigNum;
BigInteger.prototype.toByteArray = bnToByteArray;
BigInteger.prototype.equals = bnEquals;
BigInteger.prototype.min = bnMin;
BigInteger.prototype.max = bnMax;
BigInteger.prototype.and = bnAnd;
BigInteger.prototype.or = bnOr;
BigInteger.prototype.xor = bnXor;
BigInteger.prototype.andNot = bnAndNot;
BigInteger.prototype.not = bnNot;
BigInteger.prototype.shiftLeft = bnShiftLeft;
BigInteger.prototype.shiftRight = bnShiftRight;
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
BigInteger.prototype.bitCount = bnBitCount;
BigInteger.prototype.testBit = bnTestBit;
BigInteger.prototype.setBit = bnSetBit;
BigInteger.prototype.clearBit = bnClearBit;
BigInteger.prototype.flipBit = bnFlipBit;
BigInteger.prototype.add = bnAdd;
BigInteger.prototype.subtract = bnSubtract;
BigInteger.prototype.multiply = bnMultiply;
BigInteger.prototype.divide = bnDivide;
BigInteger.prototype.remainder = bnRemainder;
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
BigInteger.prototype.modPow = bnModPow;
BigInteger.prototype.modInverse = bnModInverse;
BigInteger.prototype.pow = bnPow;
BigInteger.prototype.gcd = bnGCD;
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;

// JSBN-specific extension
BigInteger.prototype.square = bnSquare;

// BigInteger interfaces not implemented in jsbn:

// BigInteger(int signum, byte[] magnitude)
// double doubleValue()
// float floatValue()
// int hashCode()
// long longValue()
// static BigInteger valueOf(long val)

GLOBAL.u = {},
u.BigInteger = Op.Class('BigInteger',null, {
	bigInt: null,
	init: function init(num) {
		this.bigInt = new BigInteger(''+num);
	}.paramType(['long']),
	signum: function() {
		return this.bigInt.signum();
	},
	isProbablePrime: function(num) {
		return this.bigInt.isProbablePrime(num);
	}.paramType(['int']),
	subtract: function(value) {
		//this.bigInt = this.bigInt.subtract();
		return this.bigInt.subtract(value.bigInt);
	}.paramType(['BigInteger']),
	divide: function(value) {
		//this.bigInt = this.bigInt.divide();
		return this.bigInt.divide(value.bigInt);
	}.paramType(['BigInteger']),
	intValue: function() {
		return this.bigInt.intValue();
	},
	static: {
		valueOf: function(long) {
			return new u.BigInteger(long)
		}.paramType(['long']),
		ONE: new u.BigInteger(1)
	},
	
		
});
GLOBAL.unicrypt = {};
unicrypt.math = {};
unicrypt.math.algebra = {};
unicrypt.math.algebra.general = {};
unicrypt.math.algebra.general.interfaces = {};
unicrypt.math.algebra.general.abstracts = {};
unicrypt.math.algebra.multiplicative = {};
unicrypt.math.algebra.multiplicative.abstracts = {};
unicrypt.math.algebra.multiplicative.classes = {};

unicrypt.helper = {};
unicrypt.helper.factorization = {};
unicrypt.helper.map = {};

//  unicrypt.helper.factorization.Factorization = Op.Class('Factorization', {
// 	'extends': unicrypt.UniCrypt
// },{
// 	value: null,
// 	primeFactors: [],
// 	exponents: [],
// 	_init: function(value, primeFactors, exponents) {
// 		this.value = value;
// 		this.primeFactors = primeFactors;
// 		this.exponents = exponents;
// 	}.paramType(['BigInteger','array','array']),
// 	getValue: function() {
// 		return this.value;
// 	}.returnType('BigInteger'),
// 	getPrimeFactors: function() {
// 		return this.primeFactors;
// 	}.returnType('array'),
// 	getExponents: function() {
// 		return this.exponents;
// 	}.returnType('array'),
// 	defaultToStringContent: function() {
// 		return "" + this.getValue();
// 	}.returnType('string'),
// 	hashCode: function() {
// 		int hash = 3;
// 		hash = 89 * hash + this.value.hashCode();
// 		return hash;
// 	}.returnType('int'),
// 	equals: function(obj) {
// 		if (obj == null) {
// 			return false;
// 		}
// 		if (obj instanceof Factorization) {
// 			final Factorization other = (Factorization) obj;
// 			return this.value.equals(other.value);
// 		}
// 		return false;
// 	}.paramType(['object']).returnType('boolean'),
// 	static: {
// 		getInstance: function() {
// 			var primeFactors = this.primeFactors;
// 			var value = this.value;
// 			var exponents = this.exponents;
// 			if (primeFactors == null || exponents == null || primeFactors.length != exponents.length) {
// 				throw new Error('IllegalArgumentException');
// 			}
// 			BigInteger value = BigInteger.ONE;
// 			for (var i = 0; i < primeFactors.length; i++) {
// 				if (primeFactors[i] == null || !MathUtil.isPrime(primeFactors[i]) || exponents[i] < 1) {
// 					throw new Error('IllegalArgumentException');
// 				}
// 				value = value.multiply(primeFactors[i].pow(exponents[i]));
// 			}
// 			var newPrimeFactors = MathUtil.removeDuplicates(primeFactors);
// 			var newLength = newPrimeFactors.length;
// 			var newExponents = new Array(newLength);
// 			for (var i = 0; i < newLength; i++) {
// 				for (var j = 0; j < primeFactors.length; j++) {
// 					if (newPrimeFactors[i].equals(primeFactors[j])) {
// 						newExponents[i] = newExponents[i] + exponents[j];
// 					}
// 				}
// 			}
// 			if (newLength == 1 && newExponents[0] == 1) {
// 				return new Prime(newPrimeFactors[0]);
// 			}
// 			if (newLength == 2 && newExponents[0] == 1 && newExponents[1] == 1) {
// 				return new PrimePair(newPrimeFactors[0], newPrimeFactors[1]);
// 			}
// 			return new Factorization(value, newPrimeFactors, newExponents);
// 		}.paramType(['array','array']).returnType('Factorization')
// 	}
// });
//  unicrypt.helper.factorization.SpecialFactorization = Op.Class('SpecialFactorization', {
// 	'extends': unicrypt.helper.factorization.SpecialFactorization
// },{
// 	init: function() {
// 		this.$$super();
		
// 	}.paramType(['int']),
// 	func: function() {

// 	}.paramType(['E']).returnType(''),
// });
//  unicrypt.helper.factorization.SpecialFactorization = Op.Class('SpecialFactorization', {
// 	'generic': [
// 		'E'
// 	],
// 	'extends': Factorization
// },{
// 	init: function() {
// 		this.$$super();
		
// 	}.paramType(['int']),
// 	func: function() {

// 	}.paramType(['E']).returnType(''),
// });
unicrypt.helper.map.HashMap2D = Op.Class('HashMap2D', {
	'extends': unicrypt.UniCrypt,
	'generic': [
		'K','J','V'
	]
},{
	_hashMaps: {},
	_init: function() {
	},
	get: function(key1, key2) {
		var hashMap = null;
		if(this._hashMaps.hasOwnProperty(key1)) {
			hashMap = this._hashMaps[key1];
		} else {
			return null;
		}
		return hashMap[key2];
	}.paramType(['K','J']).returnType('V'),
	put: function(key1, key2, value) {
		var hashMap = null;
		if(this._hashMaps.hasOwnProperty(key1)) {
			hashMap = this._hashMaps[key1];
		} else {
			hashMap = {};
		}
		hashMap[key2] = value;
		this._hashMaps[key1] = hashMap;
	}.paramType(['K','J','V']),
	static: {
		getInstance: function(genericTyping) {
			return new unicrypt.helper.map.HashMap2D(genericTyping);
		}.paramType(['array'])
	}
});
unicrypt.math.algebra.general.abstracts.AbstractCyclicGroup = Op.AbstractClass('AbstractCyclicGroup', {
	'generic': [
		'E', 'V'
	],
	'extends': {
		'class': unicrypt.math.algebra.general.abstracts.AbstractGroup,
		'generic': [
			'E','V'
		]
	}
},{
	_defaultGenerator: null,
	_generatorLists: {},
	_init: function(valueClass) {
		this.$$super(valueClass)	
	},
	multiply1: function() {

	},
	multiply2: function() {

	},
	multiply3: function() {

	},
	multiply3: function() {

	},
	func: function() {

	},
	func: function() {

	},
	func: function() {

	},
	func: function() {

	},
	func: function() {

	},
	func: function() {

	},
});
unicrypt.math.algebra.general.abstracts.AbstractGroup = Op.AbstractClass('AbstractGroup', {
	'generic': [
		'E', 'V'
	],
	'extends': {
		'class': unicrypt.math.algebra.general.abstracts.AbstractMonoid,
		'generic': [
			'E','V'
		]
	}
},{
	
});
unicrypt.math.algebra.general.abstracts.AbstractMonoid = Op.AbstractClass('AbstractMonoid', {
	'generic': [
		'E', 'V'
	],
	'extends': {
		'class': unicrypt.math.algebra.general.abstracts.AbstractSemiGroup,
		'generic': [
			'E','V'
		]
	}
},{
	
});
unicrypt.math.algebra.general.abstracts.AbstractSemiGroup = Op.AbstractClass('AbstractSemiGroup', {
	'generic': [
		'E', 'V'
	],
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
	INFINITE: u.BigInteger.valueOf(-1),
	UNKNOWN: u.BigInteger.valueOf(-2),
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
	'generic': [
		'E', 'V'
	],
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
//  unicrypt.math.algebra.multiplicative.classes.GStarModElement = Op.Class('GStarModElement', {
// 	'generic': [
// 		'E'
// 	],
// 	'extends': {
// 		'class' : ,
// 		'generic': [
// 			'T', 'string'
// 		]
// 	}
// },{
// 	init: function() {
// 		this.$$super();
		
// 	}.paramType(['int']),
// 	func: function() {

// 	}.paramType(['E']).returnType(''),
// });
unicrypt.math.algebra.multiplicative.classes.GStarModPrime = Op.Class('GStarModPrime', {
	'extends': unicrypt.math.algebra.multiplicative.classes.GStarMod
},{
	_init: function(modulus, orderFactor) {	
		this.$$super(modulus, orderFactor);
		
	}.paramType(['BigInteger','BigInteger']),
	// func: function() {

	// }.paramType(['E']).returnType(''),
	static: {
		getInstance: function(modulus, orderFactor) {
			if (modulus == null || orderFactor == null) {
				throw new Error('IllegalArgumentException');
			}
			if (!modulus.getValue().subtract(BigInteger.ONE).mod(orderFactor.getValue()).equals(BigInteger.ZERO)) {
				throw new Error('IllegalArgumentException');
			}
			var instance = this._static_.instances.get(modulus, orderFactor);
			if (instance == null) {
				instance = new GStarModPrime(modulus, orderFactor);
				this._static_.instances.put(modulus, orderFactor, instance);
			}
			return instance;
		}.paramType(['BigInteger', 'BigInteger']),
		instances: null
	}
});
unicrypt.math.algebra.multiplicative.classes.GStarModSafePrime = Op.Class('GStarModSafePrime', {
	'extends': unicrypt.math.algebra.multiplicative.classes.GStarModPrime
},{
	_init: function(modulus) {	
		this.$$super(modulus, modulus.subtract(u.BigInteger.ONE).divide(u.BigInteger.valueOf(2)));
		
	}.paramType(['BigInteger']),
	// func: function() {

	// }.paramType(['E']).returnType(''),
	static: {
		getInstance: function(modulus) {
			var mod = new u.BigInteger(modulus);
			if (modulus == null) {
				throw new Error('IllegalArgumentException');
			}
			//var instance = this._static_.instances.get(modulus, orderFactor);
			//if (instance == null) {
				//instance = new GStarModPrime(modulus, orderFactor);
				//this._static_.instances.put(modulus, orderFactor, instance);
			//}

			if(!(mod.signum() > 0 && mod.isProbablePrime(40))) {
				throw new Error('IllegalArgumentException');
			}
			var q = (modulus - 1) / 2
			if(!(q.signum() > 0 && q.isProbablePrime(40))) {
				throw new Error('IllegalArgumentException');
			}			
			var instance = new unicrypt.math.algebra.multiplicative.classes.GStarModSafePrime(modulus);
			return instance;
		}.paramType(['long']),
		//instances: null
	}
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
//var uniD = {},
//var uniD.alg.GStarMod = unicrypt.math.algebra.multiplicative.classes.GStarMod.getInstance();


// var hashMap = unicrypt.helper.map.HashMap2D.getInstance(['int','int','string']);

// console.log(hashMap._generic_);
// hashMap.put(10,20,'hallo');
// console.log('here: ' + hashMap.get(10,20));

var bigInt = new u.BigInteger(60);
var bigInt2 = new u.BigInteger(30);
var bigInt = bigInt.subtract(bigInt2);
console.log('BigInteger: ' + bigInt.intValue());