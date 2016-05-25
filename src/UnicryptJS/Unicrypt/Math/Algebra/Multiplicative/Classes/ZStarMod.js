unicrypt.math.algebra.multiplicative.classes.ZStarMod = Op.Class('ZStarMod', {
	'extends': {
		'class' : unicrypt.math.algebra.multiplicative.abstracts.AbstractMultiplicativeGroup,
		'generic': ['ZStarModElement', 'BigInteger']
	}
},{
	_modulus: null,
	_modulusFactorization: null,
	_init: function(modulus, modulusFactorization) {
		this.$$super(u.BigInteger);
		this._modulus = modulus;
		this._modulusFactorization = modulusFactorization;
	}.paramType(['BigInteger', 'BigInteger']),
	getModuloFactorization: function() {
		return this._moduloFactorization;
	}.returnType('BigInteger'),
	getModulus: function() {
		return this._modulus;
	}.returnType('BigInteger'),
	_abstractContains: function(value) {
		return value.signum() > 0
			   && value.compareTo(this._modulus) < 0
			   && unicrypt.helper.math.MathUtil.areRelativelyPrime(value, this._modulus)
	}.paramType(['BigInteger']).returnType('boolean'),
	_abstractGetElement: function(value) {
		return new unicrypt.math.algebra.multiplicative.classes.ZStarModElement(this, value);
	}.paramType(['BigInteger']).returnType('ZStarModElement'),
	// _abstractGetOrder: function() {
	// 	return this.getOrderFactorization();
	// }.returnType('BigInteger'),
	_abstractApply: function(element1,element2) {
		return this._abstractGetElement(element1.getValue().multiply(element2.getValue()).mod(this._modulus));
	}.paramType(['ZStarModElement','ZStarModElement']).returnType('ZStarModElement'),
	_abstractInvert: function(element) {
		return this._abstractGetElement(element.getValue().modInverse(this._modulus));
	}.paramType(['ZStarModElement']).returnType('ZStarModElement'),
	static: {
		
	}
});