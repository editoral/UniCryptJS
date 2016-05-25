//"use strict";




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


// demo.snippet.classBased.Pflanze = class Pflanze {
// 	constructor(vorkommen, grösse) {
// 		this.vorkommen = vorkommen;
// 		this.grösse = grösse;
// 	}

// 	get info() {
// 		return this.vorkommen + " " + this.grösse;
// 	}

// 	static explain() {
// 		return "Mit mir kann man Pflanzen erstellen."
// 	}
// }


// demo.snippet.classBased.Baum = class Baum extends demo.snippet.classBased.Pflanze {
// 	constructor(art, laubbaum, vorkommen, grösse) {
// 		super(vorkommen, grösse);
// 		this.art = art;
// 		this.laubbaum = laubbaum;	
// 	}
// 	get info() {
// 		return super.info() + " " + this.art + " " + this.laubbaum;
// 	}
// }

// demo.snippet.classBased.returnBaum = function(art, laubbaum, vorkommen, grösse) {
// 	return new demo.snippet.classBased.Baum(art, laubbaum, vorkommen, grösse);
// }

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
		return this.ursprungsKontostand
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




demo.fw = {}

demo.fw.BaseClass = Op.Class('BaseClass', null, {
	constructorParam: null,
	init: function(initParam) {
		this.constructorParam = initParam;
	}.paramType(['int']),
	function1: function(param1, param2) {
		return param1 + param2;
	}.paramType(['int', 'int']),
	x: 10
});

demo.fw.SecondBaseClass = Op.Class('SecondBaseClass', null,{
	functionCombine: function(param1, param2) {
		return param1.constructorParam + param2;
	}.paramType(['BaseClass', 'int'])
});

demo.fw.ChildClass = Op.Class('ChildClass',  {
		'extends': demo.fw.BaseClass	
	},{
	init: function(initStrParam, intForSuperClass) {
		this.strConstructorParam = initStrParam;
		this.$$super(intForSuperClass);
	}.paramType(['string', 'int']),
	y: 20,
	strConstructorParam: null,
	testSuper: function() {
		return this.strConstructorParam + " " + this.constructorParam;
	},
	functionTyping: function() {
		return 'ok';
	}.paramType(['int', 'boolean', 'string']),

});


demo.fw.AbstractClass = Op.AbstractClass('AbstractClass', null, {
	init: function(constructorParam) {
		this.constructorParam = constructorParam;
		var x = this.getZ() //= 40;
	},
	z: 20,
	constructorParam: null,
	$abstractFunction: function() {}

})

demo.fw.ExtendsAbstract = Op.Class('ExtendsAbstract',  {
		'extends': demo.fw.AbstractClass
	}, {
	init: function(constructorParam) {
		this.constructorParam = constructorParam;
		this.z = 40;
	},
	z: 20,
	abstractFunction: function() {
		
	}
})

var abstractClass = new demo.fw.ExtendsAbstract(20);
//var abstractClass2 = new demo.fw.AbstractClass(20);

demo.fw.GenericClass1 = Op.Class('GenericClass', {
	'generic': [
		'T', 'V'
	],
	'extends': demo.fw.ChildClass
},{
	init: function() {

	},
	genericFunction: function(gen1, gen2) {

	}.paramType(['T','V'])
});

var genericClass1 = new demo.fw.GenericClass1(['string','string']);
genericClass1.genericFunction('10','10');

// demo.fw.GenericClass2 = Op.Class('GenericClass2' , {
// 	'generic': [
// 		'B', 'A'
// 	],
// 	'extends': {
// 		'class': demo.fw.GenericClass1,
// 		'generic': ['']
// 	}
// },{

// });


        GenericClass1 = Op.Class('GenericClass1', {
            'generic': [
                'T', 'V'
            ]
        },{
            genericFunction: function(gen1, gen2) {
                 return gen2 + " " + gen1;
            }.paramType(['T','V'])
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
            	this.$$super();
                this.x = int * int2;
            }.paramType(['int', 'int']),
            x: 0,
            genericFunc: function(gen1, gen2) {
                return gen1 + gen2;
            }.paramType(['T','K'])
        });
		var genericClass2 = new GenericClass2(['int','int'], 13, 13);
        var test = function() {
            return genericClass2.genericFunction(5, 'Apfel:');
        }
        console.log('Test: ' + test());
        console.log(genericClass2._generic_)

demo.fw.StaticVariables = Op.Class('StaticVariables', null, {
	init: function(int) {
		this.x = int;
	},
	x: 0,
	static: {
		z: 0,
		y: 0,
		increment: function() {
			demo.fw.StaticVariables.z += 1;
		}
	},
	setY: function(y) {
		console.log('here: ' + this.static);
		this.static.y = y;
	}	
});

var staticVariables = new demo.fw.StaticVariables(20);
demo.fw.StaticVariables.increment();
demo.fw.StaticVariables.increment();
//console.log(demo.fw.StaticVariables.z);
staticVariables.setY(10);
//console.log(demo.fw.StaticVariables.y);

demo.fw.InterfaceTest = Op.Interface('TestInt', null, {
	funcOne: function() {

	}.paramType(['int']).returnType('string'),
	funcTwo: function() {

	}.paramType(['int', 'string']).returnType('int'),
});



demo.fw.InterfaceTestClass = Op.Class('InterfaceTestClass', {
	'implements': [demo.fw.InterfaceTest]	
},{
	funcOne: function() {
		return 10;
	}.paramType(['int']).returnType('string'),
	funcTwo: function() {
		return 10;
	}.paramType(['int', 'string']).returnType('int'),
});

var intTest = new demo.fw.InterfaceTestClass();


// demo.fw.GenericClass2 = Op.Class('GenericClass2', {
// 	'generic': {
// 		'V': null,
// 		'T': {
// 			'GenericClass': 'V'
// 		}
// 	}
// },{

// });

demo.fw.PrivateConstructor = Op.Class('PrivateConstructor', null, {
	_init: function(constructorParam) {
		this.x = constructorParam;
	}.paramType(['int']),
	static: {
		getInstance: function() {
			console.log('hello');
			return new demo.fw.PrivateConstructor(20);
		}
	},
	x: 10
});

var privateTester = new demo.fw.PrivateConstructor.getInstance();
console.log('hi: ' + privateTester.x);


//console.log(demo.fw.BaseClass.prototype.constructor.name);

// var myBaseClass = new demo.fw.BaseClass(20);
// //console.log(myBaseClass.constructor.name);
// var mySecClass = new demo.fw.SecondBaseClass();
// //console.log(mySecClass.functionCombine(myBaseClass, 30));

// var childClass = new demo.fw.ChildClass('My super int:', 10);
// console.log(childClass.functionTyping(10,true,'ew'));




// var BaseClass = Op.Class('BaseClass', null,{
// 			//in constructor assigned variable
// 			preInitVariable: null,
// 			//instance variable with preset value
// 			x: 20,
// 			//variable to override
// 			toBeOverwritten: null,
// 			// constructor function
// 			init: function(initVar) {
// 				this.preInitVariable = initVar;
// 			//paramType, spezifies input type
// 		}.paramType(['int']),
// 			//function to test the typing
// 			tester: function() {
// 				return 'ok';
// 			}.paramType(['int', 'boolean', 'string']).returnType('string'),
// 			//second function to test typing
// 			functionTyping2: function() {
// 				return 'oki';
// 			}.paramType(['Constructorless', 'object']).returnType('int')
// 		});

// var baseClass = new BaseClass(10);
// baseClass.tester(10, true, 'hallo');
//console.log(baseClass.tester.prototype._paramType_)

/*
Konventionen:

init ist der Konstruktor
function() {} wurde um paramType erwietert
				es wird ein Array mit den Typen in richtiger reihenfolge erwartet
Op.Class bekommt als parameter einen name und ein klassenobjekt
this.$$super ist die Super konstruktor funktion.



TypeScript Warum nicht TypeScript verwenden?
Underline für Private Convention 

*/



var BaseClass = Op.Class('BaseClass', null,{
            func1: function(int1) {
                return int1;
            }.paramType(['int']).returnType('int'),
            func2: function(int1, int2) {
                return int1 + int2;
            }.paramType(['int','int']).returnType('int'),
            func2: function(int1, int2, string1) {
                return string1 + (int1 + int2);
            }.paramType(['int','int', 'string']).returnType('string'),
            func4: function(string1) {
                return string1 + ' : one single argument';
            }.paramType(['string']).returnType('string')
        });

var ChildClass = Op.Class('ChildClass',  {
	'extends': BaseClass
}, {

});
var GrandChildClass = Op.Class('GrandChildClass',  {
	'extends': ChildClass
}, {

});
var baseClass = new BaseClass();
var grandChildClass = new GrandChildClass();
var result = grandChildClass.func(10, 20, 'Result: ');
console.log('overload: ' + result);

// var Class1 = Op.Class('Class1', null, {
// 	init: function(val) {
// 		console.log(val);
// 	},
// });


// var Class2 = Op.Class('Class2', {
// 	'extends': Class1
// }, {
// 	init: function(val) {
// 		this.$$super(val);
// 	}
// });

// var Class3 = Op.Class('Class3', {
// 	'extends': Class2
// }, {
// 	init: function(val) {
// 		this.$$super(val);
// 	}
// });


// var class3 = new Class3('hll');

// var Class4 = Op.Class('Class4', {

// },{
// 	func: function(class1) {

// 	}.paramType(['Class1'])
// });

// var Class5 = Op.Class('Class5', null, {
// 	init: function(val) {
// 		console.log(val);
// 	},
// });


// var class4 = new Class4();
// var class5 = new Class5();
// class4.func(class3);
// class4.func(class5);


var Class1 = Op.Class('Class1', {
	'generic': ['E', 'V'],
}, {
	init: function(val) {
		console.log(val);
	},
	testFunc: function(val) {
		return 10;
	}.returnType('V')
});


var Class2 = Op.Class('Class2', {
	'generic': ['E', 'V'],
	'extends': {
		'class': Class1,
		'generic': ['E', 'V']
	}
}, {
	init: function(val) {
		this.$$super(val);
	}
});

var Class3 = Op.Class('Class3', {
	'extends': {
		'class': Class2,
		'generic': ['string', 'int']
	}
}, {
	init: function(val) {
		this.$$super(val);
	}
});

var class3 = new Class3(10);
class3.testFunc(10);
