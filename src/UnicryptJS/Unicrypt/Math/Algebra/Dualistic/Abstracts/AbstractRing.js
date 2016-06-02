unicrypt.math.algebra.dualistic.abstracts.AbstractRing = Op.AbstractClass('AbstractRing', {
	'generic': [
		'E', 'V'
	],
	'extends': {
		'class': unicrypt.math.algebra.dualistic.abstracts.AbstractSemiRing,
		'generic': [
			'E','V'
		]
	}
},{
	_init: function(valueClass) {
		this.$$super(valueClass);
	},
	invert: function(element) {
		if (!this.contains(element)) {
			throw new Error('IllegalArgumentException');
		}
		return this._abstractInvert(element);		
	}.paramType(['Element']).returnType('E'),
	applyInverse: function(element1, element2) {
		return this.apply(element1, this.invert(element2));
	}.paramType(['Element', 'Element']).returnType('E'),	
	subtract: function(element1, element2) {
		return this.applyInverse(element1, element2)
	}.paramType(['Element', 'Element']).returnType('E'),
	negate: function(element) {
		return this.invert(element);
	}.paramType(['Element']).returnType('E'),
	_defaultSelfApply: function(element,amount) {
		var negAmount = (amount.signum() < 0);
		amount = amount.abs();
		if (this.isFinite() && this.hasKnownOrder()) {
			amount = amount.mod(this.getOrder());
		}
		if (amount.signum() == 0) {
			return this.getIdentityElement();
		}
		var result = this._defaultSelfApplyAlgorithm(element, amount);
		if (negAmount) {
			return this.invert(result);
		}
		return result;
	}.paramType(['E', 'BigInteger']).returnType('E'),

});