angular.module('app', ['ngAnimate','ui.bootstrap', 'ngCookies']);

var FormCtrl = function($scope, $animate, $modal, $window, $http, $cookieStore) {

  // hide error messages until 'submit' event
  $scope.submitted = false;

  $scope.user = {};

  // method called from shakeThat directive
  $scope.submit = function() {

    $http.post('/api/authenticate', $scope.user)
      .success(function(data) {
        
        $cookieStore.put('user', data);
        $cookieStore.remove('char');        
        
        $window.location.href= '/home' ;
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

  $scope.launchCharDialog = function(){
    $modal.open({
          templateUrl: 'char.html',
          controller: CharCtrl,
          resolve: {

          }
      }); 
  };  
};

var DialogCtrl = function($scope, $modalInstance, message, title){
  $scope.title = title;
   $scope.message = message;
  $scope.ok = function () {
    $modalInstance.close();
  };  
};

var CharCtrl = function($scope, $http, $modalInstance, $window, $modal, $cookieStore) {

  $scope.personagem = {};

  $scope.entrar = function()
  {

    $http.get('/api/personagem/codigo/' + $scope.personagem.codigo, $scope.personagem)
      .success(function(personagem) {
        
        $cookieStore.remove('user');
        $cookieStore.put('char', personagem);        
        $window.location.href= "/home#/ficha/" + personagem[0]._id + "/S";
        
        
      })
      .error(function(data) {
        var dialog = $modal.open({
          templateUrl: 'partial/dialog.html',
          controller: DialogCtrl,
          resolve: {
            message: function () {
              return 'O código informado não corresponde a nenhum personagem!';
            },
            title: function(){
                return 'Atenção!';
            }                    
          }
        });      

        dialog.result.then(function () {
          $modalInstance.close();
        });  
      });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
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

