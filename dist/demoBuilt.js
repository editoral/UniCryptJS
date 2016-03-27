"use strict";




GLOBAL.demo = {}

demo.jsObject = function() {
	var name = "Tom";
	var lastName = "Heinz";
	var concat = function() {
		return name + " " + lastName;
	}
}

demo.execute = function() {
	var newObj = new demo.jsObject();
	newObj.name = "Dimitri";
	var newObj2 = new demo.jsObject();
	return newObj2.name + " " + newObj.name
}

demo.jsObject2 = function() {
	this.name = "Tom",
	this.lastName = "Heinz",
	this.concat = function() {
		return name + " " + lastName;
	}
}

demo.execute2 = function() {
	var newObj = new demo.jsObject2();
	newObj.name = "Dimitri";
	var newObj2 = new demo.jsObject2();
	return newObj2.name + " " + newObj.name
}


demo.BaseClass = function(var1, var2) {
	if (!(this instanceof demo.BaseClass)) {
		return new demo.BaseClass(var1, var2);
	}
	this.instanceVar1 = var1;
	this.instanceVar2 = var2;
	var privateVar = var1;
	var privateVar2 = var2;
	var privateFunction = function() {
		return privateVar + privateVar2;
	}

	this.privilegedFunction = function() {
		return privateVar + privateVar2;
	}

}

demo.BaseClass.prototype.function1 = function() {
	return this.instanceVar1 + " " + this.instanceVar2;
}

demo.ChildClass1 = function(var1) {
	if (!(this instanceof demo.ChildClass1)) {
		return new demo.ChildClass1(var1, var2);
	}
	this.ChildClass1 = var1;
	this.instanceVar2 = 'Hi';
}
demo.ChildClass1.prototype = new demo.BaseClass();
demo.ChildClass1.prototype.constructor = demo.ChildClass;


demo.execute3 = function() {
	var child = new demo.ChildClass1(10,20);
	return typeof(child.privateFunction);
}
demo.execute4 = function() {
	var base = new demo.BaseClass(10,20);
	return base.privilegedFunction();
}



demo.snippet = {}

demo.snippet.classBased = {}

// Dies ist nur zum Spass hier
// ECMAScript 6 wird leider nicht von allen Browsern unterstützt
// und ist erst am kommen. Deshalb nur der Vollständigkeitshalber hier beschrieben.


demo.snippet.classBased.Pflanze = class Pflanze {
	constructor(vorkommen, grösse) {
		this.vorkommen = vorkommen;
		this.grösse = grösse;
	}

	get info() {
		return this.vorkommen + " " + this.grösse;
	}

	static explain() {
		return "Mit mir kann man Pflanzen erstellen."
	}
}


demo.snippet.classBased.Baum = class Baum extends demo.snippet.classBased.Pflanze {
	constructor(art, laubbaum, vorkommen, grösse) {
		super(vorkommen, grösse);
		this.art = art;
		this.laubbaum = laubbaum;	
	}
	get info() {
		return super.info() + " " + this.art + " " + this.laubbaum;
	}
}

demo.snippet.classBased.returnBaum = function(art, laubbaum, vorkommen, grösse) {
	return new demo.snippet.classBased.Baum(art, laubbaum, vorkommen, grösse);
}

//Dies ist sowohl eine Funktion wie auch ein instantiierbares Objekt. 
demo.snippet.Fahrzeug = function(anzahlRäder, führerAusweisKategorie, autobahnZulassung) {
	// this ist eine Referenz auf sich selbst. Sehr verwirrend, da es ja eine Funktion ist und keine Klasse.
	// Es handelt sich um die Attribute
	this.anzahlRäder = anzahlRäder;
	this.führerAusweisKategorie = führerAusweisKategorie;
	this.autobahnZulassung = autobahnZulassung;
	// super privat. Ohne privileged getter methode wird nie jemand den ölstand erfahren!
	// Sehr wichtig ist dabei die Erkenntnis, dass diese privaten Variablen auch nicht von den
	// EIGENEN public Methoden abgerufen werden können. Im Sinne von Java sind dies also keine private Attribute.
	var ölstand = "leer";
	//Wegen einem Implementierungsfehler
	var that = this;

	// Dasselbe gilt auch für private Methoden. Dies mag auf den ersten Blick ziemlich sinnlos sein.
	// Hier ein möglicher Verwendungszweck ein dreifach Singleton.
	var anzahlFreiePlätze = 3;
	function esGibtNur3FahrzeugeAufDerErde() {
		if (anzahlFreiePlätze > 0) {
			anzahlFreiePlätze -= 1;
			return true;
		} else {
			return false;
		}
	}
	// factory Methode
	this.gibMirEinNeuesFahrzeug = function() {
		if(esGibtNur3FahrzeugeAufDerErde()) {
			return new demo.snippet.Fahrzeug(5,"K",false);
		} else {
			throw new Error("CO2-Emissions Stop!");
		}
	}

	// Viel besser aber wäre doch eine Möglichkeit von aussen auf die privaten Variablen zugreiffen zu könen.
	// Dazu braucht es aber eine getter und setter Methode: Die Privileged Methode.
	this.lassMichBitteDenÖlstandSehen = function() {
		return "nicht " + ölstand;
	}

}


// Und nun wird vererbt!

// Damit es was zu erben gibt, wird eine public Methode hinzugefügt
demo.snippet.Fahrzeug.prototype.ichFahrDavon = function() {
	return "Brumm!";
}
demo.snippet.Fahrzeug.prototype.meinTreibstoff = function() {
	return "Was brennbares";
}


// Dies ist ein gewöhnlicher Konstruktor der die Attribute initialisiert
demo.snippet.Auto = function(farbe, marke, preis) {
	// Wir wollen eine Typenprüfung
	if (!((typeof preis === "number") && Math.floor(preis) === preis)) {
		throw new Error("kein Integer");
	}
	// Neu wird verhindert, dass diese Funktion kein Objekt zurückliefert.
	if (!(this instanceof demo.snippet.Auto)) {
		// Es wird das Objekt auf dem herkömlichen Weg instantiiert
		// Diese Funktion muss also im OOP Kontext verwendet werden
		return new demo.snippet.Auto(farbe, marke, preis);
	}
	this.farbe = farbe;
	this.marke = marke;
	this.preis = preis;
	// Da es ein Auto ist, wissen wir was wir beim Fahrzeug constructor setzten müssen
	// Call führt eine Funktion aus, allerdings wird der Kontext der Funktion als erster Parameter übergeben!
	demo.snippet.Fahrzeug.call(this, 4, 'B', true);
}
// Die Eigenschaft prototype des Objektes wird auf das Fahrzeug gesetzt
// Nun sind alle Attribute und Methoden des Fahrzeuges auch für ein Auto vorhanden
// Würden wir eine Instanz von Auto erstellen, so müssten wir beim Aufruf 
// Auto(anzahlRäder, führerAusweisKategorie, autobahnZulassung) angeben.
// Warum? Weil der Konstruktor ebenfalls überschrieben wurde und nun dem von Fahrzeug entspricht.
demo.snippet.Auto.prototype = new demo.snippet.Fahrzeug();
// Der Konstruktor muss explizit gesetzt werden. Es muss nämlich der Konsturktor von Auto aufgerufen werden und 
// nicht derjenige von Fahrzeug. Dies funktioniert so schön, da demo.snippet.Auto eine Funktionsreferenz darstellt.
demo.snippet.Auto.prototype.constructor = demo.snippet.Auto; 
// dem neuen Objekt können methoden hinzugefügt werden oder bestehend können überschrieben werden.
// Die Privileged Methode kann überschrieben oder gelöscht, nicht aber verändert werden. Das Geheimnis des Ölstandes bleibt sicher!

// überschreiben
demo.snippet.Auto.prototype.meinTreibstoff = function() {
	return "Benzin";
}
// erweitern
demo.snippet.Auto.prototype.scheibenwischer = function() {
	return "wisch meinen " + this.marke;
}

// Interface
// Verhindert das eine Klasse ohne Vererbung instantiiert wird.

demo.snippet.interface = {}

demo.snippet.interface.Interface = function() {
	// Handelt es sich beim constructor um diese funktion, so wurde das Interface noch nicht vererbt
	// es wird ein Error geworfen. 
	if(this.constructor === demo.snippet.interface.Interface) {
		throw new Error("Interfaces shall not be instantiiated!");
	}
	
}
demo.snippet.interface.Interface.prototype.someMethod = function() {
	return "wuff";
}

demo.snippet.interface.Class = function() {
	this.secondMethod = function() {

	}
}

demo.snippet.interface.Class.prototype = Object.create(demo.snippet.interface.Interface.prototype);
demo.snippet.interface.Class.prototype.constructor = demo.snippet.interface.Class;


//Interface zum zweiten. Andere Möglichkeit ein Interface zu definieren, dass nicht instantiiert werden kann.
demo.snippet.interface2 = {}
demo.snippet.interface2.Bankkonto = {
	abheben : function(summe) {},
	einzahlen : function(summe) {}
}

demo.snippet.interface2.UbsKonto = function(ursprungsKontostand) {
	this.ursprungsKontostand = ursprungsKontostand;

	//Überprüft ob alle Methoden implementiert wurden
	//Na ja ist leider nicht so toll. 
	var proto = this.__proto__.__proto__;
	for(var prop in proto){
		if (typeof proto[prop] === 'function') {
			if(!demo.snippet.interface2.UbsKonto.prototype.hasOwnProperty(prop)) {
				throw new Error('Interface not implemented');
			}
		}
	}

}

demo.snippet.interface2.CSSKonto = function(ursprungsKontostand, policeNr) {
	this.ursprungsKontostand = ursprungsKontostand;

	var proto = this.__proto__.__proto__;
	for(var prop in proto){
		if (typeof proto[prop] === 'function') {
			if(!demo.snippet.interface2.CSSKonto.prototype.hasOwnProperty(prop)) {
				throw new Error('Interface not implemented');
			}
		}
	}

}
demo.snippet.interface2.UbsKonto.prototype = Object.create(demo.snippet.interface2.Bankkonto);
demo.snippet.interface2.CSSKonto.prototype = Object.create(demo.snippet.interface2.Bankkonto);

demo.snippet.interface2.UbsKonto.prototype.constructor = demo.snippet.interface2.UbsKonto;
demo.snippet.interface2.CSSKonto.prototype.constructor = demo.snippet.interface2.CSSKonto;

demo.snippet.interface2.UbsKonto.prototype.abheben = function(summe) {
	this.ursprungsKontostand -= summe;
	return this.ursprungsKontostand;
}

demo.snippet.interface2.UbsKonto.prototype.einzahlen = function(summe) {
	this.ursprungsKontostand += summe;
	return this.ursprungsKontostand;
}

demo.snippet.interface2.CSSKonto.prototype.abheben = function(summe) {
	this.ursprungsKontostand -= summe;
	return this.ursprungsKontostand;
}

// Erweiterung für abstrakte Klassen
// Abstrakte Klassen werden als Interfaces behandelt. 

demo.snippet.interface3 = {}
demo.snippet.interface3.Bankkonto = function() {
	this.abheben = function(summe) {}
	this.einzahlen = function(summe) {}
}

demo.snippet.interface3.UbsKonto = function(ursprungsKontostand) {
	this.ursprungsKontostand = ursprungsKontostand;

	// Es wird nicht wirklich besser! Es funktioniert zwar, allerdings muss zwischen abstrakten Funktionen
	// und bereits implementierten funktionen unterschieden werden.
	// Ist ein interessanter Ansatz. 
	var proto = new this.__proto__.__proto__();
	var obj = Object.create(proto);
	console.log(proto);

	for(var prop in proto){
		if (typeof proto[prop] === 'function') {
			if(!demo.snippet.interface3.UbsKonto.prototype.hasOwnProperty(prop)) {
				throw new Error('Interface not implemented');
			}
		}
	}

}

demo.snippet.interface3.UbsKonto.prototype = Object.create(demo.snippet.interface3.Bankkonto);

demo.snippet.interface3.UbsKonto.prototype.constructor = demo.snippet.interface3.UbsKonto;

demo.snippet.interface3.UbsKonto.prototype.abheben = function(summe) {
	this.ursprungsKontostand -= summe;
	return this.ursprungsKontostand;
}

demo.snippet.interface3.UbsKonto.prototype.einzahlen = function(summe) {
	this.ursprungsKontostand += summe;
	return this.ursprungsKontostand;
}

// Konkrete Version einer Abstrakten Klasse

demo.snippet.abstractClass = {}
demo.snippet.abstractClass.Bankkonto = function() {
	if(this.constructor === demo.snippet.abstractClass.Bankkonto) {
		//throw new Error("Abstract classes shall not be instantiiated!");
	}
	this.ursprungsKontostand;
	this.$abheben = function(summe) {}
	this.einzahlen = function(summe) {
		this.ursprungsKontostand += summe;
		return this.ursprungsKon
	}
}

demo.snippet.abstractClass.UbsKonto = function(ursprungsKontostand) {
	this.ursprungsKontostand = ursprungsKontostand;

	var proto = new this.__proto__.__proto__();
	var obj = Object.create(proto);
	//console.log(proto);

	for(var prop in proto){
		//1console.log(prop.match('\$') + " " + prop);
		if (typeof proto[prop] === 'function' && prop.match('\\$')) {
			prop = prop.substring(1);
			if(!demo.snippet.abstractClass.UbsKonto.prototype.hasOwnProperty(prop)) {
				throw new Error('Abstract not implemented');
			}
		}
	}

}

demo.snippet.abstractClass.UbsKonto.prototype = Object.create(demo.snippet.abstractClass.Bankkonto);

demo.snippet.abstractClass.UbsKonto.prototype.constructor = demo.snippet.abstractClass.UbsKonto;

demo.snippet.abstractClass.UbsKonto.prototype.abheben = function(summe) {
	this.ursprungsKontostand -= summe;
	return this.ursprungsKontostand;
}

var x = new demo.snippet.abstractClass.UbsKonto(1000);


// // Variablen zugriffsmodifizierer

// demo.snippet.visibility = {}
// demo.snippet.visibility.Werkzeug = function() {

// }

// demo.snippet.visibility.Werkzeug.prototype._private = function() {

// }

// demo.snippet.visibility.Hammer = function() {
// 	var x = 10;


// }

// demo.snippet.visibility.Hammer.prototype = Object.create(demo.snippet.visibility.Werkzeug);
// demo.snippet.visibility.Hammer.prototype.constructor = demo.snippet.visibility.Hammer;

// demo.snippet.visibility.Hammer.prototype.getX = function() {
// 	return this.x;
// }

// var hammer = new demo.snippet.visibility.Hammer();
// console.log(hammer.getX());

// Typenprüfung

demo.snippet.typing = {}

// Native Datentypen

demo.snippet.typing.types = function(type, val) {
	var h = new demo.snippet.typing.Helper();
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
		case 'String':
		h.strTest(val);
		break;
		default:
		h.obj(type,val);

	}
}

demo.snippet.typing.Helper = function() {
}

demo.snippet.typing.Helper.prototype = {
	integer: function(val) {
		//Integer existiert in JavaScript nicht!
		//Es wird eine Prüfung auf number gemacht und anschliesend geschaut,
		//ob es Nachkomastellen hat.
		if (!((typeof val === "number") && Math.floor(val) === val)) {
			throw new Error("param " + val + " is not an integer!");
		}
	},
	boolean: function() {
		if (!(typeof val === "boolean")) {
			throw new Error("param " + val + " is not a boolean!");
		}	
	},
	strTest: function() {
		if (!(typeof val === "boolean")) {
			throw new Error("param " + val + " is not a boolean!");
		}	
	},
	obj: function(type, val) {
		if (typeof val === "object") {
			console.log('hi ' + val.constructor.name);
			if(!(val.constructor.name === type)) {
				throw new Error("param " + val + " is not from type " + type + "!");
			}
		} else {
			throw new Error("param " + val + " is not an object!");
		}
	}
}

demo.snippet.typing.Hammer = function Hammer(preis) {
	this.preis = preis;
}

demo.snippet.typing.Nagel = function Nagel() {
	var paramType = ['int length', 'int width'];
	for(var i = 0; i < paramType.length; i++) {
		var res = paramType[i].split(" ");
		demo.snippet.typing.types(res[0], arguments[i]);
		this[res[1]] = arguments[i];
	}

}

demo.snippet.typing.Nagel.prototype.einschlagen = function() {
	var paramType = ['Hammer hammer'];
	for(var i = 0; i < paramType.length; i++) {
		var res = paramType[i].split(" ");
		demo.snippet.typing.types(res[0], arguments[i]);
		this[res[1]] = arguments[i];
	}
}


// var nagel = new demo.snippet.typing.Nagel(10,20);
// var hammer = new demo.snippet.typing.Hammer(100);
// nagel.einschlagen(hammer);


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

//Intern functions. Should not be used from the outside.
Op._ = {}

Op._.helper = {}

Op._.helper.matchParamsArgs = function(paramType, args) {
	if(paramType.length !== args.length) {
		throw new Error("Number of parameter types and number of parameters missmatch!");
	}
	for(var i = 0; i < paramType.length; i++) {
		Op._.typing.testTypes(paramType[i], args[i]);
	}	
}

/**
 * JavaScript Rename Function
 * @author Nate Ferrero
 * @license Public Domain
 * @date Apr 5th, 2014
 */
Op._.helper.renameFunction = function (name, fn) {
    return (new Function("return function (call) { return function " + name +
        " () { return call(this, arguments) }; };")())(Function.apply.bind(fn));
};  

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
	boolean: function() {
		if (!(typeof val === "boolean")) {
			throw new Error("param " + val + " is not a boolean!");
		}	
	},
	strTest: function() {
		if (!(typeof val === "boolean")) {
			throw new Error("param " + val + " is not a boolean!");
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
	}
}

Op._.typing.testTypes = function(type, val) {
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
		case 'String':
		h.strTest(val);
		break;
		default:
		h.obj(type,val);

	}
}


/** 
* Creates a new Class
* 
* @param {string} name - The name of the new Class
* @param {object} actual class - JavaScript Object to define the Class
**/
Op.Class = function() {
	//Fetch the parameters
	var className = arguments[0];
	var obj = arguments[1];

	//Makes sure, that there is a constructor function avaliable
	if(!obj.hasOwnProperty('init') || typeof obj.init !== 'function') {
		obj.init = function init() {}
	}

	//define a new constructor
	var newClass = function() {
		//Tests the typing
		var paramType = obj.init.prototype._paramType_;
		if(Array.isArray(paramType)) {
			Op._.helper.matchParamsArgs(paramType, arguments);
		}
		//assign all instance variables
		for(var prop in obj) {
			if(!(prop === 'init')) {
				if(['number', 'boolean', 'string', 'object'].indexOf(typeof obj[prop]) >= 0) {
					this[prop] = obj[prop];
				}
			}
		}
		//execute the defined init function, as the oop constructor
		obj.init.apply(this, arguments);
	}

	//name the new Class
	newClass = Op._.helper.renameFunction(className, newClass);

	//append all defined functions to prototype of the new JavaScript function
	//they will be wrapped in another function to ensure the right types of the parameters
	for(var prop in obj) {
		if(!(prop === 'init')) {
			if(typeof obj[prop] === 'function') {
				var paramType = obj[prop].prototype._paramType_;
				//If the type of the Params are spezified a wrapper is defined
				if(Array.isArray(paramType)) {
					var execFunc = obj[prop];
					var typingWrapper = function() {
						Op._.helper.matchParamsArgs(paramType, arguments);
						return execFunc.apply(this, arguments);
					}
					newClass.prototype[prop] = typingWrapper;
				} else {
					newClass.prototype[prop] = obj[prop];
				}
			}
		}
	}

	return newClass;
}




demo.fw = {}

demo.fw.BaseClass = Op.Class('BaseClass', {
	constructorParam: null,
	init: function(initParam) {
		this.constructorParam = initParam;
	}.paramType(['int']),
	function1: function(param1, param2) {
		return param1 + param2;
	}.paramType(['int', 'int']),
	x: 10
});

demo.fw.SecondBaseClass = Op.Class('SecondBaseClass', {
	functionCombine: function(param1, param2) {
		return param1.constructorParam + param2;
	}.paramType(['BaseClass', 'int'])
});

//console.log(demo.fw.BaseClass.prototype.constructor.name);

var myBaseClass = new demo.fw.BaseClass(20);
//console.log(myBaseClass.constructor.name);
var mySecClass = new demo.fw.SecondBaseClass();
console.log(mySecClass.functionCombine(myBaseClass, 30));



// Function.prototype.inherit = function(obj) {

// }

// GLOBAL.Op = {}

// Op.Class = function()  {
// 	var parent;
// 	var methods;
// 	var newClass = function() {
// 		this.initialize.apply(this, arguments);
// 	}
// 	var extend = function(destination, source) {   
// 		for (var property in source) {
// 			destination[property] = source[property];
// 		}
// 		destination.$super =  function(method) {
// 			return this.$parent[method].apply(this.$parent, Array.prototype.slice.call(arguments, 1));
// 		}
// 		return destination;
// 	}

// 	if (typeof arguments[0] === 'function') {       
// 		parent  = arguments[0];       
// 		methods = arguments[1];     
// 	} else {       
// 		methods = arguments[0];     
// 	}     

// 	if (parent !== undefined) {       
// 		extend(newClass.prototype, parent.prototype);       
// 		newClass.prototype.$parent = parent.prototype;
// 	}
// 	extend(newClass.prototype, methods);  
// 	newClass.prototype.constructor = newClass;      

// 	if (!newClass.prototype.initialize) newClass.prototype.initialize = function(){};        

// 	return newClass;   
// }


// Op.helper = {}

// // Op.helper.iterateObj = function* (obj) {
// // 	for (var key in obj) {
// // 		if (obj.hasOwnProperty(key)) {
// // 			yield obj[key];
// // 		}
// // 	}
// // }


// var Myclass = Op.Class({
// 	initialize: function(name, age) {
// 		this.name = name;
// 		this.age  = age;
// 	},
// 	print: function() {
// 		console.log(this.name + " " + this.age);
// 	}
// });

// var inst = new Myclass("Bob",29);
// inst.print();
GLOBAL.unicrypt = {}

unicrypt.helper = {}

unicrypt.helper.math = {}

unicrypt.helper.math.MathUtil = function() {
	var z = 0;
	for (var i = 0; i < 10; i++) {
		z = i;
	}
	return i
}

