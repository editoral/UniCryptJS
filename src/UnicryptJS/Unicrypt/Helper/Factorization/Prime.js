unicrypt.helper.factorization.Prime = Op.Class('SpecialFactorization', {
	'extends': unicrypt.helper.factorization.SpecialFactorization
},{
	_orderFactor: null,
	_init: function(prime, orderFactor) {
		var primFac = [prime];
		var exp = [1];
		this.$$super(prime, primFac, exp);
		this._orderFactor = orderFactor;	
	}.paramType(['BigInteger','BigInteger']),
	func: function() {

	}.paramType(['E']).returnType(''),
	static: {
		getInstance: function(prime) {
			if (prime == null || !unicrypt.helper.math.MathUtil.isPrime(prime)) {
				throw new Error('IllegalArgumentException');
			}
			return new unicrypt.helper.factorization.Prime(prime, MathUtil.TWO);
		}.paramType('BigInteger').returnType()
	}
});