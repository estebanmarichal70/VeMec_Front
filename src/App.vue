<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

let stompClient = null;

export default {
  name: "App",
  mounted() {
    this.$nextTick(() => {
      let socket = new SockJS("http://localhost:8080/alertas-api");
      stompClient = Stomp.over(socket);
      stompClient.connect({}, frame => {
        stompClient.subscribe("/alertas/reportes", val => {
          let mensaje = JSON.parse(val.body);
          switch (mensaje.reporte.alerta) {
            case "ROJO": {
              this.$notify({
                title: "URGENTE",
                message: `El paciente ${mensaje.paciente.nombre +
                  " " +
                  mensaje.paciente.apellido} esta en situacion grave.
                  Acudir a sala ${mensaje.sala.nombre} RAPIDO.
                `,
                type: "error",
                duration: 0
              });
              break;
            }
            case "AMARILLO": {
                this.$notify({
                title: "ATENCION",
                message: `El paciente ${mensaje.paciente.nombre +
                  " " +
                  mensaje.paciente.apellido} esta con alguna complicacion.
                  Acudir a sala ${mensaje.sala.nombre}.
                `,
                type: "info",
                duration: 0
              });
              break;
            }
            case "NARANJA": {
              this.$notify({
                title: "EMERGENCIA",
                message: `El paciente ${mensaje.paciente.nombre +
                  " " +
                  mensaje.paciente.apellido} esta con alguna complicacion.
                  Acudir a sala ${mensaje.sala.nombre} lo ANTES POSIBLE.
                `,
                type: "warning",
                duration: 0
              });
              break;
            }
          }
        });
      });
    });
  }
};
</script>
