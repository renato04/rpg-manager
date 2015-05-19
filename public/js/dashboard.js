/// <reference path="../../typings/angularjs/angular.d.ts"/>
(function(){ 
String.prototype.hashCode = function() {
  for(var ret = 0, i = 0, len = this.length; i < len; i++) {
    ret = (31 * ret + this.charCodeAt(i)) << 0;
  }
  return ret;
};

angular.module('Dashboard', ['ui.bootstrap', 'ui.router', 'ngCookies', 'ngSocket', 'angularFileUpload', 'angular-loading-bar', 'ngMaterial']);
'use strict';

/**
 * Route configuration for the Dashboard module.
 */
angular.module('Dashboard').config(['$stateProvider', '$urlRouterProvider', 'cfpLoadingBarProvider',
    function($stateProvider, $urlRouterProvider, cfpLoadingBarProvider) {
      
    cfpLoadingBarProvider.includeSpinner = false;      

    // For unmatched routes
    $urlRouterProvider.otherwise('/');

    // Application routes
    $stateProvider
        .state('index', {
            url: '/',
            controller: AventuraCtrl,
            templateUrl: 'partial/aventuras.html'
        })
        .state('tables', {
            url: '/tables', 
            templateUrl: 'tables.html'
        })
        .state('ficha', {
            url: '/ficha/:id/:autenticado', 
            controller: PersonagemCtrl,            
            templateUrl: 'partial/personagem.html'
        })
        .state('aventuras', {
            url: '/aventuras',
            controller: AventuraCtrl, 
            templateUrl: 'partial/aventuras.html'
        })
        .state('editar;aventura', {
            url: '/editar/aventura/:id', 
            controller: AventuraCtrl,
            templateUrl: 'partial/aventura.html'
        })  
        .state('criar;aventura', {
            url: '/criar/aventura', 
            controller: AventuraCtrl,
            templateUrl: 'partial/aventura.html'
        })                
        .state('editarpersonagem', {
            url: '/editar/personagem/:id', 
            controller: PersonagemCtrl,
            templateUrl: 'partial/personagem.html'
        })
        .state('personagem', {
            url: '/personagem', 
            controller: PersonagemCtrl,
            templateUrl: 'partial/personagem.html'
        })        ;
}]);

/**
 * Master Controller
 */
angular.module('Dashboard')
    .controller('MasterCtrl', ['$scope', '$cookieStore', '$window', '$mdSidenav', '$mdUtil', '$location' ,MasterCtrl]);

function MasterCtrl($scope, $cookieStore, $window, $mdSidenav, $mdUtil, $location) {
    
    $scope.user = $cookieStore.get('user');
    $scope.char = $cookieStore.get('char');
    
    $scope.toggleLeft = buildToggler('right');
    
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
              .then(function () {
  
              });
          },300);
      return debounceFn;
    }    
    
    $scope.close = function () {
      $mdSidenav('right').close()
        .then(function () {

        });
    };    

    if (!$scope.user && !$scope.char) {
      $window.location.href=  "/";
    }
    /**
     * Sidebar Toggle & Cookie Control
     *
     */
    var mobileView = 992;

    $scope.getWidth = function() { return window.innerWidth; };

    $scope.logoff = function() { 

      $scope.user = $cookieStore.remove('user');
      $scope.char = $cookieStore.remove('char');      
      $window.location.href=  "/";

    };    

    $scope.$watch($scope.getWidth, function(newValue, oldValue)
    {
        if(newValue >= mobileView)
        {
            if(angular.isDefined($cookieStore.get('toggle')))
            {
                if($cookieStore.get('toggle') == false)
                {
                    $scope.toggle = false;
                }            
                else
                {
                    $scope.toggle = true;
                }
            }
            else 
            {
                $scope.toggle = true;
            }
        }
        else
        {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() 
    {
        $scope.toggle = ! $scope.toggle;

        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() { $scope.$apply(); };
    
    $scope.go = function ( path ) {
      $mdSidenav('right').close()
        .then(function () {
          $location.path( path );
        });
      
    };      
}

var PersonagemCtrl = function($scope, $modal, $stateParams, $cookieStore, $window, $socket, $upload, $mdDialog, PersonagemService) {
    $scope.personagem = {};
    $scope.autenticado = true;
    $scope.hp = 0;
    $scope.mp = 0;
    $scope.xp = 0;
    
    if ($stateParams.id) {
      if ($stateParams.autenticado) {
        $scope.autenticado = false;
      }

      PersonagemService.obter($stateParams.id, function(err, personagem){
          if (!err) {
              $scope.personagem = personagem;

              if (!$scope.autenticado) {
                $cookieStore.put('aventura', personagem.aventura);
              }              
              
              $socket.on('personagemAtualizado', function(personagem) {
                $scope.personagem = personagem;
              });      
          }
          else{
              var dialog = $modal.open({
                templateUrl: 'partial/dialog.html',
                controller: DialogCtrl,
                resolve: {
                  message: function () {
                    return 'Falha ao carregar personagem!';
                  },
                  title: function(){
                      return 'Atenção!';
                  }
                }
              }); 
          }
      });
    }    

    $scope.salvar = function(){
        $scope.personagem.aventura = $cookieStore.get('aventura');
        $scope.personagem.forca =  $scope.personagem.forca ? $scope.personagem.forca : 0;
        $scope.personagem.habilidade = $scope.personagem.habilidade ? $scope.personagem.habilidade : 0;
        $scope.personagem.resistencia = $scope.personagem.resistencia ? $scope.personagem.resistencia : 0;
        $scope.personagem.armadura = $scope.personagem.armadura ? $scope.personagem.armadura : 0;
        $scope.personagem.poderDeFogo = $scope.personagem.poderDeFogo ? $scope.personagem.poderDeFogo : 0;
        $scope.personagem.vida = $scope.personagem.vida ? $scope.personagem.vida : 0;
        $scope.personagem.magia = $scope.personagem.magia ? $scope.personagem.magia : 0;

        PersonagemService.salvar($scope.personagem, function(err, personagem){
            if (!err) {
              personagem.codigo =   Math.abs(personagem._id.hashCode());  
              $scope.personagem.codigo = personagem.codigo;
              $scope.personagem._id = personagem._id;
              PersonagemService.salvar(personagem, function(err, personagemComCOdigo){
              
              if (!err) {
                  if ($scope.selectedFile) {
                                    var file = $scope.selectedFile[0];
                  $scope.upload = $upload.upload({
                      url: 'photos/new',
                      method: 'POST',
                      data: angular.toJson($scope.personagem),
                      file: file
                  }).progress(function (evt) {
            //                            $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total, 10);
                        console.log( parseInt(100.0 * evt.loaded / evt.total, 10));
                  }).success(function (url) {
  
                      $scope.personagem.imageUrl = url.substring(6);
                     
                      PersonagemService.salvar($scope.personagem, function(err, personagemComCOdigo){
                          if (!err) {
                              $mdDialog.show(
                                $mdDialog.alert()
                                  .parent(angular.element(document.body))
                                  .title('Atenção')
                                  .content('Operação realiado com sucesso.')
                                  .ok('ok')
                               );   
                          }
                          else{
                               $mdDialog.show(
                                $mdDialog.alert()
                                  .parent(angular.element(document.body))
                                  .title('Atenção')
                                  .content('Falha na operação.')
                                  .ok('ok')
                               );                                 
                          }
                        });
                      });
                    }
                    else{
                                  $mdDialog.show(
                                $mdDialog.alert()
                                  .parent(angular.element(document.body))
                                  .title('Atenção')
                                  .content('Operação realiado com sucesso.')
                                  .ok('ok'));
                        }

                  }
                  else{
                               $mdDialog.show(
                                $mdDialog.alert()
                                  .parent(angular.element(document.body))
                                  .title('Atenção')
                                  .content('Falha na operação.')
                                  .ok('ok')
                               );                          
                  }
               });
            }
            else{
                               $mdDialog.show(
                                $mdDialog.alert()
                                  .parent(angular.element(document.body))
                                  .title('Atenção')
                                  .content('Falha na operação.')
                                  .ok('ok')
                               );   
            }
        });
    };

    $scope.onFileSelect = function ($files) {
        $scope.uploadProgress = 0;
        $scope.selectedFile = $files;
    };    

    $scope.apagar = function(){

        var confirm = $mdDialog.confirm()
          .title('Deseja realmente apagar esse personagem?')
          .content('Todos os dados serão perdidos.')
          .ok('ok')
          .cancel('cancelar');
          
      $mdDialog.show(confirm).then(function() {
                PersonagemService.apagar($scope.personagem._id, function(err, response){
                    if (!err) {
                               $mdDialog.show(
                                $mdDialog.alert()
                                  .parent(angular.element(document.body))
                                  .title('Atenção')
                                  .content('Personagem apagado.')
                                  .ok('ok')
                               );   

                        $window.location.href = '/home#/editar/aventura/' + $cookieStore.get('aventura');

                    }
                    else{
                               $mdDialog.show(
                                $mdDialog.alert()
                                  .parent(angular.element(document.body))
                                  .title('Atenção')
                                  .content('Falha na operação.')
                                  .ok('ok')
                               );   
                    }
                });
          });          

                 
    };    

};

var AventuraCtrl  = function ($scope, $modal, $cookieStore, $stateParams, $socket, $location,$mdDialog, AventuraService, PersonagemService){

    $scope.aventura = {};
    $scope.aventuras = {};
    $scope.personagens = {};
    $cookieStore.remove('aventura');

    if ($stateParams.id) {
        AventuraService.obter($stateParams.id, function(err, response){
            if (!err) {
                $cookieStore.put('aventura', $stateParams.id);
                $scope.aventura = response;

              
                
                carregarPersonagens();
            }
            else{
                               $mdDialog.show(
                                $mdDialog.alert()
                                  .parent(angular.element(document.body))
                                  .title('Atenção')
                                  .content('Falha na operação.')
                                  .ok('ok')
                               );   
            }
        });
    }
    else{

        var carregar = function(){

            AventuraService.todas($cookieStore.get('user')._id, function(err, response){
                if (!err) {
                    $scope.aventuras = response;
                }
                else{
                               $mdDialog.show(
                                $mdDialog.alert()
                                  .parent(angular.element(document.body))
                                  .title('Atenção')
                                  .content('Falha ao carregar dados.')
                                  .ok('ok')
                               );   
                }
            })
        };

        carregar();        
    }



    var carregarPersonagens = function(){

            PersonagemService.todas($cookieStore.get('aventura'), function(err, response){
                if (!err) {
                    $scope.personagens = response;
                }
                else{
                              $mdDialog.show(
                                $mdDialog.alert()
                                  .parent(angular.element(document.body))
                                  .title('Atenção')
                                  .content('Falha ao carregar dados.')
                                  .ok('ok')
                               );  
                }
            })
    };


    $scope.salvar = function(){
        $scope.aventura.usuario = $cookieStore.get('user')._id;
        AventuraService.salvar($scope.aventura, function(err, aventura){
            if (!err) {
                $cookieStore.put('aventura', aventura._id);
                              $mdDialog.show(
                                $mdDialog.alert()
                                  .parent(angular.element(document.body))
                                  .title('Atenção')
                                  .content('Aventura salva!')
                                  .ok('ok')
                               );     
            }
            else{
                              $mdDialog.show(
                                $mdDialog.alert()
                                  .parent(angular.element(document.body))
                                  .title('Atenção')
                                  .content('Falha ao salvar dados.')
                                  .ok('ok')
                               );  
            }
        });
    };

    $scope.permiteAdicionarPersonagem = function(){
        var aventuraID = $scope.aventura.usuario = $cookieStore.get('aventura');

        if (aventuraID) {
            return true;
        }
        else{
            return false;
        }
    };

    $scope.aumentaCaracteristica = function(prop, personagem){

        personagem[prop]++;
        personagem.imageUrl = $scope.getImageUrl(personagem);
        PersonagemService.salvar(personagem,  function(err, response){
            if (!err) {
              $socket.emit('personagemAtualizado', personagem);        
            }
        });

    }

    $scope.getImageUrl = function(personagem){

      if (personagem.imageUrl) {
        return personagem.imageUrl;
      }
      else{
        return undefined;
      }
    }

    $scope.diminuiCaracteristica = function(prop, personagem){

        personagem[prop]--;
        personagem.imageUrl = $scope.getImageUrl(personagem);
        PersonagemService.salvar(personagem,  function(err, response){
            if (!err) {
              $socket.emit('personagemAtualizado', personagem);        
            }
        });

    }    

    $scope.apagar = function(aventura, ev){
      
              var confirm = $mdDialog.confirm()
          .title('Deseja realmente apagar essa aventuram?')
          .content('Todas fichas relacionadas a ela serão apagadas.')
          .ok('ok')
          .cancel('cancelar')
          .targetEvent(event);
          
      $mdDialog.show(confirm).then(function() {
                AventuraService.apagar(aventura._id, function(err, response){
                    if (!err) {
                              $mdDialog.show(
                                $mdDialog.alert()
                                  .parent(angular.element(document.body))
                                  .title('Atenção')
                                  .content('Aventura apagada.')
                                  .ok('ok')
                               );    

                        carregar();
                    }
                    else{
                              $mdDialog.show(
                                $mdDialog.alert()
                                  .parent(angular.element(document.body))
                                  .title('Atenção')
                                  .content('Falha ao apagar dados.')
                                  .ok('ok')
                               );  
                    }
                });
          });    
                      
    };
    
    $scope.go = function ( path ) {
      $location.path( path );
    };    
};

var DialogCtrl = function($scope, $modalInstance, message, title){
   $scope.message = message;
   $scope.title = title;

  $scope.ok = function () {
    $modalInstance.close('ok');
  };  
};

/**
 * Alerts Controller
 */
angular.module('Dashboard').controller('AlertsCtrl', ['$scope', AlertsCtrl]);

function AlertsCtrl($scope) {
    $scope.alerts = [
        { type: 'success', msg: 'Thanks for visiting! Feel free to create pull requests to improve the dashboard!' },
        { type: 'danger', msg: 'Found a bug? Create an issue with as many details as you can.' }
    ];

    $scope.addAlert = function() {
        $scope.alerts.push({msg: 'Another alert!'});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
}

/**
 * Loading Directive
 * @see http://tobiasahlin.com/spinkit/
 */
angular.module('Dashboard').directive('rdLoading', rdLoading);

function rdLoading () {
    var directive = {
        restrict: 'AE',
        template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
    };
    return directive;
};

/**
*Serices
*/
angular.module('Dashboard').factory("AventuraService", ["$http", aventuraService]);

function aventuraService($http){
    return{
        salvar:  function(aventura, callback) {
            $http.post('/api/aventura', aventura)
            .success(function(response) {
                console.log("aventura adicionada com sucesso!");
                callback(null, response);
            })
            .error(function(response) {
                console.log("error adding aventura!");
                callback("Cannot submit data!");
            });
        },

        todas: function(usuario, callback){
            $http.get('/api/aventuras/' + usuario)
            .success(function(response) {
                callback(null, response);
            })
            .error(function(response) {
                console.log("error adding aventura!");
                callback("Cannot get data!");
            });            
        },

        apagar: function(id, callback){
            $http.post('/api/aventura/' + id)
            .success(function(response) {
                callback(null, response);
            })
            .error(function(response) {
                callback("Cannot post data!");
            });            
        },

        obter: function(id, callback){
            $http.get('/api/aventura/' + id)
            .success(function(response) {
                callback(null, response);
            })
            .error(function(response) {
                callback("Cannot get data!");
            });            
        } 
    };
};

angular.module('Dashboard').factory("PersonagemService", ["$http", personagemService]);

function personagemService($http){
    return{
        salvar:  function(personagem, callback) {
            $http.post('/api/personagem', personagem)
            .success(function(response) {
                console.log("personagem adicionada com sucesso!");
                if(callback)
                    callback(null, response);
            })
            .error(function(response) {
                console.log("error adding personagem!");
                if(callback)
                    callback("Cannot submit data!");
            });
        },

        todas: function(aventura, callback){
            $http.get('/api/personagem/aventura/' + aventura)
            .success(function(response) {
                callback(null, response);
            })
            .error(function(response) {
                console.log("error getting personagem!");
                callback("Cannot get data!");
            });            
        },

        apagar: function(id, callback){
            $http.post('/api/personagem/' + id)
            .success(function(response) {
                callback(null, response);
            })
            .error(function(response) {
                callback("Cannot post data!");
            });            
        },

        obter: function(id, callback){
            $http.get('/api/personagem/' + id)
            .success(function(response) {
                callback(null, response);
            })
            .error(function(response) {
                callback("Cannot get data!");
            });            
        } 
    };
};


})();