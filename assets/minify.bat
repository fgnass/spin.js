@echo off

pushd %~dp0

type prettify.css fd-slider\fd-slider.css ^
 fd-slider\fd-slider-tooltip.css main.css | cleancss -o style.css

type prettify.js ..\spin.js fd-slider\fd-slider.js | uglifyjs -o pack.js

popd
