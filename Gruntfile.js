module.exports = function(grunt) {

  grunt.initConfig({

    copy: {
      js: {
        files: [
          { src: ['spin.js'], dest: 'site/' }
        ]
      }
    },

    'gh-pages': {
      release: {
        options: {
          base: 'site',
          message: 'automatic commit'
        },
        src: '**/*'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('default', ['copy']);

};
