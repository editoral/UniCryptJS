unicrypt.math.algebra.multiplicative.classes.GStarMod =  Op.Class('GStarMod', {
	'extends': {
		'class': unicrypt.math.algebra.multiplicative.abstracts.AbstractMultiplicativeCyclicGroup,
		'generic': ['GStarModElement', 'BigInteger']
	}
},{
	_modulus: null,
	_moduloFactorization: null,
	_orderFactorization: null,
	_superGroup: null,
	_init: function(moduloFactorization, orderFactorization) {
		this.$$super(u.BigInteger);
		this._modulus = moduloFactorization.getValue();
		this._moduloFactorization = moduloFactorization;
		this._orderFactorization = orderFactorization;
	}.paramType(['SpecialFactorization', 'Factorization']),
	getModulus: function() {
		return this._modulus;
	}.returnType('BigInteger'),
	getModuloFactorization: function() {
		return this._moduloFactorization;
	}.returnType('SpecialFactorization'),
	getOrderFactorization: function() {
		return this._orderFactorization;		
	}.returnType('Factorization'),
	getZStarMod: function() {
		if (this._superGroup == null) {
			this._superGroup = ZStarMod.getInstance(this.getModuloFactorization());
		}
		return this._superGroup;
	}.returnType('ZStarMod'),
	contains: function(integerValue) {
		return this.contains(u.BigInteger.valueOf(integerValue));
	}.paramType(['long']).returnType('boolean'),
	getElement: function(integerValue) {
		return this.getElement(u.BigInteger.valueOf(integerValue));
	}.paramType(['long']).returnType('GStarModElement'),
	getCoFactor: function() {
		return this.getZStarMod().getOrder().divide(this.getOrder());
	}.returnType('BigInteger'),
	_defaultSelfApplyAlgorithm: function(element,posAmount) {
		return this.abstractGetElement(element.getValue().modPow(posAmount, this._modulus));
	}.paramType(['GStarModElement','BigInteger']).returnType('GStarModElement'),
	_defaultToStringContent: function() {
		return this.getModulus().toString() + "," + this.getOrder().toString();
	}.returnType('string'),
	_abstractContains: function(value) {
		return value.signum() > 0
			   && value.compareTo(this._modulus) < 0
			   && MathUtil.areRelativelyPrime(value, this._modulus)
			   && value.modPow(this.getOrder(), this._modulus).equals(u.BigInteger.ONE);
	}.paramType(['BigInteger']).returnType('boolean'),
	_abstractGetElement: function(value) {
		return new GStarModElement(this, value);
	}.paramType(['BigInteger']).returnType('GStarModElement'),
	// _abstractGetBigIntegerConverter: function() {
	// 	return BigIntegerToBigInteger.getInstance(0);
	// }.returnType('Converter'),
	_abstractGetRandomElement: function(randomByteSequence) {
		var randomElement = this.getZStarMod().getRandomElement(randomByteSequence);
		return this.getElement(randomElement.power(this.getCoFactor()).convertToBigInteger());
	}.paramType(['RandomByteSequence']).returnType('GStarModElement'),
	_abstractGetOrder: function() {
		return this.getOrderFactorization().getValue();
	}.returnType('BigInteger'),
	_abstractGetIdentityElement: function() {
		return this._abstractGetElement(u.BigInteger.ONE);
	}.returnType('GStarModElement'),
	_abstractApply: function(element1,element2) {
		return this._abstractGetElement(element1.getValue().multiply(element2.getValue()).mod(this._modulus));
	}.paramType(['GStarModElement','GStarModElement']).returnType('GStarModElement'),
	_abstractInvert: function(element) {
		return this._abstractGetElement(element.getValue().modInverse(this._modulus));
	}.paramType(['GStarModElement']).returnType('GStarModElement'),
	_abstractGetDefaultGenerator: function() {
		var alpha = u.BigInteger.ZERO;
		var element;
		do {
			do {
				alpha = alpha.add(u.BigInteger.ONE);
			} while (!MathUtil.areRelativelyPrime(alpha, this.getModulus()));
			element = this.abstractGetElement(alpha.modPow(this.getCoFactor(), this._modulus));
		} while (!this.isGenerator(element)); // this test could be skipped for a prime order
		return element;
	}.returnType('GStarModElement'),
	_abstractIsGenerator: function(element) {
		for (var prime in this.getOrderFactorization().getPrimeFactors()) {
			if (element.selfApply(this.getOrder().divide(prime)).isEquivalent(this.getIdentityElement())) {
				return false;
			}
		}
		return true;
	}.paramType(['GStarModElement']).returnType('boolean'),
	_abstractEquals: function(set) {
		var other = set;
		return this.getModulus().equals(other.getModulus()) && this.getOrder().equals(other.getOrder());
	}.paramType(['Set']).returnType('boolean'),
	_abstractHashCode: function() {
		var hash = 7;
		hash = 47 * hash + this.getModulus().hashCode();
		hash = 47 * hash + this.getOrder().hashCode();
		return hash;
	}.returnType('int'),
	static: {
		getInstance: function(moduloFactorization, orderFactorization) {
			var group = new GStarMod(moduloFactorization, orderFactorization);
			if (!group.getOrder().mod(orderFactorization.getValue()).equals(u.BigInteger.ZERO)) {
				throw new Error('IllegalArgumentException');
			}
			return group;
		}.paramType(['SpecialFactorization','Factorization']).returnType('GStarMod')
	}
});