unicrypt.math.algebra.dualistic.classes.ZModElement  = Op.Class('ZModElement', {
	'extends': {
		'class' : unicrypt.math.algebra.dualistic.abstracts.AbstractDualisticElement,
		'generic': ['ZMod', 'ZModElement', 'BigInteger']
	}
},{
	init: function(zMod, value) {
		this.$$super(zMod, value);
	}.paramType(['ZMod', 'BigInteger']),
});