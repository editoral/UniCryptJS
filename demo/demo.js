demo = {}

demo.jsObject = function() {
	name = "Tom",
	lastName = "Heinz",
	concat = function() {
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
	privateFunction = function() {
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

	this.gibMirEinNeuesFahrzeug = function() {
		if(esGibtNur3FahrzeugeAufDerErde()) {
			return new demo.snippet.Fahrzeug(5,"K",false);
		} else {
			throw new Error("CO2-Emissions Stop!");
		}
	}

	//Viel besser aber wäre doch eine Möglichkeit von aussen auf die privaten Variablen zugreiffen zu könen.
	//Dazu braucht es aber eine getter und setter Methode: Die Privileged Methode.
	this.lassMichBitteDenÖlstandSehen = function() {
		return "nicht " + ölstand;
	}

}


//Und nun wird vererbt!