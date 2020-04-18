var centros = require("./Centros.json");

var salas = require("./Salas.json");
var vemecs = require("./Vemecs.json");
var pacientes = require("./Pacientes.json");
var ingresos = require("./Ingreso.json");

var reporte_1 = require("./Reporte.json");
var reporte_2 = require("./Reporte_2.json");

let datos = {
  centros,
  salas,
  vemecs,
  pacientes,
  ingresos,
  reporte_1,
  reporte_2
}

module.exports = datos;
