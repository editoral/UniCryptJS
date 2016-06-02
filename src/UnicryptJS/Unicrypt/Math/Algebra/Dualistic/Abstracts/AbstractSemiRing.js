unicrypt.math.algebra.dualistic.abstracts.AbstractSemiRing = Op.AbstractClass('AbstractSemiRing', {
	'generic': ['E', 'V'],
	'extends': {
		'class': unicrypt.math.algebra.additive.abstracts.AbstractAdditiveMonoid,
		'generic': ['E', 'V']
	}
},{
	_one:  null,
	_init: function(valueClass) {
		this.$$super(valueClass);
	},
	multiply: function(element1, element2) {
		if (!this.contains(element1) || !this.contains(element2)) {
			throw new Error('IllegalArgumentException');
		}
		return this._abstractMultiply(element1, element2);
	}.paramType(['Element', 'Element']).returnType('E'),
	power: function(element, amount) {
		if (!this.contains(element) || (amount == null)) {
			throw new Error('IllegalArgumentException');
		}
		return this._defaultPower(element, amount);
	}.paramType(['Element','BigInteger']).returnType('E'),
	square: function(element) {
		return this.multiply(element, element)
	}.paramType(['Element']).returnType('E'),
	getOneElement: function() {
		if (this._one == null) {
			this._one = this._abstractGetOne();
		}
		return this._one;
	}.returnType('E'),
	_defaultPower: function(element,amount) {
		if (amount.signum() < 0) {
			throw new Error('IllegalArgumentException');
		}
		if (amount.signum() == 0) {
			return this.getOneElement();
		}
		return this._defaultPowerAlgorithm(element, amount);
	}.paramType(['E','BigInteger']).returnType('E'),
	_defaultPowerAlgorithm: function(element,posAmount) {
		var result = element;
		for (var i = posAmount.bitLength() - 2; i >= 0; i--) {
			result = this._abstractMultiply(result, result);
			if (posAmount.testBit(i)) {
				result = this._abstractMultiply(result, element);
			}
		}
		return result;
	}.paramType(['E','BigInteger']).returnType('E'),

});