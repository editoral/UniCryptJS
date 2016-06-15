unicrypt.math.algebra.multiplicative.classes.GStarModPrime = Op.Class('GStarModPrime', {
	'extends': unicrypt.math.algebra.multiplicative.classes.GStarMod
},{
	_init: function(modulus, orderFactor) {	
		this.$$super(modulus, orderFactor);
	}.paramType(['BigInteger','BigInteger']),
	getZModOrder: function() {
		return ZModPrime.getInstance(this.getOrder());
	}.returnType('ZModPrime'),
	static: {
		// getInstance: function(modulus, orderFactor) {
		// 	if (modulus == null || orderFactor == null) {
		// 		throw new Error('IllegalArgumentException');
		// 	}
		// 	if (!modulus.getValue().subtract(BigInteger.ONE).mod(orderFactor.getValue()).equals(BigInteger.ZERO)) {
		// 		throw new Error('IllegalArgumentException');
		// 	}
		// 	var instance = this._static_.instances.get(modulus, orderFactor);
		// 	if (instance == null) {
		// 		instance = new GStarModPrime(modulus, orderFactor);
		// 		this._static_.instances.put(modulus, orderFactor, instance);
		// 	}
		// 	return instance;
		// }.paramType(['BigInteger', 'BigInteger']),
		// instances: null
	}
});