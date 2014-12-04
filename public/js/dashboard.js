(function(){ 
angular.module('Dashboard', ['ui.bootstrap', 'ui.router', 'ngCookies']);
'use strict';

/**
 * Route configuration for the Dashboard module.
 */
angular.module('Dashboard').config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {

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
            url: '/ficha', 
            templateUrl: 'partial/ficha.html'
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
    .controller('MasterCtrl', ['$scope', '$cookieStore', MasterCtrl]);

function MasterCtrl($scope, $cookieStore) {
    
    $scope.user = $cookieStore.get('user');
    /**
     * Sidebar Toggle & Cookie Control
     *
     */
    var mobileView = 992;

    $scope.getWidth = function() { return window.innerWidth; };

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
}

var PersonagemCtrl = function($scope, $modal, $stateParams, $cookieStore, $window, PersonagemService) {
    $scope.personagem = {};

    if ($stateParams.id) {
        PersonagemService.obter($stateParams.id, function(err, personagem){
            if (!err) {
                $scope.personagem = personagem;
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
        PersonagemService.salvar($scope.personagem, function(err, personagem){
            if (!err) {
                var dialog = $modal.open({
                  templateUrl: 'partial/dialog.html',
                  controller: DialogCtrl,
                  resolve: {
                    message: function () {
                      return 'Personagem Salvo!';
                    },
                    title: function(){
                        return 'Atenção!';
                    }                    
                  }
                });    
            }
            else{
                var dialog = $modal.open({
                  templateUrl: 'partial/dialog.html',
                  controller: DialogCtrl,
                  resolve: {
                    message: function () {
                      return 'Falha ao salvar Personagem!';
                    },
                    title: function(){
                        return 'Atenção!';
                    }
                  }
                }); 
            }
        });
    };

    $scope.apagar = function(){
        var dialog = $modal.open({
          templateUrl: 'partial/confirm-dialog.html',
          controller: DialogCtrl,
          resolve: {
            message: function () {
              return 'Deseja realmente apagar esse personagem?';
            },
            title: function(){
                return 'Atenção!';
            }                    
          }
        });

        dialog.result.then(function (result) {
            if (result) {
                PersonagemService.apagar($scope.personagem._id, function(err, response){
                    if (!err) {
                        var dialog = $modal.open({
                          templateUrl: 'partial/dialog.html',
                          controller: DialogCtrl,
                          resolve: {
                            message: function () {
                              return 'Personagem apagada!';
                            },
                            title: function(){
                                return 'Atenção!';
                            }                    
                          }
                        });    

                        $window.location.href = '/home#/editar/aventura/' + $cookieStore.get('aventura');

                    }
                    else{
                        var dialog = $modal.open({
                          templateUrl: 'partial/dialog.html',
                          controller: DialogCtrl,
                          resolve: {
                            message: function () {
                              return 'Falha ao apagar aventura!';
                            },
                            title: function(){
                                return 'Atenção!';
                            }
                          }
                        }); 
                    }
                });
            }
        });                       
    };    

};

var AventuraCtrl  = function ($scope, $modal, $cookieStore, $stateParams, AventuraService, PersonagemService){

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
                var dialog = $modal.open({
                  templateUrl: 'partial/dialog.html',
                  controller: DialogCtrl,
                  resolve: {
                    message: function () {
                      return 'Falha ao carregar aventura!';
                    },
                    title: function(){
                        return 'Atenção!';
                    }
                  }
                }); 
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
                    var dialog = $modal.open({
                      templateUrl: 'partial/dialog.html',
                      controller: DialogCtrl,
                      resolve: {
                        message: function () {
                          return 'Falha ao listas aventuras!';
                        },
                        title: function(){
                            return 'Atenção!';
                        }
                      }
                    }); 
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
                    var dialog = $modal.open({
                      templateUrl: 'partial/dialog.html',
                      controller: DialogCtrl,
                      resolve: {
                        message: function () {
                          return 'Falha ao listas de personagens!';
                        },
                        title: function(){
                            return 'Atenção!';
                        }
                      }
                    }); 
                }
            })
    };


    $scope.salvar = function(){
        $scope.aventura.usuario = $cookieStore.get('user')._id;
        AventuraService.salvar($scope.aventura, function(err, aventura){
            if (!err) {
                $cookieStore.put('aventura', aventura._id);
                var dialog = $modal.open({
                  templateUrl: 'partial/dialog.html',
                  controller: DialogCtrl,
                  resolve: {
                    message: function () {
                      return 'Aventura salva!';
                    },
                    title: function(){
                        return 'Atenção!';
                    }                    
                  }
                });    
            }
            else{
                var dialog = $modal.open({
                  templateUrl: 'partial/dialog.html',
                  controller: DialogCtrl,
                  resolve: {
                    message: function () {
                      return 'Falha ao salvar aventura!';
                    },
                    title: function(){
                        return 'Atenção!';
                    }
                  }
                }); 
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

    $scope.apagar = function(aventura){
        var dialog = $modal.open({
          templateUrl: 'partial/confirm-dialog.html',
          controller: DialogCtrl,
          resolve: {
            message: function () {
              return 'Deseja realmente apagar essa aventura, todas fichas relacionadas a ela serão apagadas.';
            },
            title: function(){
                return 'Atenção!';
            }                    
          }
        });

        dialog.result.then(function (result) {
            if (result) {
                AventuraService.apagar(aventura._id, function(err, response){
                    if (!err) {
                        var dialog = $modal.open({
                          templateUrl: 'partial/dialog.html',
                          controller: DialogCtrl,
                          resolve: {
                            message: function () {
                              return 'Aventura apagada!';
                            },
                            title: function(){
                                return 'Atenção!';
                            }                    
                          }
                        });    

                        carregar();
                    }
                    else{
                        var dialog = $modal.open({
                          templateUrl: 'partial/dialog.html',
                          controller: DialogCtrl,
                          resolve: {
                            message: function () {
                              return 'Falha ao apagar aventura!';
                            },
                            title: function(){
                                return 'Atenção!';
                            }
                          }
                        }); 
                    }
                });
            }
        });                       
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
                callback(null, response);
            })
            .error(function(response) {
                console.log("error adding personagem!");
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