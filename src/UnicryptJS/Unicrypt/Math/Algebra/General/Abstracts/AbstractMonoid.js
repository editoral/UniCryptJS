unicrypt.math.algebra.general.abstracts.AbstractMonoid = Op.AbstractClass('AbstractMonoid', {
	'generic': ['E', 'V'],
	'extends': {
		'class': unicrypt.math.algebra.general.abstracts.AbstractSemiGroup,
		'generic': ['E','V']
	}
},{
	_init: function(valueClass) {
		this.$$super(valueClass);
	},	
});