module.exports = function(grunt) {
	"use strict";
	grunt.loadNpmTasks('grunt-contrib-concat');
 	grunt.loadNpmTasks('grunt-mocha-test');
 	grunt.loadNpmTasks('grunt-jsdoc');
 	grunt.loadNpmTasks('grunt-execute');
 	grunt.loadNpmTasks('grunt-contrib-connect');
 	grunt.loadNpmTasks('grunt-contrib-copy');
 	
	grunt.initConfig({
		concat: {
			options: {
				separator: '\n',
			},
			// dist: {
			// 	src: ['src/*.js'],
			// 	dest: 'dist/build.js',
			// },
			demoDist: {
				src: ['demo/littleNodeHelper.js', 'vendor/*.js', 'src/oop.js', 'demo/demo.js'],
				dest: 'dist/demoBuild.js'
			},
			dist: {
				src: [
				//'demo/littleNodeHelper.js', 
				// FW and Requirements
				'src/oop.js', 'vendor/*.js', 'src/UnicryptJS/_Reqs/*.js', 
				//Algebra General
				'src/UnicryptJS/Unicrypt/Helper/Math/MathUtil.js', 'src/UnicryptJS/Unicrypt/unicrypt.js', 'src/UnicryptJS/Unicrypt/Math/Algebra/General/Abstracts/AbstractSet.js',
				'src/UnicryptJS/Unicrypt/Math/Algebra/General/Abstracts/AbstractSemiGroup.js','src/UnicryptJS/Unicrypt/Math/Algebra/General/Abstracts/AbstractMonoid.js',
				'src/UnicryptJS/Unicrypt/Math/Algebra/General/Abstracts/AbstractGroup.js', 'src/UnicryptJS/Unicrypt/Math/Algebra/General/Abstracts/AbstractCyclicGroup.js',
				//GStarMod
				'src/UnicryptJS/Unicrypt/Math/Algebra/Multiplicative/Abstracts/AbstractMultiplicativeCyclicGroup.js', 'src/UnicryptJS/Unicrypt/Math/Algebra/Multiplicative/Classes/GStarMod.js',
				'src/UnicryptJS/Unicrypt/Math/Algebra/Multiplicative/Classes/GStarModPrime.js', 'src/UnicryptJS/Unicrypt/Math/Algebra/Multiplicative/Classes/GStarModSafePrime.js',
				'src/UnicryptJS/Unicrypt/Math/Algebra/General/Abstracts/AbstractElement.js', 'src/UnicryptJS/Unicrypt/Math/Algebra/Multiplicative/Abstracts/AbstractMultiplicativeElement.js',
				'src/UnicryptJS/Unicrypt/Math/Algebra/Multiplicative/Classes/GStarModElement.js',
				//ZStarMod
				'src/UnicryptJS/Unicrypt/Math/Algebra/Multiplicative/Abstracts/AbstractMultiplicativeGroup.js', 'src/UnicryptJS/Unicrypt/Math/Algebra/Multiplicative/Classes/ZStarMod.js',
				'src/UnicryptJS/Unicrypt/Math/Algebra/Multiplicative/Classes/ZStarModPrime.js',
				//ZMod
				'src/UnicryptJS/Unicrypt/Math/Algebra/Additive/Abstracts/AbstractAdditiveMonoid.js','src/UnicryptJS/Unicrypt/Math/Algebra/Additive/Abstracts/AbstractAdditiveElement.js',
				'src/UnicryptJS/Unicrypt/Math/Algebra/Dualistic/Abstracts/AbstractSemiRing.js','src/UnicryptJS/Unicrypt/Math/Algebra/Dualistic/Abstracts/AbstractRing.js',
				'src/UnicryptJS/Unicrypt/Math/Algebra/Dualistic/Abstracts/AbstractCyclicRing.js', 'src/UnicryptJS/Unicrypt/Math/Algebra/Dualistic/Abstracts/AbstractDualisticElement.js',
				'src/UnicryptJS/Unicrypt/Math/Algebra/Dualistic/Classes/ZMod.js','src/UnicryptJS/Unicrypt/Math/Algebra/Dualistic/Classes/ZModElement.js',
				//Scheme
				'src/UnicryptJS/Unicrypt/Crypto/Schemes/Commitment/Classes/PedersenCommitmentScheme.js',
				//Tester
				//'demo/demoUniJS.js'
				],
				dest: 'dist/UniCryptJS.js'
			},
			demoUniDist: {
				src: ['demo/littleNodeHelper.js', 'dist/UniCryptJS.js', 'demo/demoUniJS.js'],
				dest: 'dist/UniDemoBuild.js'
			}
		},
		copy: {
			server: {
				src: 'dist/UniCryptJS.js',
				dest: 'webExample/dist/UniCryptJS.js'
			}
		},
		mochaTest: {
	      	test: {
		        options: {
		          	reporter: 'spec',
		          	captureFile: 'results.txt', // Optionally capture the reporter output to a file 
		          	quiet: false, // Optionally suppress output to standard out (defaults to false) 
		          	clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
		        },
		        src: ['test/oopTest.js']
      		},
      		testDemo: {
      			options: {
		          	reporter: 'spec',
		          	captureFile: 'results.txt', // Optionally capture the reporter output to a file 
		          	quiet: false, // Optionally suppress output to standard out (defaults to false) 
		          	clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false) 
		        },
		        //src: ['test/oopTest.js', 'test/demoTest.js']
		        src: ['test/oopTest.js']
      		}
    	},
	    jsdoc : {
	        dist : {
	            src: ['src/*.js', 'test/*.js'],
	            options: {
	                destination: 'doc'
	            }
	        },
	        demo : {
	        	src: ['demo/*.js'],
	            options: {
	                destination: 'demoDoc'
	            }
	        }
	    },
	    execute : {
	    	demo : {
	    		src: ['dist/demoBuild.js']
	    	},
	    	uniDemo: {
	    		src: ['dist/UniDemoBuild.js']
	    	}
	    }, 
	    connect : {
	   		server: {
	   			options: {
	   				port: 8000,
	   				base: 'webExample',
	   				keepalive: true
	   			}
	   		} 	
	    }
	});


	grunt.registerTask('default', ['concat:dist', 'mochaTest:test']);
	grunt.registerTask('demo', ['concat:demoDist', 'jsdoc:demo', 'mochaTest:testDemo']);
	grunt.registerTask('runDemo', ['concat:demoDist', 'execute:demo']);
	grunt.registerTask('runUni', ['concat:dist', 'concat:demoUniDist', 'execute:uniDemo']);
	grunt.registerTask('server', ['concat:dist', 'copy:server', 'connect:server']);
};