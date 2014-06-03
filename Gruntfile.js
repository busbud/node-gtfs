/**
 * Created by alex on 03/06/14.
 */
var _ = require('lodash');

module.exports = function (grunt) {
  // load all grunt tasks automatically, but exclude grunt-cli because it is not a grunt task
  _(require('matchdep').filterAll('grunt-*')).without('grunt-cli').forEach(grunt.loadNpmTasks);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bgShell: {
      tests: {
        cmd: 'NODE_ENV=test ./node_modules/.bin/mocha <%= grunt.task.current.args[0] %> --reporter spec -t 20000',
        execOpts: {
          maxBuffer: false
        },
        fail: true
      }
    },
    nodemon: {
      dev: {
        script: 'index.js',
        options: {
          ignore: ['node_modules/**'],
          ext: 'js'
        }
      }
    },

    watch: {
      test: {
        files: [ '**/*.js', '!**/node_modules/**', '!import/**', '!public/**' ],
        tasks: ['test:<%= grunt.task.current.args[1] %>'],
        spawn: false
      }
    }

  });

  // testing tasks --
  grunt.registerTask('test', function(file){
    // just sets up which test file(s) to run and runs them via grunt-exec (which uses mocha)
    if (file == 'all' || file == null) file = '*';
    var test_to_run = 'test/'+file+'-test.js';
    grunt.task.run(['bgShell:tests:'+test_to_run]);
  });
  // this restarts a server when files change
  grunt.registerTask('dev', 'nodemon');

};
