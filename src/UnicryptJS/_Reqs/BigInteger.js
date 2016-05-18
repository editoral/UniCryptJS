GLOBAL.u = {},
u.BigInteger = Op.Class('BigInteger',null, {
	bigInt: null,
	init: function init(num) {
		this.bigInt = new BigInteger(''+num);
	}.paramType(['long']),
	signum: function() {
		return this.bigInt.signum();
	},
	isProbablePrime: function(num) {
		return this.bigInt.isProbablePrime(num);
	}.paramType(['int']),
	subtract: function(value) {
		newBigInt = new u.BigInteger(1);
		newBigInt.bigInt = this.bigInt.subtract(value.bigInt);
		return newBigInt;
	}.paramType(['BigInteger']),
	divide: function(value) {
		newBigInt = new u.BigInteger(1);
		newBigInt.bigInt = this.bigInt.divide(value.bigInt);
		return newBigInt;
	}.paramType(['BigInteger']),
	intValue: function() {
		return this.bigInt.intValue();
	}.returnType('int'),
	compareTo: function(value) {
		return this.bigInt.compareTo(value.bigInt);
	}.paramType(['BigInteger']),
	gcd: function(value) {
		newBigInt = new u.BigInteger(1);
		newBigInt.bigInt = this.bigInt.gcd(value.bigInt);
		return newBigInt;
	}.paramType(['BigInteger']),
	equals: function(value) {
		return this.bigInt.equals(value.bigInt);
	}.paramType(['BigInteger']),
	modInverse: function(mod) {
		newBigInt = new u.BigInteger(1);
		newBigInt.bigInt = this.bigInt.modInverse(mod);
		return newBigInt;
	}.paramType(['BigInteger']),
	static: {
		valueOf: function(long) {
			return new u.BigInteger(long)
		}.paramType(['long']),
		ONE: function() {
			return new u.BigInteger(1);
		}
	}
	
		
});