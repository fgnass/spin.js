# spin.js

An animated CSS3 loading spinner with VML fallback for IE.

 * No images, no external CSS
 * No dependencies
 * Highly configurable
 * Resolution independent
 * Uses VML as fallback in old IEs
 * Uses @keyframe animations, falling back to setTimeout()
 * Works in all major browsers, including IE6
 * Small footprint (~1.9K gzipped)
 * MIT License

## Usage

```javascript
new Spinner({color:'#fff', lines: 12}).spin(target);
```

### Example with Angular:

Include angular.spin.js after angular.js and spin.js.

app.js
```javascript
angular.module('myApp', ['spinjs-directive'])
.controller('myCtrl', ['$scope', '$timeout', function($scope, $timeout) {
  $scope.loading = true;
  $scope.opts = {
    radius: 30, // see spin.js documentation for more
  };
  
  $timeout(function() {
    $scope.loading = false;
  }, 1000);
});
```
index.html
```html
<div ng-app="myApp">
  <div ng-controller="myCtrl">
    <spinner spinner-options="opts" spinner-show="loading">
  </div>
</div>
```


For an interactive demo and a list of all supported options please refer to the [project's homepage](http://fgnass.github.io/spin.js/).
