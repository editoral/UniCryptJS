$(function() {
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
// ElGamal encryption
	window.tuple = null;
	//window.x = null;
	//window.y = null;
	$('.elGamal .enc').click(function() {
		var m = $('.elGamal .message').val();
		var r = $('.elGamal .r').val();
		var g = $('.elGamal .generator').val();
		var x = $('.elGamal .secret').val();
		var mod = $('.elGamal .mod').val();
		if(m === '' || r === '' || g === '' || y === '') {
			alert('Insert Values');
		}
		
		m = new u.BigInteger(m);
		r = new u.BigInteger(r);
		g = new u.BigInteger(g);
		x = new u.BigInteger(x);
		mod = new u.BigInteger(mod);

		var gStarMod = unicrypt.math.algebra.multiplicative.classes.GStarModSafePrime.getInstance(mod);
		g = gStarMod.getElement(g);
		//x = gStarMod.getElement(x);
		m = gStarMod.getElement(m);

		var y = g.selfApply(x);
		var a = g.selfApply(r);
		var b = y.selfApply(r).apply(m);
		//g.selfApply(r).apply(g2.selfApply(m));

		window.tuple = new Tuple(a, b);
		//window.x = x;
		//window.y = y;
		$('.elGamal .result').val(window.tuple.print());
	});	
	$('.elGamal .dec').click(function() {
		var x = $('.elGamal .secret').val();
		var enc = $('.elGamal .result').val();
		var mod = $('.elGamal .mod').val();
		mod = new u.BigInteger(mod);
		x = new u.BigInteger(x);
		window.tuple.load(enc, mod);
		var a = window.tuple.a;
		var b = window.tuple.b;

		var m = b.divide(a.selfApply(x));

		$('.elGamal .decrypted').val(m.getValue().intValue());
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
			return this.a.getValue().intValue() + ' : ' + this.b.getValue().intValue();
		},
		load: function(val, mod) {
			var splited = val.split(' : ');
			var gStarMod = unicrypt.math.algebra.multiplicative.classes.GStarModSafePrime.getInstance(mod);
			this.a = gStarMod.getElement(new u.BigInteger(splited[0]));
			this.b = gStarMod.getElement(new u.BigInteger(splited[1]));
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