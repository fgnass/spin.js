all:
	@mkdir -p dist
	@cp spin.js dist/
	@uglifyjs -mt --unsafe -o dist/spin.min.js spin.js

clean:
	@rm -r dist

.PHONY: clean all
