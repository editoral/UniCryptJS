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
				src: ['src/oop.js', 'demo/*.js'],
				dest: 'dist/demoBuild.js'
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
		        src: ['test/oopTest.js', 'test/demoTest.js']		     
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
	    	}
	    }
	});


	grunt.registerTask('default', ['concat:dist', 'mochaTest:test']);
	grunt.registerTask('demo', ['concat:demoDist', 'jsdoc:demo', 'mochaTest:testDemo']);
	grunt.registerTask('runDemo', ['concat:demoDist', 'execute:demo'])
};