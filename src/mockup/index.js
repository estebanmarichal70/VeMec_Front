/** |----------------------|
    |  PRECARGA DE DATOS   |
    |----------------------|
    | node index.js        |
    |----------------------|
**/

"use strict";

var datos = require("./data");
var axios = require("axios");

let sobrecargaCentros = () => {

  datos.centros.forEach(value => {
     axios.post("http://192.168.1.102:8080/api/v1/centro", value)
      .then(response => {
        console.log(`Se agrego el centro ${value.nombre}`)
    }).catch(err => console.log(err))
  });

};


let sobrecargaSalas = () => {

  datos.salas.forEach(value => {
     axios.post("http://192.168.1.102:8080/api/v1/sala", value)
      .then(response => {
        console.log(`Se agrego la sala ${value.nombre}`)
      }).catch(err => console.log(err))
  });

}

let sobrecargaVemecs = () => {

  datos.vemecs.forEach(value => {
     axios.post("http://192.168.1.102:8080/api/v1/vemec", value)
      .then(response => {
        console.log(`Se agrego el vemec ${value.nombre}`)
      }).catch(err => console.log(err))
  });

}

let sobrecargaPacientes = () => {

  datos.pacientes.forEach(value => {
     axios.post("http://192.168.1.102:8080/api/v1/paciente", value)
      .then(response => {
        console.log(`Se agrego el paciente ${value.id}`)
      }).catch(err => console.log(err))
  });

}

let sobrecargaIngresos = () => {

  datos.ingresos.forEach(value => {
     axios.post("http://192.168.1.102:8080/api/v1/ingreso", value)
      .then(response => {
        console.log(`Se agrego el ingreso ${value.causa}`)
      }).catch(err => console.log(err))
  });

}

let sobrecargaReporte = () => {

  datos.reporte_1.forEach(value => {
     axios.post("http://192.168.1.102:8080/api/v1/reporte", value)
      .then(response => {
        console.log(`Se agrego el reporte`)
      }).catch(err => console.log(err))
  });

  datos.reporte_2.forEach(value => {
     axios.post("http://192.168.1.102:8080/api/v1/reporte", value)
      .then(response => {
        console.log(`Se agrego el reporte`)
      }).catch(err => console.log(err))
  });

}



sobrecargaCentros();
sobrecargaSalas();
sobrecargaVemecs();
sobrecargaPacientes();
sobrecargaIngresos();
sobrecargaReporte();
