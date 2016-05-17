unicrypt.math.algebra.multiplicative.classes.GStarModSafePrime = Op.Class('GStarModSafePrime', {
	'extends': unicrypt.math.algebra.multiplicative.classes.GStarModPrime
},{
	_init: function(modulus) {	
		this.$$super(modulus, modulus.subtract(u.BigInteger.ONE()).divide(u.BigInteger.valueOf(2)));
	}.paramType(['BigInteger']),
	// func: function() {

	// }.paramType(['E']).returnType(''),
	static: {
		getInstance: function(modulus) {
			var mod = new u.BigInteger(modulus);
			if (modulus == null) {
				throw new Error('IllegalArgumentException');
			}
			//var instance = this._static_.instances.get(modulus, orderFactor);
			//if (instance == null) {
				//instance = new GStarModPrime(modulus, orderFactor);
				//this._static_.instances.put(modulus, orderFactor, instance);
			//}

			if(!(mod.signum() > 0 && mod.isProbablePrime(40))) {
				throw new Error('IllegalArgumentException');
			}
			var q = (modulus - 1) / 2
			if(!(q.signum() > 0 && q.isProbablePrime(40))) {
				throw new Error('IllegalArgumentException');
			}			
			var instance = new unicrypt.math.algebra.multiplicative.classes.GStarModSafePrime(modulus);
			return instance;
		}.paramType(['long']),
		//instances: null
	}
});