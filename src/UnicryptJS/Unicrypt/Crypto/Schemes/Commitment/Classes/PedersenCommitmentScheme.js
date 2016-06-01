// unicrypt.crypto.schemes.commitment.classes.PedersenCommitmentScheme = Op.AbstractClass('PedersenCommitmentScheme', {
// 	'extends': {
// 		'class': unicrypt.crypto.schemes.scheme.abstracts.AbstractCommitmentScheme,
// 		'generic': ['ZMod', 'ZModElement', 'CyclicGroup', 'Element', 'ZMod']
// 	}
// }, {
// 	_cyclicGroup: null,
// 	_randomizationGenerator: null,
// 	_messageGenerator: null,
// 	_init: function(cyclicGroup, randomizationGenerator, messageGenerator) {
// 		super(cyclicGroup.getZModOrder(), cyclicGroup, cyclicGroup.getZModOrder());
// 		this._cyclicGroup = cyclicGroup;
// 		this._randomizationGenerator = randomizationGenerator;
// 		this._messageGenerator = messageGenerator;
// 	}.paramType(['M', 'C', 'R']),
// 	getRandomizationSpace: function() {
// 		return this._randomizationSpace;
// 	}.paramType(['M']),
// 	commit: function(message, randomization) {
// 		return this.getCommitmentFunction().apply(message, randomization);
// 	}.paramType('Element', 'Element'),
// 	decommit: function(message, randomization, commitment) {
// 		return this.getDecommitmentFunction().apply(message, randomization, commitment);
// 	}.returnType('boolean'),
// 	_abstractGetCommitmentFunction: function(message, randomization) {

// 		return commitFunction;
// 	}
// });

unicrypt.crypto.schemes.commitment.classes.PedersenCommitmentScheme = Op.Class('PedersenCommitmentScheme', {

}, {
	_cyclicGroup: null,
	_randomization: null,
	_generator1: null,
	_generator2: null,
	_init: function(cyclicGroup) {
		//super(cyclicGroup.getZModOrder(), cyclicGroup, cyclicGroup.getZModOrder());
		this._cyclicGroup = cyclicGroup;
		//this._randomizationGenerator = randomizationGenerator;
		//this._messageGenerator = messageGenerator;
	},//.paramType(['M', 'C', 'R']),
	// getRandomization: function() {
	// 	return this._randomization;
	// },//.paramType(['M']),
	commit: function(message, randomization) {
		//this._randomization = randomization;
		this._generator1 = this._generateRandomGenerator();
		this._generator2 = this._generateRandomGenerator();
		return this._generator1.selfApply(message).apply(this._generator2.selfApply(randomization));
	}.paramType(['BigInteger', 'BigInteger']),
	decommit: function(message, randomization, commitment) {
		var commit = this._generator1.selfApply(message).apply(this._generator2.selfApply(randomization));
		return commitment.getValue().intValue() === this._generator1.selfApply(message).apply(this._generator2.selfApply(randomization)).getValue().intValue();
	}.returnType('boolean'),
	_generateRandomGenerator: function() {
		var stopcondition = false;
		var mod = this._cyclicGroup.getModulus();
		var result = null;
		while(!stopcondition) {
			var randNr = Math.floor((Math.random() * (mod.intValue() - 2)) + 2);
			var testEl = new u.BigInteger(randNr);			
			try {
				result = this._cyclicGroup.getElement(testEl);
				stopcondition = true;
			} catch(err) {

			}		
		}
		//result = this._cyclicGroup.getElement(testEl);

		// while(!stopcondition) {
		// 	var randNr = Math.floor((Math.random() * (mod.intValue() - 2)) + 2);
		// 	//TODO
		// 	//var randNr = mod.subtract(new u.BigInteger(2)).multiply(new u.BigInteger(Math.random())).add(new u.BigInteger(2));
		// 	var testEl = new u.BigInteger(randNr);
		// 	result = this._cyclicGroup.getElement(testEl);
		// 	if(result.isGenerator()) {
		// 		stopcondition = true;
		// 	}
		// }
		return result;
	}.returnType('GStarModElement'),
	// // _areIndependentGenerators: function(element1, element2) {

	// // }.paramType(['GStarModElement', 'GStarModElement']).returnType('boolean'),
	// _getBaseLog(x, y) {
 //  		return Math.log(y) / Math.log(x);
	// },
	static: {
		getInstance: function(cyclicGroup) {
			return new unicrypt.crypto.schemes.commitment.classes.PedersenCommitmentScheme(cyclicGroup);
		}.paramType(['GStarMod'])
	}

});