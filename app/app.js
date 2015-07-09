var app = angular.module('MyApp', ['ngRoute', 'ui.bootstrap']);

app.config(function ($routeProvider) {

    $routeProvider.when('/', {
        templateUrl: '/app/views/home.html'
    });

    $routeProvider.when('/datepicker', {
        controller: 'DatePickerCtrl',
        templateUrl: '/app/views/datepicker.html'
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });
});

app.controller('DatePickerCtrl', function ($scope) {

    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    
    $scope.dateOptions = {
        class: 'datepicker'
    };
});
