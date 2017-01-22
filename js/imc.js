var app=angular.module('bmi',[])
.controller('DataController',function($filter) {
//ATTR
//  ~public
    var data = { // données courante de l'utilisateur (taille,poid,imc)
        height:160,weight:60,bmi:0,units:'i',result:''
    }
    
//  ~private
    var hconv,wconv; // var. local de la taille converti en mètre
    
//METHODS
//  ~public
    // calcul de l'imc
    function compute() { 
        if(data.units=='i') {
            hconv=data.height/100;
            data.bmi=tronquer(data.weight/(hconv*hconv), 1);
        }
        else if(data.units=='m') {
            hconv=data.height*12; //feet->inches
            wconv=data.weight*703; //lbs
            data.bmi=tronquer(wconv/(hconv*hconv),1);
        }
        
        if(isNaN(data.bmi)||!isFinite(data.bmi))
            data.bmi=0;
    }
    
    // mettre à jour les données après le changement d'unité
    function unitChange() {
        swap(data.units);
    }
    
//  ~private
    // Inverser l'unité des données entrées
    function swap(units) {
        units=(units=='m'?'i':'m');
        data.height=$filter('heightfilter')(data.height,units);
        data.weight=$filter('weightfilter')(data.weight,units);
    }

//CALLS
    compute();
    setTimeout(function(){$('select').material_select();},0);
    
    // -- association des élements public au contrôleur --
    angular.extend(this,{
        data:data,
        compute:compute,
        unitChange:unitChange
        });
})
.filter('heightfilter', function() {
    return function(input, unit) {
        var res;
        if(unit=='i')res = (input/100)*3.2808;
        else if(unit=='m')res = input*100*0.3048;
        return tronquer(res, 2);
    }
})
.filter('weightfilter', function() {
    return function(input, unit) {
        var res;
        if(unit=='i')res = input/0.45359237;
        else if(unit=='m')res = input/2.2046;
        return tronquer(res, 2);
    }
})
.filter('resultfilter', function() {
    return function(input) {
        if(input < 18.5) return 'are Underweight';
        if(input < 25) return 'have a Normal weight';
        if(input < 30) return 'are Overweight';
        if(input < 35) return 'are Obese (class I)';
        if(input < 40) return 'are Obese (class II)';
        return 'have an Extreme Obesity (class III)';
    }
})
.filter('unitFilter', function() {
    return function(unit, type) {
        if(type=='h') {
            if(unit=='i')return 'ft';
            if(unit=='m')return 'cm';
        }
        if(type=='w') {
            if(unit=='i')return 'lb';
            if(unit=='m')return 'kg';
        }
    }
})
.filter('classFilter',function() {
    return function(input) {
        if(input < 18.5) return 'blue';
        if(input < 25) return 'green';
        if(input < 30) return 'amber';
        if(input < 35) return 'orange';
        if(input < 40) return 'red';
        return 'red darken-4';
    }
});

app.filter('unitFilterInit', function(unitFilterFilter) {
    return function(unit, type) {
        return unitFilterFilter(unit=='m'?'i':'m',type);
    }
});

function tronquer(f,d) { // tronquer à la décimal d
     var dec=Math.pow(10,d);
     return Math.round(f*dec)/dec;
}