/** |----------------------|
 |  PRECARGA DE DATOS   |
 |----------------------|
 | node index.js        |
 |----------------------|
 **/

"use strict";

var datos = require("./data");

const baseUrl = 'http://localhost:8080'
const basePath = '/api/v1'
const apiUrl = baseUrl + basePath
const axios = require('axios');

let username = "admin";
let password = "admin";

async function register() {
  await axios.post(apiUrl + "/auth/sign_up", {
    username,
    password
  })
    .then(response => {
      console.log("registrado");
    }).catch(err => console.log(err))
}


async function sobrecargaCentros() {

  let auth = {};

  await axios.post(apiUrl + "/auth/sign_in", {
    username,
    password
  })
    .then(response => {
      auth["token"] = response.data.token;
    }).catch(err => console.log(err))

  axios.defaults.headers.common['Authorization'] = "Bearer " + auth.token;
  for (let index in datos.centros) {
    await axios.post(apiUrl + "/centro", datos.centros[index])
      .then(response => {
        console.log(`Se agrego el centro ${datos.centros[index].nombre}`)
      }).catch(err => console.log(err))
  }
};

async function sobrecargaSalas() {

  let auth = {};

  await axios.post(apiUrl + "/auth/sign_in", {
    username,
    password
  })
    .then(response => {
      auth["token"] = response.data.token;
    }).catch(err => console.log(err))


  axios.defaults.headers.common['Authorization'] = "Bearer " + auth.token;
  for (let index in datos.salas) {
    await axios.post(apiUrl + "/sala", datos.salas[index])
      .then(response => {
        console.log(`Se agrego la sala ${datos.salas[index].nombre}`)
      }).catch(err => console.log(err))
  }
  ;

}

async function sobrecargaVemecs() {

  let auth = {};

  await axios.post(apiUrl + "/auth/sign_in", {
    username,
    password
  })
    .then(response => {
      auth["token"] = response.data.token;
    }).catch(err => console.log(err))

  axios.defaults.headers.common['Authorization'] = "Bearer " + auth.token;
  for (let index in datos.vemecs) {
    await axios.post(apiUrl + "/vemec", datos.vemecs[index])
      .then(response => {
        console.log(`Se agrego el vemec ${datos.vemecs[index].marca}`)
      }).catch(err => console.log(err))
  }
  ;

}

async function sobrecargaPacientes() {

  let auth = {};

  await axios.post(apiUrl + "/auth/sign_in", {
    username,
    password
  })
    .then(response => {
      auth["token"] = response.data.token;
    }).catch(err => console.log(err))

  axios.defaults.headers.common['Authorization'] = "Bearer " + auth.token;
  for (let index in datos.pacientes) {
    await axios.post(apiUrl + "/paciente", datos.pacientes[index])
      .then(response => {
        console.log(`Se agrego el paciente ${datos.pacientes[index].id}`)
      }).catch(err => console.log(err))
  }
  ;

}

async function sobrecargaIngresos() {

  let auth = {};

  await axios.post(apiUrl + "/auth/sign_in", {
    username,
    password
  })
    .then(response => {
      auth["token"] = response.data.token;
    }).catch(err => console.log(err))

  axios.defaults.headers.common['Authorization'] = "Bearer " + auth.token;
  for (let index in datos.ingresos) {
    await axios.post(apiUrl + "/ingreso", datos.ingresos[index])
      .then(response => {
        console.log(`Se agrego el ingreso ${datos.ingresos[index].causa}`)
      }).catch(err => console.log(err))
  }
  ;

}

async function sobrecargaReportes() {
  let auth = {};

  await axios.post(apiUrl + "/auth/sign_in", {
    username,
    password
  })
    .then(response => {
      auth["token"] = response.data.token;
    }).catch(err => console.log(err))

  axios.defaults.headers.common['Authorization'] = "Bearer " + auth.token;
  for (let index in datos.reportes) {
    await axios.post(apiUrl + "/reporte", datos.reportes[index])
      .then(response => {
        console.log(`Se agrego el reporte`)
      }).catch(err => console.log(err))
  }
}

async function cargarDatos(){
  await register();
  /*await sobrecargaCentros();
  await sobrecargaSalas();
  await sobrecargaVemecs();
  await sobrecargaPacientes();
  await sobrecargaIngresos();
  await sobrecargaReportes();
*/}

cargarDatos();
