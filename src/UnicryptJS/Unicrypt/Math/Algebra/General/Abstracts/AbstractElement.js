unicrypt.math.algebra.general.abstracts.AbstractElement = Op.AbstractClass('Element', {
	'generic': ['S', 'E', 'V'],
	'extends': unicrypt.UniCrypt
},{
	set: null,
	value: null,
	_init: function(set, value) {
		this.set = set;
		this.value = value;
	},
	getSet: function() {
		return this.set;
	},
	getValue: function() {
		return this.value;
	},
	apply: function(element) {
		if (this.set.isSemiGroup()) {
			var semiGroup = this.set;
			return semiGroup.apply(this, element);
		} else {
			throw new Error('UnsupportedOperationException');
		}
	}.paramType(['Element']).returnType('E'),
	applyInverse: function(amount) {
		if (this.set.isSemiGroup()) {
			var semiGroup = this.set;
			return semiGroup.selfApply(this, amount);
		} else {
			throw new Error('UnsupportedOperationException');
		}
	}.paramType(['BigInteger']).returnType('E'),
	selfApply: function(amount) {
		if (this.set.isSemiGroup()) {
			var semiGroup = this.set;
			return semiGroup.selfApply(this, amount);
		} else {
			throw new Error('UnsupportedOperationException');
		}
	}.paramType(['BigInteger']).returnType('E'),
	isGenerator: function() {
		if (this.set.isCyclic()) {
			var cyclicGroup = this.set;
			return cyclicGroup.isGenerator(this);
		} else {
			throw new Error('UnsupportedOperationException');
		}		
	}.returnType('boolean')

});