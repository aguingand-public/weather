angular.module('weather')
.config(function($urlRouterProvider,$stateProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
    .state('home',{
        url:'/',
        //template: '<p> AAA</p>',
        templateUrl:'partials/home.html',
        //controller:'WeatherController as ctrl',
        /*resolve: {
            city_list: function() {}
        }*/
    })
    .state('city', {
        url:'/:name',
        templateUrl:'partials/city.html',
        controller:'WeatherController as ctrl',
        /*resolve : {
            city_forecast : function(WeatherService,$stateParams) {
                return WeatherService.get_forecast($stateParams);
            }
        }*/
    });
});