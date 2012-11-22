@echo off

pushd %~dp0

type prettify.css fd-slider\fd-slider.css ^
 fd-slider\fd-slider-tooltip.css main.css | cleancss -o style.css

cmd /c uglifyjs fd-slider\fd-slider.js ..\spin.js --compress --mangle -o pack.js

popd
