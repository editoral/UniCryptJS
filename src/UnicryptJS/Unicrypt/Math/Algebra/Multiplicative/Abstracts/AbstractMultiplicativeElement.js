unicrypt.math.algebra.multiplicative.abstracts.AbstractMultiplicativeElement = Op.AbstractClass('AbstractMultiplicativeElement', {
	'generic': [
		'S', 'E', 'V'
	],
	'extends': {
		'class': unicrypt.math.algebra.general.abstracts.AbstractElement,
		'generic': [
			'S', 'E','V'
		]
	}
},{
	_init: function(semiGroup, value) {
		this.$$super(semiGroup, value);
	},
	multiply: function(element) {
		return this.getSet().multiply(this, element);
	}.paramType(['Element']).returnType('E'),
	power: function(amount) {
		return this.getSet().power(this, amount);
	}.paramType(['BigInteger']).returnType('E'),
	square: function() {
		return this.getSet().square(this);
	}.returnType('E'),
	divide: function(element) {
		if (this.getSet().isGroup()) {
			var group = this.getSet();
			return group.divide(this, element);
		}
		throw new Error('UnsupportedOperationException');
	}.paramType(['Element']).returnType('E'),
});