unicrypt.math.algebra.multiplicative.classes.GStarModSafePrime = Op.Class('GStarModSafePrime', {
	'extends': unicrypt.math.algebra.multiplicative.classes.GStarModPrime
},{
	_init: function(modulus) {	
		this.$$super(modulus, modulus.subtract(u.BigInteger.ONE()).divide(u.BigInteger.valueOf(2)));
	}.paramType(['BigInteger']),
	// func: function() {

	// }.paramType(['E']).returnType(''),
	static: {
		getInstance: function(mod) {
			if (mod == null) {
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
			var q = mod.subtract(u.BigInteger.ONE()).divide(u.BigInteger.valueOf(2));
			//console.log(u.BigInteger.valueOf(2).bigInt.intValue());
			if(!(q.signum() > 0 && q.isProbablePrime(40))) {
				throw new Error('IllegalArgumentException');
			}			
			var instance = new unicrypt.math.algebra.multiplicative.classes.GStarModSafePrime(mod);
			return instance;
		}.paramType(['long']),
		//instances: null
	}
});