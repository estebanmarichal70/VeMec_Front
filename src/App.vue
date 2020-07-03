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
          console.log(mensaje);
        });
      });
    });
  }
};
</script>
