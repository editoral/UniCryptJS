unicrypt.crypto.schemes.commitment.classes.PedersenCommitmentScheme = Op.AbstractClass('PedersenCommitmentScheme', {
	'extends': {
		'class': unicrypt.crypto.schemes.scheme.abstracts.AbstractCommitmentScheme,
		'generic': ['ZMod', 'ZModElement', 'CyclicGroup', 'Element', 'ZMod']
	}
}, {
	_cyclicGroup: null,
	_randomizationGenerator: null,
	_messageGenerator: null,
	_init: function(cyclicGroup, randomizationGenerator, messageGenerator) {
		super(cyclicGroup.getZModOrder(), cyclicGroup, cyclicGroup.getZModOrder());
		this._cyclicGroup = cyclicGroup;
		this._randomizationGenerator = randomizationGenerator;
		this._messageGenerator = messageGenerator;
	}.paramType(['M', 'C', 'R']),
	getRandomizationSpace: function() {
		return this._randomizationSpace;
	}.paramType(['M']),
	commit: function(message, randomization) {
		return this.getCommitmentFunction().apply(message, randomization);
	}.paramType('Element', 'Element'),
	decommit: function(message, randomization, commitment) {
		return this.getDecommitmentFunction().apply(message, randomization, commitment);
	}.returnType('boolean'),
	_abstractGetCommitmentFunction: function() {
		var commitFunction = function() {
			
		}
		return commitFunction;
	}
});