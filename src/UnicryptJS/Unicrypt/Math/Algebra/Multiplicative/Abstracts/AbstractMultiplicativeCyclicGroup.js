unicrypt.math.algebra.multiplicative.abstracts.AbstractMultiplicativeCyclicGroup = Op.AbstractClass('AbstractMultiplicativeCyclicGroup', {
	'generic': [
		'E', 'V'
	],
	'extends': {
		'class': unicrypt.math.algebra.general.abstracts.AbstractCyclicGroup,
		'generic': [
			'E','V'
		]
	}
},{
	_init: function(valueClass) {
		this.$$super(valueClass);
	},
	multiply: function(element1, element2) {
		return this.apply(element1, element2);
	}.paramType(['Element', 'Element']).returnType('E'),
	// multiply2: function() {

	// }.paramType(['']).returnType(''),
	// multiply3: function() {

	// }.paramType(['']).returnType(''),
	power: function(element, amount) {
		return this.selfApply(element, amount);
	}.paramType(['Element','BigInteger']).returnType('E'),
	// power2: function(element, amount) {
	// 	return this.selfApply(element, amount);
	// }.paramType(['Element', 'long']).returnType('E'),
	// power3: function() {

	// }.paramType(['']).returnType(''),
	square: function(element) {
		return this.selfApply(element);
	}.paramType(['Element']).returnType('E'),
	// productOfPowers: function(elements, amounts) {
	// 	return this.multiSelfApply(elements, amounts);
	// }.returnType('E'),
	divide: function(element1, element2) {
		return this.applyInverse(element1, element2);
	}.paramType(['Element', 'Element']).returnType('E'),
	// oneOver: function(element) {
	// 	return this.invert(element);
	// }.paramType(['Element']).returnType('E'),
	// getOneElement: function() {
	// 	return this.getIdentityElement();
	// }.returnType('E'),
	// isOneElement: function(element) {
	// 	return this.isIdentityElement(element);
	// }.paramType(['Element']).returnType('boolean')

});