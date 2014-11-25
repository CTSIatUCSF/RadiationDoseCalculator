module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    concurrent: {
        target: {
            tasks: ["nodemon", "watch"],
            options: {
                logConcurrentOutput: true
            }
        }
    },
    nodemon: {
        dev: {
            script: "index.js",
            options: {
                watch: ["*.js", "../js/*.js"],
                delay: 300
            }
        }
    },
    jshint: {
      // define the files to lint
      files: ["gruntfile.js", "../js/*.js", "src/**/*.js", "test/**/*.js"],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
          // more options here if you want to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: "spec",
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
        },
        src: ["test/**/*.js"]
      }
    },
    watch: {
      files: ["<%= jshint.files %>"],
      tasks: ["jshint", "mochaTest"]
    }
  });

  grunt.loadNpmTasks("grunt-nodemon");
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks("grunt-mocha-test");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");

  // Default task(s).
  grunt.registerTask("default", ["concurrent:target"]);
  grunt.registerTask("test", ["jshint", "mochaTest"]);

};