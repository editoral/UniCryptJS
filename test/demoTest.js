var assert = require('assert');
var expect = require('expect.js');
var build = require('../dist/demoBuilt.js');


describe('A first example', function() {
    it('will write names but can\'t', function () {
      assert.notEqual("Tom Dimitri", demo.execute());
    });
    it('will now have instance variables', function() {
    	assert.equal("Tom Dimitri", demo.execute2());
    });
    it('calls a private function', function() {
    	assert.equal("undefined", demo.execute3());
    });
    it('it calls a privileged function', function() {
    	assert.equal(30, demo.execute4());
    });
});


describe('wie ich die closures und Instatntiirung teste' , function() {
    it('benutzt meine Klasse nicht als Klasse', function() {
        var fahrzeug = demo.snippet.Fahrzeug(3,"B",true);
        var test = function() {
            //Geht natürlich nicht, da die Funktion nicht
            // return this; enthält. Trotzdem gibt es momentan nichts
            //was dies verhindern würde.
            return fahrzeug.anzahlRäder;
        }
        expect(test).to.throwError();
    });

    it('will nun das Schlüsselwort new brauchen', function() {
        var fahrzeug = new demo.snippet.Fahrzeug(3,"B",true);
        //Ist eine public Instanz Variable, darum geht es
        expect(fahrzeug.anzahlRäder).to.be(3);
    });

    it('probiert eine private Variable abzugreifen', function() {
        var fahrzeug = new demo.snippet.Fahrzeug(3,"B",true);
        expect(fahrzeug.ölstand).to.be(undefined);
    });

    it('kann drei Fahrzeuge geben', function() {
        var fahrzeug = new demo.snippet.Fahrzeug(3,"B",true);
        var fahrzeug1 = new demo.snippet.Fahrzeug(3,"B",true);
        var fahrzeug2 = new demo.snippet.Fahrzeug(3,"B",true);
        expect(fahrzeug2).to.be.a(demo.snippet.Fahrzeug);
    });
    it('kann keine 4 Fahrzeuge geben', function() {
        var fahrzeug = new demo.snippet.Fahrzeug(3,"B",true);
        var fahrzeug1 = fahrzeug.gibMirEinNeuesFahrzeug();
        var fahrzeug2 = fahrzeug.gibMirEinNeuesFahrzeug();
        var fahrzeug3 = fahrzeug.gibMirEinNeuesFahrzeug();
        var test = function() {
            var fahrzeug4 = fahrzeug.gibMirEinNeuesFahrzeug();   
        }
        expect(test).to.throwError();
    });

    it('benutzt eine privileged Methode um den ölstand zu sehen', function() {
        var fahrzeug = new demo.snippet.Fahrzeug(3,"B",true);
        expect(fahrzeug.lassMichBitteDenÖlstandSehen()).to.be("nicht leer")
    });
});

describe('wie ich die Vererbung teste', function() {
    it('testet ob der Konstruktor der Basisklasse Fahrzeug bei der Erstellung eines Autos aufgerufen wird', function() {
        var auto = new demo.snippet.Auto('Grün', "Audi", 1000);
        expect(auto.anzahlRäder).to.be(4);
    });
    it('auto ist ein Fahrzeug', function() {
        var auto = new demo.snippet.Auto('Grün', "Audi", 1000);
        expect(auto).to.be.a(demo.snippet.Fahrzeug);
    });
    it('hat die Mehtode mein Treibstoff überschrieben', function() {
        var auto = new demo.snippet.Auto('Grün', "Audi", 1000);
        expect(auto.meinTreibstoff()).to.be('Benzin')
    });
    it('auto kann die Mehtode von Fahrzeug brauchen', function() {
        var auto = new demo.snippet.Auto('Grün', "Audi", 1000);
        expect(auto.ichFahrDavon()).to.be("Brumm!");
    });
    it('kann die eigenen Funktionen verwenden', function() {
        var auto = new demo.snippet.Auto('Grün', "Audi", 1000);
        expect(auto.scheibenwischer()).to.be('wisch meinen Audi');
    });
    it('akzeptiert nur einen Integer als Preis', function() {
        var test = function() {
            var auto = new demo.snippet.Auto('Grün', "Audi", '1000');
        }
        expect(test).to.throwError();
    });
    it('wird selbst bei Aufruf als Funktion zu einer Instanz', function() {
        var auto = demo.snippet.Auto('Grün', "Audi", 1000);
        expect(auto).not.to.be.a('function');
    });
});

describe('Eingebautes Klassenfeature aus ECMA6', function() {
    it('instantiiert eine Klasse', function() {
        const baum = new demo.snippet.classBased.returnBaum('tanne', true, 'Schweiz', '20m');
        expect(baum).to.be.a(demo.snippet.classBased.Pflanze);
    });
});

describe('Das gebaute Interface', function() {
    it('klappt mit der Instatntiirung wenn alle Methoden implementiert wurden', function() {
        var ubsKonto = new demo.snippet.interface2.UbsKonto(1000);
        expect(ubsKonto.einzahlen(100)).to.be(1100);
    });
    it('klappt mit der Instatntiirung nicht mehr wenn eine Methode vergessen wurde', function() {
        var test = function() {
             var cssKonto = new demo.snippet.interface2.CSSKonto(1000);
        }
        expect(test).to.throwError();
    });
});