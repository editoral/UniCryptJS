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
		return !this.getOrder().equals(Set.INFINITE);
	}.returnType('boolean'),
	hasKnownOrder: function() {
		return !this.getOrder().equals(Set.UNKNOWN);
	}.returnType('boolean'),
	getOrder: function() {
		if (this.order == null) {
			this.order = this.abstractGetOrder();
		}
		return this.order;
	}.returnType('BigInteger'),
	getOrderLowerBound: function() {
		if (this._lowerBound == null) {
			if (this.hasKnownOrder()) {
				this._lowerBound = this.getOrder();
			} else {
				this._lowerBound = this.defaultGetOrderLowerBound();
			}
		}
		return this._lowerBound;
	}.returnType('BigInteger'),
	getOrderUpperBound: function() {
		if (this._upperBound == null) {
			if (this.hasKnownOrder()) {
				this._upperBound = this.getOrder();
			} else {
				this._upperBound = this.defaultGetOrderUpperBound();
			}
		}
		return this._upperBound;
	}.returnType('BigInteger'),
	getMinimalOrder: function() {
		if (this._minimum == null) {
			this._minimum = this.defaultGetMinimalOrder();
		}
		return this._minimum;
	}.returnType('BigInteger'),
	isSingleton: function() {
		return this.getOrder().equals(BigInteger.ONE);
	}.returnType(''),
	getZModOrder: function() {
		if (!(this.isFinite() && this.hasKnownOrder())) {
			throw new Error('UnsupportedOperationException');
		}
		return ZMod.getInstance(this.getOrder());
	}.returnType('ZMod'),
	getZStarModOrder: function() {
		if (!(this.isFinite() && this.hasKnownOrder())) {
			throw new Error('UnsupportedOperationException');
		}
		return ZStarMod.getInstance(this.getOrder());
	}.returnType('ZStarMod'),
	getElement: function(value) {
		if (!this.contains(value)) {
			throw new Error('IllegalArgumentException');
		}
		return this.abstractGetElement(value);
	}.paramType(['V']).returnType('E'),
	contains1: function(value) {
		if (value == null) {
			throw new Error('IllegalArgumentException');
		}
		return this.abstractContains(value);
	}.paramType(['V']).returnType('boolean'),
	contains2: function(element) {
		if (element == null) {
			throw new Error('IllegalArgumentException');
		}
		if (!this.valueClass.isInstance(element.getValue())) {
			return false;
		}
		return this.defaultContains(element);
	}.paramType(['Element']).returnType('boolean'),
	getRandomElement1: function() {
		return this.abstractGetRandomElement(HybridRandomByteSequence.getInstance());
	}.returnType('E'),
	getRandomElement2: function(randomByteSequence) {
		if (randomByteSequence == null) {
			throw new Error('IllegalArgumentException');
		}
		return this.abstractGetRandomElement(randomByteSequence);
	}.paramType(['RandomByteSequence']).returnType('E'),
	getRandomElements1: function() {
		return this.getRandomElements(HybridRandomByteSequence.getInstance());
	}.returnType('Sequence'),
	getRandomElements2: function(n) {
		if (n < 0) {
			throw new Error('IllegalArgumentException');
		}
		return this.getRandomElements().limit(n);
	}.paramType(['long']).returnType('Sequence'),
	// getRandomElements3: function(randomByteSequence) {
	// 	if (randomByteSequence == null) {
	// 		throw new Error('IllegalArgumentException');
	// 	}
	// 	return new Sequence([E]) {

	// 		@Override
	// 		public ExtendedIterator<E> iterator() {
	// 			return new ExtendedIterator<E>() {

	// 				@Override
	// 				public boolean hasNext() {
	// 					return true;
	// 				}

	// 				@Override
	// 				public E next() {
	// 					return abstractGetRandomElement(randomByteSequence);
	// 				}
	// 			};
	// 		}
	// 	};
	// }.paramType(['RandomByteSequence']).returnType('Sequence'),
	getRandomElements4: function(n) {
		if (n < 0) {
			throw new Error('IllegalArgumentException');
		}
		return this.getRandomElements().limit(n);
	}.paramType(['long']).returnType('Sequence'),
	getRandomElements5: function(n) {
		if (n < 0) {
			throw new Error('IllegalArgumentException');
		}
		return this.getRandomElements().limit(n);
	}.paramType(['long']).returnType('Sequence'),

	func: function() {

	}.paramType(['']).returnType(''),
	func: function() {

	}.paramType(['']).returnType(''),
	func: function() {

	}.paramType(['']).returnType(''),
	func: function() {

	}.paramType(['']).returnType(''),
});