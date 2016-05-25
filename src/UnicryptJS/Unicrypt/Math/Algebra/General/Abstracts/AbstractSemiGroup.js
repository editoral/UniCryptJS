unicrypt.math.algebra.general.abstracts.AbstractSemiGroup = Op.AbstractClass('AbstractSemiGroup', {
	'generic': [
		'E', 'V'
	],
	'extends': {
		'class': unicrypt.math.algebra.general.abstracts.AbstractSet,
		'generic': [
			'E','V'
		]
	}
},{
	_init: function(valueClass) {
		this.$$super(valueClass);
	},
	apply: function(element1, element2) {
		if (!this.contains(element1.getValue()) || !this.contains(element2.getValue())) {
			throw new Error('IllegalArgumentException');
		}
		return this._abstractApply(element1, element2);
	}.paramType(['Element', 'Element']),
	selfApply1: function(element, amount) {
		if (!this.contains(element) || amount == null) {
			throw new Error('IllegalArgumentException');
		}
		return this._defaultSelfApply(element, amount);		
	}.paramType(['Element','BigInteger']).returnType('E'),
	selfApply2: function(element) {
		return this.apply(element, element);
	}.paramType(['Element']).returnType('E'),
	_defaultSelfApplyAlgorithm: function(element, posAmount) {
		var result = element;
		for (var i = posAmount.bitLength() - 2; i >= 0; i--) {
			result = this._abstractApply(result, result);
			if (posAmount.testBit(i)) {
				result = this._abstractApply(result, element);
			}
		}
		return result;		
	}.paramType(['E', 'BigInteger']).returnType('E'),
	_defaultSelfApply: function(element,amount) {
		if (amount.signum() <= 0) {
			throw new Error('IllegalArgumentException');
		}
		return this._defaultSelfApplyAlgorithm(element, amount);
	}.paramType(['E', 'BigInteger']).returnType('E'),

});