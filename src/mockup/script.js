var moment = require("moment");


const axios = require("axios");

const reportesApi = "http://localhost:8080/api/v1/reporte"

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function convertirFecha(unix_timestamp, formato) {
  moment.locale('es');
  return moment(unix_timestamp).format(formato);
}


async function script() {

  let data = {}

  let alertas = ["ROJO", "NARANJA", "AMARILLO", "VERDE"]

  while (true) {

    data = {
      presionMaxima: parseFloat(Math.random().toFixed(2) * 30),
      presionMinima:  parseFloat(Math.random().toFixed(2) * 2),
      volGas:  parseFloat(Math.random().toFixed(2)),
      frecGas:  parseFloat(Math.random().toFixed(2)),
      mezcla:  parseFloat(Math.random().toFixed(2)),
      humedadAire:  parseFloat(Math.random().toFixed(2)),
      tempEntrada:  parseFloat(Math.random().toFixed(2) * 50),
      tempSalida:  parseFloat(Math.random().toFixed(2) * 50),
      presionEntrada:  parseFloat(Math.random().toFixed(2) * 50),
      presionSalida:  parseFloat(Math.random().toFixed(2) * 50),
      alerta: alertas[(Math.random().toFixed(0) - 1) * 4],
      time: convertirFecha(new Date(), "YYYY-MM-DD HH:mm:ss"),
      ingreso: parseInt(Math.floor(Math.random() * 1000)  + 1),
      unidadPresion: "mBar",
      unidadTemp: "°C",
      unidadHumedad: "%",
      unidadFrecuencia: "veces/minuto",
      unidadVolumen: "cc"
    }
    axios.post(reportesApi, data).then(res => console.log("se acaba de ingresar un reporte")).catch(err => console.log(err))

    // espera 1 sec
    await sleep(500);
  }
}

script();
