unicrypt.math.algebra.additive.abstracts.AbstractAdditiveElement = Op.AbstractClass('AbstractAdditiveElement', {
	'generic': ['S', 'E', 'V'],
	'extends': {
		'class': unicrypt.math.algebra.general.abstracts.AbstractElement,
		'generic': ['S', 'E', 'V']
	}
},{
	_init: function(semiGroup, value) {
		this.$$super(semiGroup, value);
	},
	add: function(element) {
		return this.getSet().add(this, element);
	}.paramType(['Element']).returnType('E'),
	subtract: function(element) {
		if (this.getSet().isGroup()) {
			var group = this.getSet();
			return group.subtract(this, element);
		}
		throw new Error('UnsupportedOperationException');
	}.paramType(['Element']).returnType('E'),
	times: function(amount) {
		return this.getSet().times(this, amount);
	}.paramType(['BigInteger']).returnType('E'),
	timesTwo: function() {
		return this.getSet().timesTwo(this);
	}.returnType('E'),
	negate: function() {
		if (this.getSet().isGroup()) {
			var group = this.getSet();
			return group.invert(this);
		}
		throw new Error('UnsupportedOperationException');		
	}.returnType('E'),
	isZero: function() {
		if (this.getSet().isMonoid()) {
			var monoid = this.getSet();
			return monoid.isZeroElement(this);
		}
		throw new Error('UnsupportedOperationException');		
	}.returnType('boolean')

});