unicrypt.math.algebra.dualistic.abstracts.AbstractDualisticElement = Op.AbstractClass('AbstractDualisticElement', {
	'generic': ['S', 'E', 'V'],
	'extends': {
		'class': unicrypt.math.algebra.additive.abstracts.AbstractAdditiveElement,
		'generic': ['S', 'E', 'V']
	}
},{
	_init: function(ring, value) {
		this.$$super(ring, value);
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
		if (this.getSet().isField()) {
			var field = this.getSet();
			return field.divide(this, element);
		}
		throw new Error('UnsupportedOperationException');
	}.paramType(['Element']).returnType('E'),
});