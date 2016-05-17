module.exports = function(grunt) {
	"use strict";
	grunt.loadNpmTasks('grunt-contrib-concat');
 	grunt.loadNpmTasks('grunt-mocha-test');
 	grunt.loadNpmTasks('grunt-jsdoc');
 	grunt.loadNpmTasks('grunt-execute');
 	
	grunt.initConfig({
		concat: {
			options: {
				separator: '\n',
			},
			dist: {
				src: ['src/*.js'],
				dest: 'dist/build.js',
			},
			demoDist: {
				src: ['demo/littleNodeHelper.js', 'vendor/*.js', 'src/oop.js', 'demo/demo.js'],
				dest: 'dist/demoBuild.js'
			},
			demoUniDist: {
				src: ['demo/littleNodeHelper.js', 'src/oop.js', 'vendor/*.js', 'src/UnicryptJS/_Reqs/*.js', 'src/UnicryptJS/Unicrypt/**/*.js', 'demo/demoUniJS.js'],
				dest: 'dist/UniDemoBuild.js'
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
	    }
	});


	grunt.registerTask('default', ['concat:dist', 'mochaTest:test']);
	grunt.registerTask('demo', ['concat:demoDist', 'jsdoc:demo', 'mochaTest:testDemo']);
	grunt.registerTask('runDemo', ['concat:demoDist', 'execute:demo']);
	grunt.registerTask('runUni', ['concat:demoUniDist', 'execute:uniDemo']);
};