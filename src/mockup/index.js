/** |----------------------|
    |  PRECARGA DE DATOS   |
    |----------------------|
    | node index.js        |
    |----------------------|
**/

"use strict";

var datos = require("./data");

var vemecServices = require("../api/vemecServices");

let sobrecargaCentros = () => {

  datos.centros.forEach(value => {
    vemecServices.services.createCentro(value)
      .then(response => {
        console.log(`Se agrego el centro ${value.nombre}`)
    }).catch(err => console.log(err))
  });

};


let sobrecargaSalas = () => {

  datos.salas.forEach(value => {
    vemecServices.services.createSala(value)
      .then(response => {
        console.log(`Se agrego la sala ${value.nombre}`)
      }).catch(err => console.log(err))
  });

}

let sobrecargaVemecs = () => {

  datos.vemecs.forEach(value => {
    vemecServices.services.createVemec(value)
      .then(response => {
        console.log(`Se agrego el vemec ${value.nombre}`)
      }).catch(err => console.log(err))
  });

}

let sobrecargaPacientes = () => {

  datos.pacientes.forEach(value => {
    vemecServices.services.createPaciente(value)
      .then(response => {
        console.log(`Se agrego el paciente ${value.id}`)
      }).catch(err => console.log(err))
  });

}

let sobrecargaIngresos = () => {

  datos.ingresos.forEach(value => {
    vemecServices.services.createIngreso(value)
      .then(response => {
        console.log(`Se agrego el ingreso ${value.causa}`)
      }).catch(err => console.log(err))
  });

}

let sobrecargaReporte = () => {

  datos.reporte_1.forEach(value => {
    vemecServices.services.createReporte(value)
      .then(response => {
        console.log(`Se agrego el reporte`)
      }).catch(err => console.log(err))
  });

  datos.reporte_2.forEach(value => {
    vemecServices.services.createReporte(value)
      .then(response => {
        console.log(`Se agrego el reporte`)
      }).catch(err => console.log(err))
  });

}



sobrecargaReporte();
