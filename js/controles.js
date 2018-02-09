var app = angular.module('mio', ['ngRoute']);

app.config(['$routeProvider',
//*********************************************** CONFIGURACION PARA TEMPLATES *******************************************
 function ($routeProvider) {
     $routeProvider.
       when('/principal', {
           templateUrl: 'templates/inicio.html',
           controller: 'inicio'
       }).
       when('/nGasto', {
           templateUrl: 'templates/nGasto.html',
           controller: 'nGasto'
       }).
       when('/nEntrada', {
           templateUrl: 'templates/nEntrada.html',
           controller: 'nEntrada'
       }).
       when('/gastoInfo', {
             templateUrl: 'templates/gastosInfo.html',
             controller: 'infoGastos'
         }).
       when('/entradaInfo', {
             templateUrl: 'templates/entradasInfo.html',
             controller: 'infoEntradas'
         }).
       when('/compras', {
            templateUrl: 'templates/listaCompras.html',
            controller: 'shopping'
       }).
       when('/recordatorio', {
            templateUrl: 'templates/recordatorios.html',
            controller: 'remember'
       }).
       when('/config', {
           templateUrl: 'templates/config.html',
           controller: 'config'
       }).
       when('/ayuda', {
           templateUrl: 'templates/help.html',
           controller: 'help'
       }).
       otherwise({
           templateUrl: 'templates/inicio.html',
           controller: 'inicio'
       });
 }]);

app.controller('inicio', function ($scope, todoService, $filter, $window, $http) {
    //************************************** VARIABLES ********************************************************
    var deudas = 0;
    var entradas = 0;
    $scope.compra = [];
    //************************************** FUNCIONES SIMPLES ********************************************************
$scope.grafica = function () {
      'use strict';
        var salesChartCanvas = $("#salesChart").get(0).getContext("2d");
        // This will get the first returned node in the jQuery collection.
        var salesChart = new Chart(salesChartCanvas);
        var salesChartData = {
            labels: [],
            datasets: [
              {
                  label: "Persona",
                  fillColor: "rgb(210, 214, 222)",
                  strokeColor: "rgb(210, 214, 222)",
                  pointColor: "rgb(210, 214, 222)",
                  pointStrokeColor: "#c1c7d1",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgb(220,220,220)",
                  data: $scope.meses1
              }, {
                  label: "Sistema Completo",
                  fillColor: "rgba(60,141,188,0.9)",
                  strokeColor: "rgba(60,141,188,0.8)",
                  pointColor: "#3b8bba",
                  pointStrokeColor: "rgba(60,141,188,1)",
                  pointHighlightFill: "#fff",
                  pointHighlightStroke: "rgba(60,141,188,1)",
                  data: $scope.meses2
              }
            ]
        };
        var salesChartOptions = {
            showScale: true,
            scaleShowGridLines: false,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            scaleShowHorizontalLines: true,
            scaleShowVerticalLines: true,
            bezierCurve: true,
            bezierCurveTension: 0.3,
            pointDot: false,
            pointDotRadius: 4,
            pointDotStrokeWidth: 1,
            pointHitDetectionRadius: 20,
            datasetStroke: true,
            datasetStrokeWidth: 2,
            datasetFill: true,
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%=datasets[i].label%></li><%}%></ul>",
            maintainAspectRatio: true,
            responsive: true
        };
        salesChart.Line(salesChartData, salesChartOptions);
        var pieChartCanvas = $("#pieChart").get(0).getContext("2d");
        var pieChart = new Chart(pieChartCanvas);
        var PieData = [
          {
              value: entradas,
              color: "#f56954",
              highlight: "#f56954",
              label: "Deudas"

          },
          {
              value: deudas,
              color: "#00a65a",
              highlight: "#00a65a",
              label: "Entradas"
          }
        ];
        var pieOptions = {
            segmentShowStroke: true,
            segmentStrokeColor: "#fff",
            segmentStrokeWidth: 1,
            percentageInnerCutout: 50,
            animationSteps: 100,
            animationEasing: "easeOutBounce",
            animateRotate: true,
            animateScale: false,
            responsive: true,
            maintainAspectRatio: false,
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",
            tooltipTemplate: "<%=value %> <%=label%>" //texto para el grafico PIE
        };
        pieChart.Doughnut(PieData, pieOptions);
       }; 
    //************************************** FUNCIONES DE DATOS ********************************************************
function errorCB(err) {
    }
    $scope.buscar = function () {
        var db = window.openDatabase("Database", "1.0", "Cordova GASTOS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM GASTOS',
                           [],
                          function (tx, results) {
                              var len = results.rows.length;
                              deudas = results.rows.item(len - 1).name;
                              entradas = results.rows.item(len - 1).number;
                              document.getElementById("deuda").innerHTML = deudas;
                              document.getElementById("entrada").innerHTML = entradas;
                              $scope.$apply();
                              $scope.grafica();
                          },
                           errorCB);
        });
    };
    $scope.compras = function () {
        var compra = [];
        var db = window.openDatabase("Database", "1.0", "Cordova COMPRAS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM COMPRAS',
                          [],
                          function (tx, compras) {
                              $scope.numCompras = compras.rows.length;
                              var rowsCount = compras.rows.length;
                              if (rowsCount > 5)
                              { rowsCount = 5 };
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.compra[i] = compras.rows.item(i)
                              }
                              $scope.$apply();
                          },
                           errorCB);
        });
    };
    $scope.recordatorios = function () {
        $scope.records = [];
        var db = window.openDatabase("Database", "1.0", "Cordova RECORDATORIOS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM RECORDATORIOS',
                          [],
                          function (tx, recordatorios) {
                              var rowsCount = recordatorios.rows.length;
                              if (rowsCount > 5)
                              { rowsCount = 5 };
                              $scope.numrecords = recordatorios.rows.length;
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.records[i] = recordatorios.rows.item(i)
                              }
                              $scope.$apply();
                          },
                           errorCB);
        });
    };

    $scope.buscar();
    $scope.compras();
    $scope.recordatorios();
});
app.controller('nGasto', function ($scope, $filter, $window, $http) {
    //************************************** VARIABLES ********************************************************
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var today = dd + '/' + mm + '/' + yyyy;
    $scope.datos = [];
    var currentmoney = 0;
    var currentdebt = 0;
    $scope.tipoGasto = [];
    $scope.tipoGastos = []
    $scope.selectGasto = null;
    $scope.dato = getUrlVars()["modo"];
    //************************************** FUNCIONES SIMPLES ********************************************************
    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('='); vars.push(hash[0]); vars[hash[0]] = hash[1];
        }
        return vars;
    }
    function populateDB(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS GASTOS (id INTEGER PRIMARY KEY AUTOINCREMENT,fecha,tipo,monto,detalle,name,number)');
    }
    function errorCB(err) {
    };
    //************************************** FUNCIONES DE DATOS ********************************************************
    $scope.buscar = function () {
        var db = window.openDatabase("Database", "1.0", "Cordova GASTOS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM GASTOS',
                          [],
                          function (tx, results) {
                              var len = results.rows.length;
                              currentmoney = results.rows.item(len - 1).name;
                              currentdebt = results.rows.item(len - 1).number;
                              $scope.$apply();
                          },
                           errorCB);
        });
    };
    $scope.agregar = function () {
        var tipo = "a";
        var detalle = angular.copy($scope.selectGasto);
        var medio = document.getElementById("mediopago").value;
        var fecha = today;
        var monto = $scope.monto;
        if (medio == "tarjeta") {
            currentdebt = parseInt(currentdebt) + parseInt(monto);
        } else {
            currentmoney -= monto;
        }
        if ($scope.pagoDeudas) {
            detalle = "Pago de deudas";
            currentdebt = parseInt(currentdebt) - parseInt(monto);
        } else {
            if (detalle == null) {
                detalle = "Sin definir";
            };
        };
        var info = $scope.articulo;
        var fecha = today;
        var db = window.openDatabase("Database", "1.0", "Cordova GASTOS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO GASTOS (fecha,tipo,monto,detalle,name,number) VALUES ("' + fecha + '","' + tipo + '","' + monto + '","' + detalle + '","' + currentmoney + '","' + currentdebt + '")',
                          [],
                          function (tx, results) {
                              var rowsCount = results.rows.length;
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.datos[i] = results.rows.item(i)
                              }
                              $scope.$apply();
                              $scope.buscar();
                              $scope.limpiar();
                              $window.location.href = '#principal';
                          },
                           errorCB);
        });
    };
    $scope.iniciar = function () {
        if ($scope.dato != "a") {
            document.getElementById("menu1").click();
        };
        var db = window.openDatabase("Database", "1.0", "Cordova COMPRAS", 200000);
        db.transaction(populateDB, errorCB, $scope.buscar());
    };
    $scope.borrar = function (dato) {
        var id = dato.id;
        var res = confirm("¿Eliminar registro?");
        if (!res) { return };
        var db = window.openDatabase("Database", "1.0", "Cordova COMPRAS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM COMPRAS WHERE id= "' + id + '"',
                          [],
                          function (tx, results) {
                              var rowsCount = results.rows.length;
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.datos[i] = results.rows.item(i)
                              }
                              $scope.$apply();
                              $scope.datos = [];
                              $scope.buscar();
                              $scope.limpiar();
                          },
                           errorCB);
        });
    };
    $scope.limpiar = function () {
        $scope.articulo = "";
    };
    $scope.buscarGasto = function () {
        $scope.tipoGasto = [];
        var db = window.openDatabase("Database", "1.0", "Cordova TIPOGASTO", 200000);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM TIPOGASTO',
                          [],
                          function (tx, results) {
                              var rowsCount = results.rows.length;
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.tipoGasto[i] = results.rows.item(i)
                                  $scope.tipoGastos = angular.copy($scope.tipoGasto);
                              }
                              $scope.$apply();
                          },
                           errorCB);
        });
    };
    $scope.iniciar();
    $scope.buscarGasto()
});
app.controller('nEntrada', function ($scope, $filter, $window, $http) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var today = dd + '/' + mm + '/' + yyyy;
    $scope.datos = [];
    var currentmoney = 0;
    var currentdebt = 0;
    $scope.tipoEntrada = [];
    $scope.dato = getUrlVars()["modo"];
    //************************************** FUNCIONES SIMPLES ********************************************************
    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('='); vars.push(hash[0]); vars[hash[0]] = hash[1];
        }
        return vars;
    }
    function populateDB(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS GASTOS (id INTEGER PRIMARY KEY AUTOINCREMENT,fecha,tipo,monto,detalle,name,number)');
    }
    function errorCB(err) {
    };
    //************************************** FUNCIONES DE DATOS ********************************************************
    $scope.buscar = function () {
        var db = window.openDatabase("Database", "1.0", "Cordova GASTOS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM GASTOS',
                          [],
                          function (tx, results) {
                              var len = results.rows.length;
                              currentmoney = results.rows.item(len - 1).name;
                              currentdebt = results.rows.item(len - 1).number;
                              $scope.$apply();
                          },
                           errorCB);
        });
    };
    $scope.buscarEntrada = function () {
        var db = window.openDatabase("Database", "1.0", "Cordova TIPOENTRADA", 200000);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM TIPOENTRADA',
                          [],
                          function (tx, ganancia) {
                              var rowsCount = ganancia.rows.length;
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.tipoEntrada[i] = ganancia.rows.item(i)
                              }
                              $scope.$apply();
                          },
                           errorCB);
        });
    };
    $scope.agregar = function () {
        var tipo = "b";
        var detalle = angular.copy($scope.selectEntrada);
        var fecha = today;
        var monto = $scope.monto;
        currentmoney = parseInt(currentmoney) + parseInt(monto);
        if ($scope.deuda) {
            detalle = "Deuda";
            currentdebt = parseInt(currentdebt) + parseInt(monto);
        } else {
            if (detalle == null) {
                detalle = "Sin definir";
            }
        };
        var db = window.openDatabase("Database", "1.0", "Cordova GASTOS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO GASTOS (fecha,tipo,monto,detalle,name,number) VALUES ("' + fecha + '","' + tipo + '","' + monto + '","' + detalle + '","' + currentmoney + '","' + currentdebt + '")',
                         [],
                          function (tx, results) {
                              var rowsCount = results.rows.length;
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.datos[i] = results.rows.item(i)
                              }
                              $scope.$apply();
                              $scope.buscar();
                              $scope.limpiar();
                              $window.location.href = '#principal';
                          },
                           errorCB);
        });
    };
    $scope.iniciar = function () {
        if ($scope.dato != "a") {
            document.getElementById("menu1").click();
        };
        var db = window.openDatabase("Database", "1.0", "Cordova COMPRAS", 200000);
        db.transaction(populateDB, errorCB, $scope.buscar());
    };
    $scope.borrar = function (dato) {
        var id = dato.id;
        var res = confirm("¿Eliminar registro?");
        if (!res) { return };
        var db = window.openDatabase("Database", "1.0", "Cordova COMPRAS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM COMPRAS WHERE id= "' + id + '"',
                          [],
                          function (tx, results) {
                              var rowsCount = results.rows.length;
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.datos[i] = results.rows.item(i)
                              }
                              $scope.$apply();
                              $scope.datos = [];
                              $scope.buscar();
                              $scope.limpiar();
                          },
                           errorCB);
        });
    };
    $scope.limpiar = function () {
        $scope.articulo = "";
    };
    $scope.iniciar();
    $scope.buscarEntrada();

});
app.controller('infoGastos', function ($scope, $filter, $window, $http) {
    $scope.totales = 0;
    $scope.datos = [];
    $scope.buscar = function () {
        document.getElementById("menu1").click();
        var db = window.openDatabase("Database", "1.0", "Cordova GASTOS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM GASTOS WHERE tipo="a"',
                          [],
                          function (tx, results) {
                              var rowsCount = results.rows.length;
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.datos[i] = results.rows.item(i)
                                  $scope.totales += parseFloat($scope.datos[i].monto);
                              }
                              $scope.$apply();
                          },
                           errorCB);
        });
    };
    function errorCB(err) {
    };
    $scope.buscar();
});
app.controller('infoEntradas', function ($scope, $filter, $window, $http) {
    $scope.totales = 0;
    $scope.datos = [];
    $scope.buscar = function () {
        document.getElementById("menu1").click();
        var db = window.openDatabase("Database", "1.0", "Cordova GASTOS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM GASTOS WHERE tipo="b"',
                          [],
                          function (tx, results) {
                              var rowsCount = results.rows.length;
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.datos[i] = results.rows.item(i)
                                  $scope.totales += parseFloat($scope.datos[i].monto);
                              }
                              $scope.$apply();
                          },
                           errorCB);
        });
    };
    function errorCB(err) {
    };
    $scope.buscar();
});
app.controller('shopping', function ($scope, $filter, $window, $http) {
    //************************************** VARIABLES ********************************************************
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var today = dd + '/' + mm + '/' + yyyy;
    $scope.datos = [];
    $scope.dato = getUrlVars()["modo"];
    //************************************** FUNCIONES SIMPLES ********************************************************
    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('='); vars.push(hash[0]); vars[hash[0]] = hash[1];
        }
        return vars;
    }
    function errorCB(err) {
    };
    //************************************** FUNCIONES DE DATOS ********************************************************
    function populateDB(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS COMPRAS (id INTEGER PRIMARY KEY AUTOINCREMENT,fecha,detalle)');
    }
    $scope.buscar = function () {
        var db = window.openDatabase("Database", "1.0", "Cordova COMPRAS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM COMPRAS',
                          [],
                          function (tx, results) {
                              var rowsCount = results.rows.length;
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.datos[i] = results.rows.item(i)
                              }
                              $scope.$apply();
                          },
                           errorCB);
        });
    };
    $scope.agregar = function () {
        var info = $scope.articulo;
        var fecha = today;
        var db = window.openDatabase("Database", "1.0", "Cordova COMPRAS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO COMPRAS (fecha,detalle) VALUES ("' + fecha + '","' + info + '")',
                          [],
                          function (tx, results) {
                              var rowsCount = results.rows.length;
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.datos[i] = results.rows.item(i)
                              }
                              $scope.$apply();
                              $scope.buscar();
                              $scope.limpiar();
                          },
                           errorCB);
        });
    };
    $scope.iniciar = function () {
        if ($scope.dato != "a") {
            document.getElementById("menu1").click();
        };
        var db = window.openDatabase("Database", "1.0", "Cordova COMPRAS", 200000);
        db.transaction(populateDB, errorCB, $scope.buscar());
    };
    $scope.borrar = function (dato) {
        var id = dato.id;
        var res = confirm("¿Eliminar registro?");
        if (!res) { return };
        var db = window.openDatabase("Database", "1.0", "Cordova COMPRAS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM COMPRAS WHERE id= "' + id + '"',
                          [],
                          function (tx, results) {
                              var rowsCount = results.rows.length;
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.datos[i] = results.rows.item(i)
                              }
                              $scope.$apply();
                              $scope.datos = [];
                              $scope.buscar();
                              $scope.limpiar();
                          },
                           errorCB);
        });
    };
    $scope.limpiar = function () {
        $scope.articulo = "";
    };
    $scope.iniciar();
});
app.controller('remember', function ($scope, $filter, $window, $http) {
    //************************************** VARIABLES ********************************************************
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var today = dd + '/' + mm + '/' + yyyy;
    $scope.datos = [];
    $scope.dato = getUrlVars()["modo"];
    //************************************** FUNCIONES SIMPLES ********************************************************
    function getUrlVars() {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('='); vars.push(hash[0]); vars[hash[0]] = hash[1];
        }
        return vars;
    } function errorCB(err) {
    };
    //************************************** FUNCIONES DE DATOS ********************************************************
    function populateDB(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS RECORDATORIOS (id INTEGER PRIMARY KEY AUTOINCREMENT,fecha,detalle)');
    }
    $scope.buscar = function () {
        var db = window.openDatabase("Database", "1.0", "Cordova RECORDATORIOS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM RECORDATORIOS',
                          [],
                          function (tx, results) {
                              var rowsCount = results.rows.length;
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.datos[i] = results.rows.item(i)
                              }
                              $scope.$apply();
                          },
                           errorCB);
        });
    };
    $scope.recordar = function () {
        var info = $scope.recordatorio;
        var fecha = today;
        var db = window.openDatabase("Database", "1.0", "Cordova RECORDATORIOS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO RECORDATORIOS (fecha,detalle) VALUES ("' + fecha + '","' + info + '")',
                          [],
                          function (tx, results) {
                              var rowsCount = results.rows.length;
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.datos[i] = results.rows.item(i)
                              }
                              $scope.$apply();
                              $scope.buscar();
                              $scope.limpiar();
                          },
                           errorCB);
        });
    };
    $scope.iniciar = function () {
        if ($scope.dato != "a") {
            document.getElementById("menu1").click();
        };
        var db = window.openDatabase("Database", "1.0", "Cordova RECORDATORIOS", 200000);
        db.transaction(populateDB, errorCB, $scope.buscar());
    };
    $scope.limpiar=function(){
        $scope.recordatorio="";
    };
    $scope.borrar = function (dato) {
        var id = dato.id;
        var res = confirm("¿Eliminar registro?");
        if (!res) { return };
        var db = window.openDatabase("Database", "1.0", "Cordova COMPRAS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM RECORDATORIOS WHERE id= "' + id + '"',
                          [],
                          function (tx, results) {
                              var rowsCount = results.rows.length;
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.datos[i] = results.rows.item(i)
                              }
                              $scope.$apply();
                              $scope.datos = [];
                              $scope.buscar();
                              $scope.limpiar();
                          },
                           errorCB);
        });
    };
    $scope.iniciar();
});
app.controller('config', function ($scope, $filter, $window, $http) {
    $scope.tipoGasto = [];
    $scope.tipoEntrada = [];
    //************************************** FUNCIONES SIMPLES ********************************************************
    function errorCB(err) {
    };
    $scope.nuevoTipoGasto = function () {
        $scope.gasto = "";
        $('#frmTipoGasto').modal('show');
    };
    $scope.nuevoTipoEntrada = function () {
        $scope.entrada = "";
        $('#frmTipoEntrada').modal('show');
    };
    //************************************** FUNCIONES DE DATOS ********************************************************
    $scope.borrado = function () {
        var res = confirm("ESTA A PUNTO DE BORRAR LOS REGISTROS DE DINERO");
        if (!res) { return };

        var db = window.openDatabase("Database", "1.0", "Cordova GASTOS", 200000);
        db.transaction(function (tx) {
            tx.executeSql('DROP TABLE IF EXISTS GASTOS',
                          [],
                          function (tx, results) {
                              alert("Base de datos reiniciada. Se recomienda reiniciar la aplicacion.");
                          },
                           errorCB);
        });
    };
    $scope.iniciarGasto = function () {
        document.getElementById("menu1").click();
        var db = window.openDatabase("Database", "1.0", "Cordova TIPOGASTO", 200000);
        db.transaction(populateGasto, errorCB, $scope.buscarGasto());
    };
    $scope.iniciarEntrada = function () {
        var db = window.openDatabase("Database", "1.0", "Cordova TIPOENTRADA", 200000);
        db.transaction(populateEntrada, errorCB, $scope.buscarEntrada());
    };
    function populateGasto(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS TIPOGASTO (id INTEGER PRIMARY KEY AUTOINCREMENT,gasto)');
    }
    function populateEntrada(tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS TIPOENTRADA (id INTEGER PRIMARY KEY AUTOINCREMENT,entrada)');
    }
    $scope.buscarGasto = function () {
        var db = window.openDatabase("Database", "1.0", "Cordova TIPOGASTO", 200000);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM TIPOGASTO',
                          [],
                          function (tx, inversion) {
                              var rowsCount = inversion.rows.length;
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.tipoGasto[i] = inversion.rows.item(i)
                              }
                              $scope.$apply();
                          },
                           errorCB);
        });
    };
    $scope.buscarEntrada = function () {
        var db = window.openDatabase("Database", "1.0", "Cordova TIPOENTRADA", 200000);
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM TIPOENTRADA',
                          [],
                          function (tx, ganancia) {
                              var rowsCount = ganancia.rows.length;
                              for (var i = 0; i < rowsCount; i++) {
                                  $scope.tipoEntrada[i] = ganancia.rows.item(i)
                              }
                              $scope.$apply();
                          },
                           errorCB);
        });
    };
    $scope.agregarGasto = function () {
        var info = $scope.gasto;
        var db = window.openDatabase("Database", "1.0", "Cordova TIPOGASTO", 200000);
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO TIPOGASTO (gasto) VALUES ("' + info + '")',
                          [],
                          function (tx, results) {
                              $scope.$apply();
                              $scope.buscarGasto();
                              $('#frmTipoGasto').modal('hide');
                          },
                           errorCB);
        });
    };
    $scope.agregarEntrada = function () {
        var info = $scope.entrada;
        var db = window.openDatabase("Database", "1.0", "Cordova TIPOENTRADA", 200000);
        db.transaction(function (tx) {
            tx.executeSql('INSERT INTO TIPOENTRADA (entrada) VALUES ("' + info + '")',
                          [],
                          function (tx, results) {
                              $scope.$apply();
                              $scope.buscarEntrada();
                              $('#frmTipoEntrada').modal('hide');
                          },
                           errorCB);
        });
    };
    $scope.borrarTipoGasto = function (dato) {
        var id = dato.id;
        var res = confirm("¿Borrar registro?");
        if (!res) { return };
        var db = window.openDatabase("Database", "1.0", "Cordova TIPOGASTO", 200000);
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM TIPOGASTO WHERE id= "' + id + '"',
                          [],
                          function (tx, results) {
                              $scope.$apply();
                              $scope.tipoGasto = [];
                              $scope.buscarGasto();
                          },
                           errorCB);
        });
    };
    $scope.borrarTipoEntrada = function (entrada1) {
        var id = entrada1.id;
        var res = confirm("¿Borrar registro?");
        if (!res) { return };
        var db = window.openDatabase("Database", "1.0", "Cordova TIPOENTRADA", 200000);
        db.transaction(function (tx) {
            tx.executeSql('DELETE FROM TIPOENTRADA WHERE id= "' + id + '"',
                          [],
                          function (tx, results) {
                              $scope.$apply();
                              $scope.tipoEntrada = [];
                              $scope.buscarEntrada();
                          },
                           errorCB);
        });
    };
    $scope.iniciarGasto();
    $scope.iniciarEntrada();
});
app.controller('help', function ($scope, $filter, $window, $http) {
    $scope.iniciar = function () {

    };
    $scope.iniciar();

});



app.service('todoService', function ($q) {
    this.getItems = function () {
        var deferred, result = [];
        deferred = $q.defer();
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS GASTOS (id INTEGER PRIMARY KEY AUTOINCREMENT,fecha,detalle,name,number)');
            tx.executeSql("SELECT * FROM GASTOS", [], function (tx, res) {
                for (var i = 0; i < res.rows.length; i++) {
                    result.push({ id: res.rows.item(i).id, todo: res.rows.item(i).todo })
                }
                deferred.resolve(result);
            });
        });
        return deferred.promise;
    },
    this.removeAll = function () {
    }
});