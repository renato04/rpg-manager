angular.module('app', ['ui.bootstrap']);

var MainController = function($scope, $modal) {

  var usuario = {};
  usuario.areas = [];

  $scope.usuario = usuario;

  $scope.openArea = function () {

    var modalInstance = $modal.open({
      templateUrl: 'area.html',
      controller: AreaModalInstanceCtrl
    });

    modalInstance.result.then(function (area) {
      $scope.usuario.areas.push(area);

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.openBox = function (area) {

    var modalInstance = $modal.open({
      templateUrl: 'box.html',
      controller: BoxModalInstanceCtrl
    });

    modalInstance.result.then(function (box) {
      area.boxes.push(box);

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };  

  $scope.openItem = function (box) {

    var modalInstance = $modal.open({
      templateUrl: 'item.html',
      controller: ItemModalInstanceCtrl
    });

    modalInstance.result.then(function (item) {
      box.items.push(item);

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };  

  $scope.ok = function () {
    modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    modalInstance.dismiss('cancel');
  };  
};

var AreaModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.area = {};
  $scope.area.boxes = [];

  $scope.ok = function () {
    $modalInstance.close($scope.area);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

var BoxModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.box = {};
  $scope.box.items = [];

  $scope.ok = function () {
    $modalInstance.close($scope.box);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};

var ItemModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.item = {};

  $scope.ok = function () {
    $modalInstance.close($scope.item );
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};