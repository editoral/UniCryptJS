module.exports = function(grunt) {
	"use strict";
	grunt.loadNpmTasks('grunt-contrib-concat');
 	grunt.loadNpmTasks('grunt-mocha-test');
 	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.initConfig({
		concat: {
			options: {
				separator: '\n',
			},
			dist: {
				src: ['src/*.js'],
				dest: 'dist/built.js',
			},
			demoDist: {
				src: ['demo/*.js', 'src/*.js'],
				dest: 'dist/demoBuilt.js'
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
		        src: ['test/demoTest.js']		     
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
	    }
	});


	grunt.registerTask('default', ['concat:dist', 'mochaTest:test']);
	grunt.registerTask('demo', ['concat:demoDist', 'jsdoc:demo', 'mochaTest:testDemo']);
};