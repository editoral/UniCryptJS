unicrypt.math.algebra.general.abstracts.AbstractSet = Op.AbstractClass('AbstractSet', {
	'extends': unicrypt.UniCrypt,
	//'implements': [unicrypt.math.algebra.general.interfaces.Set],
	'generic': [
		'E', 'V'
	]
}, {
	_valueClass: null,
	_order:null,
	_lowerBound:null,
	_upperBound:null,
	_minimum: null,
	_bigIntegerConverter: null,
	_stringConverter: null,
	_byteArrayConverter: null,
	INFINITE: BigInteger.valueOf(-1),
	UNKNOWN: BigInteger.valueOf(-2),
	init: function(valueClass) {
		this._valueClass = valueClass;
	},
	isSemiGroup: function() {
		 return this instanceof SemiGroup;
	}.returnType('boolean'),
	isMonoid: function() {
		 return this instanceof Monoid;
	}.returnType('boolean'),
	isGroup: function() {
		 return this instanceof Group;
	}.returnType('boolean'),
	isSemiRing: function() {
		 return this instanceof SemiRing;
	}.returnType('boolean'),
	isRing: function() {
		 return this instanceof Ring;
	}.returnType('boolean'),
	isField: function() {
		 return this instanceof Field;
	}.returnType('boolean'),
	isCyclic: function() {
		 return this instanceof CyclicGroup;
	}.returnType('boolean'),
	isAdditive: function() {
		 return this instanceof AdditiveSemiGroup;
	}.returnType('boolean'),
	isMultiplicative: function() {
		 return this instanceof MultiplicativeSemiGroup;
	}.returnType('boolean'),
	isConcatenative: function() {
		 return this instanceof ConcatenativeSemiGroup;
	}.returnType('boolean'),
	isProduct: function() {
		 return this instanceof ProductSet;
	}.returnType('boolean'),
	isFinite: function() {
		
	}.returnType('boolean'),
});