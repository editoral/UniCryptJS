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
		//this.bigInt = this.bigInt.subtract();
		return this.bigInt.subtract(value.bigInt);
	}.paramType(['BigInteger']),
	divide: function(value) {
		//this.bigInt = this.bigInt.divide();
		return this.bigInt.divide(value.bigInt);
	}.paramType(['BigInteger']),
	intValue: function() {
		return this.bigInt.intValue();
	}.returnType('int'),
	compareTo: function(value) {
		return this.bigInt.compareTo(value.bigInt);
	}.paramType('BigInteger'),
	gcd: function(value) {
		return this.bigInt.gcd(value.bigInt);
	}.paramType('BigInteger'),
	equals: function(value) {
		return this.bigInt.equals(value.bigInt);
	}.paramType('BigInteger'),
	modInverse: function() {

	},
	static: {
		valueOf: function(long) {
			return new u.BigInteger(long)
		}.paramType(['long']),
		ONE: function() {
			return new u.BigInteger(1);
		}
	}
	
		
});