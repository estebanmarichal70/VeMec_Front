var centros = require("./Centros.json");
var salas = require("./Salas.json");
var vemecs = require("./Vemecs.json");
var pacientes = require("./Pacientes.json");
var ingresos = require("./Ingresos.json");
var reportes = require("./Reportes.json");

let datos = {
  centros,
  salas,
  vemecs,
  pacientes,
  ingresos,
  reportes
}

module.exports = datos;
