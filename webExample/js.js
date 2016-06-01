$(function() {

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
});