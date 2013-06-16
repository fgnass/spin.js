describe('Usage Option Test', function() {

  var spinner     = null,
      result      = null,
      $           = jQuery,
      target      = $("<div>")[0],
      /**
       * Chai Assertion Library
       * http://chaijs.com/guide/installation/
       *
       * Currently supports all modern browsers: IE 9+, Chrome 7+, FireFox 4+, Safari 5+. Please note that the should style is currently not compatible with IE9.
       * If you want to know if your browser is compatible, run the online test suite: http://chaijs.com/api/test/
       */
      expect      = chai.expect,
      runSpinner  = function(opts) {
                      spinner = new Spinner(opts).spin(target);
                    };

  beforeEach(function() {
    $(target).empty();
  });

  afterEach(function() {
    spinner && spinner.stop();
  });

  describe('Spin Test Page', function() {

    it('should have 34 div elements (the double of 17), when create a spinner as {lines: 17}', function(done) {
      runSpinner( {lines: 17} );
      result = $(target).find('.spinner div').length;
      expect(result).to.equal(34);

      done();
    });

    it("should have 12px of width (a sum of 5px plus 7 'length'), when create a spinner as {length: 7}", function(done) {
      runSpinner( {length: 7} );
      result = $(target).find('.spinner div div').first().css('width');
      expect(result).to.equal("12px");

      done();
    });

    it('should have 8px of height, when create a spinner as {width: 8}', function(done) {
      runSpinner( {width: 8} );
      result = $(target).find('.spinner div div').first().css('height');
      expect(result).to.equal("8px");

      done();
    });

    it('should have 21px of translate, when create a spinner as {radius: 21}', function(done) {
      runSpinner( {radius: 21} );
      result = $(target).find('.spinner div div').first().attr('style');
      expect(result).to.have.string("translate(21px");

      done();
    });

    it('should have 25px of border radius (a multiple of 2.5 times), when create a spinner as {corners: 10}', function(done) {
      runSpinner( {corners: 10} );
      result = $(target).find('.spinner div div').first().attr('style');
      expect(result).to.have.string("radius: 25px");

      done();
    });

    it('should have 6deg of rotate, when create a spinner as {rotate: 6}', function(done) {
      runSpinner( {rotate: 6} );
      result = $(target).find('.spinner div div').first().attr('style');
      expect(result).to.have.string("rotate(6deg)");

      done();
    });

    it('should clockwise, when create a spinner as {direction: 1}', function(done) {
      runSpinner( {direction: 1} );
      result = $(target).find('.spinner > div').first().attr('style');
      expect(result,  "The first spinner should be 0." ).to.have.string("opacity-100-25-0-12");
      
      result = $(target).find('.spinner > div').last().attr('style');
      expect(result, "The last spinner should be 11." ).to.have.string("opacity-100-25-11-12");

      done();
    });

    it('should counterclockwise, when create a spinner as {direction: -1}', function(done) {
      runSpinner( {direction: -1} );
      result = $(target).find('.spinner > div').first().attr('style');
      expect(result, "The first spinner should be 11." ).to.have.string("opacity-100-25-11-12");
      
      result = $(target).find('.spinner > div').last().attr('style');
      expect(result, "The last spinner should be 0." ).to.have.string("opacity-100-25-0-12");

      done();
    });

    it("should be red, when create a spinner as {color: '#f00'}", function(done) {
      runSpinner( {color: '#f00'} );
      result = $(target).find('.spinner div div').first().attr('style');

      var regex = /(background: #f00)|(rgb[(]255, 0, 0[)])/;
      expect( regex.test(result) ).to.be.ok;

      done();
    });

    it('should be faster (4 laps per second), when create a spinner as {speed: 4}', function(done) {
      runSpinner( {speed: 4} );
      result = $(target).find('.spinner > div').first().attr('style');
      expect(result).to.have.string("0.25s");

      done();
    });

    it('should be trails as 50, when create a spinner as {trail: 50}', function(done) {
      runSpinner( {trail: 50} );
      result = $(target).find('.spinner > div').first().attr('style');
      expect(result).to.have.string("opacity-50-25-0-12");

      done();
    });

    it('should have shadow, when create a spinner as {shadow: true}', function(done) {
      var regex = null;
      runSpinner( {shadow: true} );
      result = $(target).find('.spinner > div').first().find('div').first().css('box-shadow');

      regex = /0(px)? 0(px)? 4px/;
      expect( regex.test(result), "The first div of spinner should not be shadow.").to.be.ok;
      
      regex = /0(px)? 0(px)? 1px/;
      result = $(target).find('.spinner > div').first().find('div').last().css('box-shadow');
      expect( regex.test(result), "The first div of spinner should be shadow." ).to.be.ok;

      done();
    });

    it("should have 'indicator' as class name, when create a spinner as {className: 'indicator'}", function(done) {
      runSpinner( {className: 'indicator'} );
      result = $(target).find('div.indicator').length;
      expect(result).to.equal(1);

      done();
    });

  });

});
