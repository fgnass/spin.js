module.exports = function(grunt) {

  grunt.initConfig({

    connect: {
      server: {
        options: {
          keepalive: true,
          port: 9080,
          base: {
            path: 'site',
            options: {
              // add CSP header to ensure spin.js supports it
              setHeaders: function (res, path) {
                let defaultSrc = "default-src 'self';";
                let styleSrc = "style-src 'self' fonts.googleapis.com;";
                let fontSrc = "font-src 'self' fonts.gstatic.com;";
                let imgSrc = "img-src 'self' www.gravatar.com;";
                res.setHeader('Content-Security-Policy', `${defaultSrc} ${styleSrc} ${fontSrc} ${imgSrc}`);
              },
            },
          },
        }
      }
    },

    copy: {
      js: {
        files: [
          { src: ['spin.js', 'spin.css'], dest: 'site/' }
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

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('serve', ['connect']);
  grunt.registerTask('default', ['copy']);

};
