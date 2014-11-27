angular.module('app', ['ngAnimate','ui.bootstrap','dialogs'])

.controller('FormCtrl', ['$scope', '$animate', '$window', function($scope, $animate, $window) {

  // hide error messages until 'submit' event
  $scope.submitted = false;

  // hide success message
  $scope.showMessage = false;

  // method called from shakeThat directive
  $scope.submit = function() {
    // show success message
    $scope.showMessage = true;
    $window.location.href = '/home';
  };
  

}])
.controller('LoginCtrl', ['$scope', '$http', '$dialogs', '$window', function($scope, $http, $dialogs, $window) {

  $scope.user = {};

  $scope.save = function()
  {

    $http.post('/api/account', $scope.user)
      .success(function(data) {
        alert('Salvo com sucesso!');
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

}])
.directive('shakeThat', ['$animate', function($animate) {

  return {
    require: '^form',
    scope: {
      submit: '&',
      submitted: '='
    },
    link: function(scope, element, attrs, form) {

      // listen on submit event
      element.on('submit', function() {

        // tell angular to update scope
        scope.$apply(function() {

          // everything ok -> call submit fn from controller
          if (form.$valid) return scope.submit();

          // show error messages on submit
          scope.submitted = true;

          // shake that form
          $animate.addClass(element, 'shake', function() {
            $animate.removeClass(element, 'shake');
          });

        });

      });

    }
  };

}]);
