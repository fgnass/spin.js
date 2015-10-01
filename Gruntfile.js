/**
 * Workflow to release a new version:
 * grunt bump-only:minor
 * grunt
 * grunt gh-pages
 * grunt bump-commit
 * git push --tags
 * npm publish
 */
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      js: {
        files: [
          { src: ['spin.js', 'jquery.spin.js'], dest: 'site/' }
        ]
      }
    },

    uglify: {
      options: {
        banner: '// http://spin.js.org/#v<%= pkg.version %>\n'
      },
      js: {
        files: {
          'site/spin.min.js': ['site/spin.js'],
          'spin.min.js': ['site/spin.min.js']
        }
      }
    },

    bump: {
      options: {
        files: ['package.json', 'component.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'component.json', 'spin.min.js'],
        createTag: true,
        tagName: '%VERSION%',
        push: false
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
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('default', ['copy', 'uglify']);

};
