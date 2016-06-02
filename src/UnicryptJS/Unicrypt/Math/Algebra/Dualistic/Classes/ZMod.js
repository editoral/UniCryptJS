unicrypt.math.algebra.dualistic.classes.ZMod =  Op.Class('ZMod', {
	'extends': {
		'class' : unicrypt.math.algebra.dualistic.abstracts.AbstractCyclicRing,
		'generic' : ['ZModElement', 'BigInteger']
	}
},{
	_modulus: null,
	_init: function(modulus) {
		this.$$super(u.BigInteger);
		this._modulus = moduloFactorization;
	}.paramType(['BigInteger']),
	getModulus: function() {
		return this._modulus;
	}.returnType('BigInteger'),
	_defaultSelfApplyAlgorithm: function(element,posAmount) {
		return this._abstractGetElement(element.getValue().multiply(posAmount).mod(this._modulus));
	}.paramType(['ZModElement','BigInteger']).returnType('ZModElement'),
	_defaultPowerAlgorithm: function(element,posAmount) {
		return this._abstractGetElement(element.getValue().modPow(posAmount, this._modulus));
	}.paramType(['ZModElement','BigInteger']).returnType('ZModElement'),
	// _defaultToStringContent: function() {
	// 	return this.getModulus().toString() + "," + this.getOrder().toString();
	// }.returnType('string'),
	_abstractContains: function(value) {
		return value.signum() >= 0 && value.compareTo(this._modulus) < 0;
	}.paramType(['BigInteger']).returnType('boolean'),
	_abstractGetElement: function(value) {
		return new unicrypt.math.algebra.dualistic.classes.ZModElement(this, value);
	}.paramType(['BigInteger']).returnType('ZModElement'),
	_abstractGetIdentityElement: function() {
		return this._abstractGetElement(u.BigInteger.ONE);
	}.returnType('ZModElement'),
	_abstractApply: function(element1,element2) {
		return this._abstractGetElement(element1.getValue().add(element2.getValue()).mod(this._modulus));
	}.paramType(['ZModElement','ZModElement']).returnType('ZModElement'),
	_abstractInvert: function(element) {
		return this._abstractGetElement(this._modulus.subtract(element.getValue()).mod(this._modulus));
	}.paramType(['ZModElement']).returnType('ZModElement'),
	_abstractMultiply: function(element1,element2) {
		return this._abstractGetElement(element1.getValue().multiply(element2.getValue()).mod(this._modulus));
	}.paramType(['ZModElement','ZModElement']).returnType('ZModElement'),
	_abstractGetOne: function() {
		return this._abstractGetElement(BigInteger.ONE.mod(this._modulus));
	}.returnType('ZModElement'),
	_abstractGetOrder: function() {
		return this._modulus;
	}.returnType('BigInteger'),
	_abstractGetDefaultGenerator: function() {
		return this._abstractGetElement(BigInteger.ONE.mod(this._modulus));
	}.returnType('ZModElement'),	
	_abstractIsGenerator: function() {
		if (this._modulus.equals(BigInteger.ONE)) {
			return true;
		}
		return unicrypt.helper.math.MathUtil.areRelativelyPrime(element.getValue(), this._modulus);
	}.paramType(['ZModElement']).returnType('boolean'),
	_abstractEquals: function(set) {
		var zMod = set;
		return this._modulus.equals(zMod.getModulus());
	}.paramType(['Set']).returnType('boolean'),
	static: {
		getInstance: function(modulus) {
			if ((modulus == null) || (modulus.compareTo(u.BigInteger.valueOf(2)) < 0)) {
				throw new Error('IllegalArgumentException');
			}
			var instance =  new ZMod(modulus);
			return instance;
		}.paramType(['BigInteger']).returnType('ZMod')
	}
});