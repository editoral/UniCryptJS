$(function() {

// KeyGen
$('.parameters .eval').click(function() {
	var x = $('.parameters .secret').val();
	var g = $('.parameters .generator1').val();
	var mod = $('.parameters .modulo').val();
	if(g === '' || mod === '' || x === '') {
		alert('Insert Values');
	}
	mod = new u.BigInteger(mod);
	var gStarMod = unicrypt.math.algebra.multiplicative.classes.GStarModSafePrime.getInstance(mod);
	g = new u.BigInteger(g);
	x = new u.BigInteger(x);
	g = gStarMod.getElement(g);
	var y = g.selfApply(x);
	$('.parameters .publicKey').val(y.getValue().toString());
});
// ElGamal encryption
	//window.x = null;
	//window.y = null;
	$('.elGamal .enc').click(function() {
		var m = $('.elGamal .message').val();
		var r = $('.elGamal .r').val();
		var g = $('.parameters .generator1').val();
		var y = $('.parameters .publicKey').val();
		var mod = $('.parameters .modulo').val();
		if(m === '' || r === '' || g === '' || y === '' || mod === '') {
			alert('Insert Values');
		}
		
		//m = Helper.convertStrToBinary(m);
		//m = '1' + m;
		m = new u.BigInteger(m);
		r = new u.BigInteger(r);
		g = new u.BigInteger(g);
		var p = new u.BigInteger(mod);
		var q = new u.BigInteger(p.subtract(new u.BigInteger(1)).divide(new u.BigInteger(2)));
		y = new u.BigInteger(y);

		var gStarMod = unicrypt.math.algebra.multiplicative.classes.GStarModSafePrime.getInstance(p);
		g = gStarMod.getElement(g);
		y = gStarMod.getElement(y);
		

		m = Helper.mapZq2Gq(m, q, p);
		m = gStarMod.getElement(m);
		var a = g.selfApply(r);
		var b = y.selfApply(r).apply(m);
		//g.selfApply(r).apply(g2.selfApply(m));

		var tuple = new Tuple(a, b);
		//window.x = x;
		//window.y = y;
		$('.elGamal .result').val(tuple.print());
	});	

	$('.elGamaldec .dec').click(function() {
		var x = $('.parameters .secret').val();
		var enc = $('.elGamaldec .cypher').val();
		var mod = $('.parameters .modulo').val();
		mod = new u.BigInteger(mod);
		x = new u.BigInteger(x);
		var tuple = new Tuple();
		tuple.load(enc, mod);
		var a = tuple.a;
		var b = tuple.b;

		var m = b.divide(a.selfApply(x));
		var m = m.getValue().subtract(new u.BigInteger(1));

		var m = Helper.convertBinaryToString(m);

		$('.elGamaldec .decrypted').val(m.toString());
	});
// Pederson Commitment
$('.pederson .eval').click(function() {
	var m = $('.pederson .message').val();
	var r = $('.pederson .r').val();
	var g = $('.pederson .generator1').val();
	var g2 = $('.pederson .generator2').val();
	var mod = $('.pederson .mod').val();
	if(m === '' || r === '' || g === '' || g2 === '') {
		alert('Insert Values');
	}

	m = new u.BigInteger(m);
	r = new u.BigInteger(r);
	g = new u.BigInteger(g);
	g2 = new u.BigInteger(g2);
	mod = new u.BigInteger(mod);

	var gStarMod = unicrypt.math.algebra.multiplicative.classes.GStarModSafePrime.getInstance(mod);
	g = gStarMod.getElement(g);
	g2 = gStarMod.getElement(g2);

	var p = g.selfApply(r).apply(g2.selfApply(m));
	$('.pederson .result').val(p.getValue().intValue());
});
$('.pederson .decommit').click(function() {
	var m = $('.pederson .message').val();
	var r = $('.pederson .r').val();
	var g = $('.pederson .generator1').val();
	var g2 = $('.pederson .generator2').val();
	var mod = $('.pederson .mod').val();
	var c = $('.pederson .result').val();
	if(m === '' || r === '' || g === '' || g2 === '') {
		alert('Insert Values');
	}

	m = new u.BigInteger(m);
	r = new u.BigInteger(r);
	g = new u.BigInteger(g);
	g2 = new u.BigInteger(g2);
	mod = new u.BigInteger(mod);
	c = new u.BigInteger(c);

	var gStarMod = unicrypt.math.algebra.multiplicative.classes.GStarModSafePrime.getInstance(mod);
	g = gStarMod.getElement(g);
	g2 = gStarMod.getElement(g2);

	var p = g.selfApply(r).apply(g2.selfApply(m));
	var boolVal = false;
	if(p.getValue().intValue() === c.intValue()) {
		boolVal = true;
	}
	$('.pederson .commitResult').val(boolVal);
});
// GStar get Elements
$('.getElements .eval').click(function() {
	var mod = $('.getElements .modulo').val();
	
	if(mod === '') {
		alert('Insert Values');
	}

	mod = new u.BigInteger(mod);

	var gStarMod = unicrypt.math.algebra.multiplicative.classes.GStarModSafePrime.getInstance(mod);
	var result = '';
	for(var i = 0; i < mod.intValue(); i++) {
		try {
			var el = gStarMod.getElement(new u.BigInteger(i));
			result = result + el.getValue().intValue() +'; ';
		} catch (err) {

		}
	}

	$('.getElements .result').val(result);
});

var Tuple = Op.Class('Tuple', {}, {
	a: null,
	b: null,
	init: function(a, b) {
		this.a = a;
		this.b = b;
	},
	print: function() {
		return '(' + this.a.getValue() + '/' + this.b.getValue() + ')';
	},
	load: function(val, mod) {
		var splited = val.substring(1, val.length-1);
		splited = splited.split('/');
		var gStarMod = unicrypt.math.algebra.multiplicative.classes.GStarModSafePrime.getInstance(mod);
		this.a = gStarMod.getElement(new u.BigInteger(splited[0]));
		this.b = gStarMod.getElement(new u.BigInteger(splited[1]));
	}
});

var Helper = Op.Class('Helper', {}, {
	static: {
		mapZq2Gq: function(bigIntInZq, q, p) {
			var one = new u.BigInteger(1);
			var t1 = bigIntInZq.add(one);
			var t2 = t1.modPow(q, p);
			if(t2.equals(one)) {
				return t1;
			} else {
				return p.subtract(t1);
			}

		}.paramType(['BigInteger', 'BigInteger', 'BigInteger']).returnType('BigInteger'),
		convertStrToBinary: function(str) {
			var st,i,j,d;
			var arr = [];
			var len = str.length;
			for (i = 1; i<=len; i++){
                //reverse so its like a stack
                d = str.charCodeAt(len-i);
                for (j = 0; j < 8; j++) {
                	arr.push(d%2);
                	d = Math.floor(d/2);
                }
            }
        	//reverse all bits again.
        	return arr.reverse().join("");	
    	},
    	convertBinaryToString: function(str) {

    	}
}
});

});

//Message => Text ASCII
//Werte vorbereiten -> grosse Safeprime aus UniCrypt 
//Webseite: Settings (generator, Modulo)
// 			KeyGen (Pulbic, Secret)
//			ElGamal Encript Decript
//			Commit

// Präsentation: Demo mit Text
// Code Beispiel: Gleich Java wie JavaScript

/*
		 * Represents a bigInt for Zq in Gq
		 *                 -
		 *                / m' + 1      if (m'+1)^q = 1
		 *   m = G(m') = <
		 *                \ p - (m'+1)  otherwise
		 *                 -
		 * @param bigIntInZq - The bigInt in Zq (m')
		 * @return The bigInt in Gq (m)
		 */