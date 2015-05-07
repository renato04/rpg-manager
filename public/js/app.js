angular.module('app', ['ngAnimate', 'ui.router'])

.config(function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/login');
    
    $stateProvider
        
        // HOME STATES AND NESTED VIEWS ========================================
        .state('login', {
            url: '/login',
            templateUrl: 'login.html',
            controller: 'loginController'
        })
        
        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('canvas', {
            url: '/canvas',
            templateUrl: 'home.html',
            controller: 'homeController'      
        });
        
})
.controller('loginController', ['$scope', '$animate', '$stateProvider'function($scope, $animate, $stateProvider) {

  // hide error messages until 'submit' event
  $scope.submitted = false;

  // hide success message
  $scope.showMessage = false;

  // method called from shakeThat directive
  $scope.submit = function() {
    // show success message
    //$scope.showMessage = true;
    $stateProvider.state('canvas');
  };

}])

.controller('homeController', ['$scope', function($scope, $animate, $stateProvider) {

	


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
