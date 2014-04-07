angular.module('spinjs-directive').directive('spinner', [function() {
	return {
		scope: {
			spinnerOptions: '=',
			spinnerShow: '='
		},
		restrict: 'E',
		link: function($scope, iElm, iAttrs, controller) {
      $scope.Spinner = new Spinner($scope.spinnerOptions);
      $scope.$watch('spinnerShow', function (newValue) {
        if (newValue) {
          $scope.Spinner.spin(iElm[0]);
        } else {
          $scope.Spinner.stop();
        }
      });
		}
	};
}]);
