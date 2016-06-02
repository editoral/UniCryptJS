unicrypt.math.algebra.dualistic.abstracts.AbstractCyclicRing = Op.AbstractClass('AbstractCyclicRing', {
	'generic': ['E', 'V'],
	'extends': {
		'class': unicrypt.math.algebra.dualistic.abstracts.AbstractRing,
		'generic': ['E', 'V']
	}
},{
	_defaultGenerator: null,
	_init: function(valueClass) {
		this.$$super(valueClass)	
	},
	getDefaultGenerator: function() {
		if (this._defaultGenerator == null) {
			this._defaultGenerator = this._abstractGetDefaultGenerator();
		}
		return this._defaultGenerator;
	}.returnType('E'),
	isGenerator: function(element) {
		if (!this.contains(element)) {
			throw new Error('IllegalArgumentException');
		}
		return this._abstractIsGenerator(element);
	}.paramType(['Element']).returnType('boolean'),

});