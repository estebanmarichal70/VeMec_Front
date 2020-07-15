<template>
  <div class="app-container">
    <vs-row vs-justify="center">

      <vue-plyr ref="alert-player" style="display: none">
        <audio>
          <source src="@/assets/audio/alerta.mp3" type="audio/mp3"/>
        </audio>
      </vue-plyr>
      <vs-col style="margin-top: 16px; flex-direction: column;" vs-type="flex" v-if="pacientes.length <= 0"
              vs-justify="center" vs-align="center"
              vs-w="8">
        <h1 class="title-healthy">No hay pacientes con inconvenientes en la sala</h1>
        <img src="../../assets/img/healthy.png" alt="Imagen de saludable"/>
      </vs-col>

      <vs-col style="margin-top: 16px" v-else v-for="paciente in pacientes" v-bind:key="paciente.reporte.cedula"
              vs-type="flex"
              vs-justify="center" vs-align="center" vs-w="12">
        <vs-card :class="`${paciente.reporte.bateria ? 'fondo' : null }`">
          <vs-row style="margin-top: 4px">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
              <line-chart :chart-data="paciente.lineChartData"/>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
              <vs-col>
                <vs-divider position="center">
                  <h2>Datos del paciente</h2>
                </vs-divider>

                <vs-row vs-type="block">

                  <vs-col vs-type="flex" vs-justify="center" vs-w="6">

                    <vs-row vs-type="flex" vs-justify="center" class="col-der" vs-align="center"
                            style="flex-direction: column">

                      <!-- TEMPERATURA -->
                      <vs-row vs-type="flex" class="text-header" vs-justify="center">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          <span>Temp. Entrada</span>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          <span>Temp. Salida</span>
                        </vs-col>
                      </vs-row>
                      <vs-row class="text-important">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          {{paciente.reporte.tempEntrada.toFixed(2)}} {{paciente.reporte.unidadTemp}}
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          {{paciente.reporte.tempEntrada.toFixed(2)}} {{paciente.reporte.unidadTemp}}
                        </vs-col>
                      </vs-row>
                      <vs-divider></vs-divider>
                      <!-- ------------------------------------------------- -->
                      <!-- VOLUMEN GAS -->
                      <vs-row vs-type="flex" class="text-header" vs-justify="center">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          <span>Vol. Gas</span>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          <span>Frec. Gas</span>
                        </vs-col>
                      </vs-row>
                      <vs-row class="text-important">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          {{paciente.reporte.volGas.toFixed(2)}} {{paciente.reporte.unidadVolumen}}
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          {{paciente.reporte.frecGas.toFixed(2)}} {{paciente.reporte.unidadFrecuencia}}
                        </vs-col>
                      </vs-row>

                      <!-- ------------------------------------------------- -->
                      <!-- VOLUMEN GAS -->

                      <vs-divider></vs-divider>
                      <vs-row vs-type="flex" class="text-header" vs-justify="center">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          <span>Presion Min.</span>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          <span>Presion Max.</span>
                        </vs-col>
                      </vs-row>
                      <vs-row class="text-important">

                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          {{paciente.reporte.presionMinima.toFixed(2)}} {{paciente.reporte.unidadPresion}}
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          {{paciente.reporte.presionMaxima.toFixed(2)}} {{paciente.reporte.unidadPresion}}
                        </vs-col>
                      </vs-row>
                      <vs-divider></vs-divider>
                      <!------------------------------------------->
                      <!-- HUMEDAD MEZCLA-->
                      <vs-row vs-type="flex" class="text-header" vs-justify="center">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          <span>Mezcla</span>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          <span>Humedad</span>
                        </vs-col>
                      </vs-row>
                      <vs-row class="text-important">

                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          {{(paciente.reporte.mezcla * 100).toFixed(2)}} {{paciente.reporte.unidadHumedad}}
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          {{(paciente.reporte.humedadAire * 100).toFixed(2)}}
                          {{paciente.reporte.unidadHumedad}}
                        </vs-col>
                      </vs-row>
                      <vs-divider></vs-divider>
                    </vs-row>
                  </vs-col>
                  <!-- datos del paciente -->

                  <vs-col vs-type="flex" vs-justify="center" vs-w="6">
                    <vs-row vs-type="flex" vs-justify="center" class="col-der" style="flex-direction: column">
                      <!-- TEMPERATURA -->
                      <vs-row vs-type="flex" class="text-header" vs-justify="center">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          <span>Nombre</span>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          <span>Edad</span>
                        </vs-col>
                      </vs-row>

                      <vs-row class="text-important">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          {{paciente.person.nombre + " " + paciente.person.apellido}}
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          {{paciente.person.edad}}
                        </vs-col>
                      </vs-row>

                      <vs-divider></vs-divider>
                      <!-- ------------------------------------------------- -->
                      <!-- VOLUMEN GAS -->
                      <vs-row vs-type="flex" class="text-header" vs-justify="center">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          <span>Cedula</span>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          <span>Sexo</span>
                        </vs-col>
                      </vs-row>
                      <vs-row class="text-important">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          {{paciente.person.id}}
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          {{paciente.person.sexo}}
                        </vs-col>
                      </vs-row>
                      <vs-divider></vs-divider>
                      <vs-row vs-type="flex" class="text-header" vs-justify="center">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          <span>Usando Bateria</span>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          <span>Nivel de Bateria</span>
                        </vs-col>
                      </vs-row>
                      <vs-row class="text-important">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          {{paciente.reporte.bateria ? 'SI' : 'NO'}}
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                          {{paciente.reporte.bateria ? paciente.reporte.nivelBateria + "%" : '--'}}
                        </vs-col>
                      </vs-row>
                      <vs-divider id="divider"></vs-divider>
                      <vs-row vs-type="flex" class="text-header" vs-justify="center" vs-align="center">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                          <router-link :to="`/perfil/${paciente.person.id}`">
                            <el-button size="lg" type="primary">
                              Historial del Paciente
                            </el-button>
                          </router-link>
                        </vs-col>
                      </vs-row>
                      <vs-divider></vs-divider>
                    </vs-row>
                  </vs-col>
                </vs-row>
              </vs-col>
            </vs-col>
          </vs-row>

        </vs-card>
      </vs-col>
    </vs-row>
  </div>
</template>

<script>
  import SockJS from "sockjs-client";
  import {Stomp} from "@stomp/stompjs";
  import {convertirFechaParaGrafica} from '@/utils'
  import LineChart from "@/components/Charts/LinePpmChart/LineChart";
  import VuePlyr from 'vue-plyr'

  let stompClient = null;
  export default {
    name: "Monitoreo.vue",
    components: {
      LineChart,
      VuePlyr
    },
    data() {
      return {
        pacientes: [],
        stompClient: null,
        lineChartData: {
          ppm: [],
          fechas: []
        },
      }
    },
    methods: {
      playMusic() {

      },
      modifyChart(mensaje) {
        if (this.pacientes.length <= 0) {
          this.$refs['alert-player'].player.play();
          let fecha = this.parseFecha(mensaje.reporte.time, 'LT');

          let reporte = {
            ...mensaje.reporte,
            cedula: mensaje.paciente.id
          }

          let paciente = {
            lineChartData: {
              ppm: [reporte.ppm],
              fechas: [fecha]
            },
            reporte,
            person: mensaje.paciente
          }

          this.pacientes.push(paciente);

        } else {

          let reporte = {
            ...mensaje.reporte,
            cedula: mensaje.paciente.id
          }

          let paciente = this.pacientes.findIndex((paciente) => paciente.reporte.cedula === reporte.cedula)

          if (paciente !== -1) {
            if (this.pacientes[paciente].lineChartData.ppm.length >= 20) {
              this.pacientes[paciente].lineChartData.ppm.shift();
              this.pacientes[paciente].lineChartData.fechas.shift();
            }

            this.pacientes[paciente].lineChartData.ppm.push(reporte.ppm);
            let fecha = this.parseFecha(reporte.time, 'LT');
            this.pacientes[paciente].lineChartData.fechas.push(fecha);
            this.pacientes[paciente].reporte = reporte;

          } else {
            this.$refs['alert-player'].player.play();
            let fecha = this.parseFecha(reporte.time, 'LT');
            let paciente = {
              lineChartData: {
                ppm: [reporte.ppm],
                fechas: [fecha]
              },
              reporte,
              person: mensaje.paciente
            }
            this.pacientes.push(paciente);
          }
        }
      },
      parseFecha(unix_timestamp, formato) {
        return convertirFechaParaGrafica(unix_timestamp, formato);
      }
    },
    mounted() {
      this.lineChartData.fechas = [];
      this.lineChartData.ppm = [];
      this.$nextTick(() => {
        let socket = new SockJS("http://localhost:8080/alertas-api");
        this.stompClient = Stomp.over(socket);
        this.stompClient.connect({}, frame => {
          this.stompClient.subscribe("/alertas/reportes", val => {
            let mensaje = JSON.parse(val.body);

            if (parseInt(this.$route.params.id) === mensaje.sala.id) {
              console.log(mensaje);
              this.modifyChart(mensaje)
            }
          });
        });
      });
    },
    beforeDestroy() {
      this.stompClient.disconnect();
    }
  }
</script>

<style lang="scss">
  $font-family-sans-serif: "Montserrat", Helvetica, Arial, sans-serif !default;
  $font-family-serif: Georgia, "Times New Roman", Times, serif !default;
  $font-size-base: 14px !default;
  $theme-background: #f8f8f8;

  html {
    font-size: $font-size-base;
    height: 100%;
    width: 100%;
    line-height: 1.5;
    letter-spacing: 0.01rem;
  }

  body {
    font-family: $font-family-sans-serif;
    background: $theme-background;
    font-weight: 400;
    overflow-x: hidden;
    max-width: 100%;
    height: 100%;
    transition: background-color .3s ease;
  }

  #app {
    min-height: 100%;
  }

  .text-important {
    color: #3888fa;
    font-size: 18px;
    font-weight: bold;
  }

  .text-subtitle {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  .vs-divider {
    margin-bottom: 5px !important;
    margin-top: 20px !important;
  }

  .col-der {
    margin: auto 15px auto 15px !important;
  }

  .text-header {
    font-size: 14px;
  }

  .title-healthy {
    color: #5a5e66;
  }

  .fondo {
    background: #edfa38;
  }

  #divider {
    margin-bottom: 15px !important;
  }

</style>
