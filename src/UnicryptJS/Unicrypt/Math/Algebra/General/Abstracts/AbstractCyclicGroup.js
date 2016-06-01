unicrypt.math.algebra.general.abstracts.AbstractCyclicGroup = Op.AbstractClass('AbstractCyclicGroup', {
	'generic': ['E', 'V'],
	'extends': {
		'class': unicrypt.math.algebra.general.abstracts.AbstractGroup,
		'generic': ['E', 'V']
	}
},{
	_defaultGenerator: null,
	_generatorLists: {},
	_init: function(valueClass) {
		this.$$super(valueClass)	
	},
	getDefaultGenerator: function() {
		if (this.defaultGenerator == null) {
			this.defaultGenerator = this._abstractGetDefaultGenerator();
		}
		return this.defaultGenerator;
	}.returnType('E'),
	isGenerator: function(element) {
		if (!this.contains(element)) {
			throw new Error('IllegalArgumentException');
		}
		return this._abstractIsGenerator(element);
	}.paramType(['Element']).returnType('boolean'),
});