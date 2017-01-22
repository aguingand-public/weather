angular.module('weather')
.controller('WeatherController', function(WeatherService) {
    var initCities = ['Paris','Strasourg','Marseille'];
    var data = {
        city:'', // variable contenant la ville courante à traiter
        cities: [],
        input: [
            {
                ph:'City name', //placeholder
                icon:'location_city',
                icon_color:'black-text',
                label:'',
                next_icon:'filter_list'
            },
            {
                ph:'search', //placeholder
                icon:'find_in_page',
                icon_color:'teal-text',
                label:'city name filter',
                next_icon:'location_city'
            }
        ],
        which_input:0,
        curinput:{}
    };
    var pause=150;//Ms (entre chaque requête)
    function add(city) {
        if(typeof city != 'undefined')
           data.city=city; 
        if(data.city.length==0)return;
        WeatherService.get_city(data.city)
         .then(function mySuccess(datas) {
            data.cities.push(datas);
        }, function myError(response) {
            Materialize.toast("Les données de "+city+" n'ont pas pu être chargées"
                             +"("+response.status+")");
        });
        data.city='';
    }
    function update(index) {
        WeatherService.get_city(data.cities[index].name)
         .then(function mySuccess(datas) {
            data.cities[index] = datas;
        }, function myError(response) {
            Materialize.toast("Les données de "+data.cities[index].name+" n'ont pas pu être chargées"
                             +"("+response.status+")");
        });
    }
    var ind=0;
    function refresh() {
        var t=0,i;
        for(i=0;i<data.cities.length;i++) {
            setTimeout(function(){update(ind);ind++},t);
            t+=pause;
        }
        setTimeout(function(){ind=0},t);
    }
    function init() {
        var t=0,
            supp; // temps supplémentaire pour l'intervalle après la 1ère requête
        initCities.forEach(function(city) {
            setTimeout(function(){add(city)},t);
            supp=(t==0?100:0);
            t+=pause+supp;
        })
    }
    
    function deleteAt(index) {
        data.cities.splice(index,1);
    }
    
    // met a jour au prochain type input
    function updateInput(incr) {
        if(typeof incr != 'undefined') {
            data.which_input+=incr;
            data.which_input%=2;
            data.city='';
        }
        data.curinput=data.input[data.which_input];
    }
    
    init();
    updateInput();
    
    angular.extend(this,{
        add:add,
        update:update,
        refresh:refresh,
        deleteAt:deleteAt,
        updateInput:updateInput,
        data:data
    });
})
.factory('WeatherService', function($http) {
    function weatherObj(json) {
        return {
            name:json.name,
            temperature:json.main.temp,
            humidity:json.main.humidity,
            pressure:json.main.pressure,
            icon:json.weather[0].icon,
            description:json.weather[0].description
        };
    }
    function get_city(name) {
        return $http.get('http://api.openweathermap.org/data/2.5/weather?q='
               +name+'&appid=f7f7f349aea9ca3ba7f9d8004b0ee927&units=metric')
               .then(function success(response) {
                   return weatherObj(response.data);
               },function(res){});
    }
  return {
      get_city:get_city
  }   
});