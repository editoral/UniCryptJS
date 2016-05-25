unicrypt.math.algebra.multiplicative.classes.GStarModElement = Op.Class('GStarModElement', {
	'extends': {
		'class' : unicrypt.math.algebra.multiplicative.abstracts.AbstractMultiplicativeElement,
		'generic': ['GStarMod', 'GStarModElement', 'BigInteger']
	}
},{
	init: function(gStarMod, value) {
		this.$$super(gStarMod, value);
	}.paramType(['GStarMod', 'BigInteger']),
});

// {
// 	'extends': {
// 		'class' : unicrypt.math.algebra.multiplicative.abstracts.AbstractMultiplicativeElement,
// 		'generic': ['GStarMod', 'GStarModElement', 'BigInteger']
// 	}
// }