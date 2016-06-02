unicrypt.math.algebra.additive.abstracts.AbstractAdditiveMonoid = Op.AbstractClass('AbstractAdditiveMonoid', {
	'generic': ['E', 'V'],
	'extends': {
		'class': unicrypt.math.algebra.general.abstracts.AbstractMonoid,
		'generic': ['E','V']
	}
},{
	_init: function(valueClass) {
		this.$$super(valueClass);
	},
	add: function(element1, element2) {
		return this.apply(element1, element2);
	}.paramType(['Element','Element']).returnType('E'),
	times: function(element, amount) {
		return this.selfApply(element, amount);
	}.paramType(['Element','BigInteger']).returnType('E'),
	timesTwo: function(element) {
		return this.selfApply(element);
	}.paramType(['Element']).returnType('E'),
	getZeroElement: function() {
		return this.getIdentityElement();
	}.returnType('E'),
});