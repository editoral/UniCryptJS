 unicrypt.math.algebra.multiplicative.classes.GStarModElement = Op.Class('GStarModElement', {
	'generic': [
		'E'
	],
	'extends': {
		'class' : ,
		'generic': [
			'T', 'string'
		]
	}
},{
	init: function(gStarMod, value) {
		this.$$super(gStarMod, value);
	}.paramType(['GStarMod', 'BigInteger']),
});