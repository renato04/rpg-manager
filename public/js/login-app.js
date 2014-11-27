angular.module('app', ['ngAnimate','ui.bootstrap', 'ngCookies']);

var FormCtrl = function($scope, $animate, $modal, $window, $http, $cookieStore) {

  // hide error messages until 'submit' event
  $scope.submitted = false;

  $scope.user = {};

  // method called from shakeThat directive
  $scope.submit = function() {

    $http.post('/api/authenticate', $scope.user)
      .success(function(data) {
        
        $window.location.href= '/home' ;

        $cookieStore.put('user', data);
        
      })
      .error(function(data) {
        var dialog = $modal.open({
          templateUrl: 'partial/dialog.html',
          controller: DialogCtrl,
          resolve: {
            message: function () {
              return 'Usuário e/ou senha invalido.';
            }
          }
        });  
      });

    //$window.location.href = '/home';
  };
  
  $scope.launchUserDialog = function(){
    $modal.open({
          templateUrl: 'user-dialog.html',
          controller: LoginCtrl,
          resolve: {

          }
      }); 
  };
};

var DialogCtrl = function($scope, $modalInstance, message){
   $scope.message = message;
  $scope.ok = function () {
    $modalInstance.close();
  };  
};

var LoginCtrl = function($scope, $http, $modalInstance, $window, $modal) {

  $scope.user = {};

  $scope.save = function()
  {

    $http.post('/api/account', $scope.user)
      .success(function(data) {
        
        var dialog = $modal.open({
          templateUrl: 'partial/dialog.html',
          controller: DialogCtrl,
          resolve: {
            message: function () {
              return 'Bem vindo! Você foi cadastrado com sucesso!';
            }
          }
        });    

        dialog.result.then(function () {
          $modalInstance.close();
        });    
        
        
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };  
};

