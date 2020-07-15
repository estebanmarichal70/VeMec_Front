<template>
  <div class="app-container">
    <div class="filter-container">

      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="download"
      >
        Exportar a PDF
      </el-button>
    </div>
    <div ref="content">
      <el-card v-if="paciente && ingreso">
        <el-row>
          <el-col class="text-center">
            <h1 style="color: #0a76a4;">HISTORIA CLINICA</h1>
            <el-divider/>
            <h2 style="color: #5a5e66;">Datos del Paciente</h2>
            <h4 style="margin-top: 14px">
              <span style="color: #0a76a4">Cedula:</span> {{paciente.id}}
            </h4>
            <h4>
              <span style="color: #0a76a4">Nombre:</span> {{paciente.nombre + " " + paciente.apellido}}
            </h4>
            <h4>
              <span style="color: #0a76a4">Ingresado:</span> {{parseFecha(ingreso.fechaIngreso,'LLLL')}}
            </h4>
            <h4>
              <span style="color: #0a76a4">Motivo:</span> {{ingreso.causa}}
            </h4>
            <h4>
              <span style="color: #0a76a4">Estado:</span>
              <span v-if="ingreso.estado == 'ESTABLE' " class="item" style="color: #0a76a4;font-weight: bold;">
                Estable
              </span>
              <span v-if="ingreso.estado == 'CRITICO' " class="item" style="color: red; font-weight: bold;">
                Critico
              </span>
              <span v-if="ingreso.estado == 'SANO' " class="item" style="color: green; font-weight: bold;">
                Sano
              </span>
              <span v-if="ingreso.estado == 'INTERMEDIO' " class="item" style="color: orange; font-weight: bold;">
                Intermedio
              </span>
              <span v-if="ingreso.estado == 'DIFUNTO' " class="item" style="color: gray; font-weight: bold;">
                Difunto
              </span>
            </h4>
            <h4 v-if="ingreso.fechaEgreso">
              <span style="color: #0a76a4">Dado de alta:</span> {{parseFecha(ingreso.fechaEgreso,'LLLL')}}
            </h4>
          </el-col>
        </el-row>
        <el-divider/>
        <el-row>
          <el-col>
            <ul v-for="diagnostico in diagnosticos" v-if="ingreso">
              <li style="font-weight: bold; margin-bottom: 8px; margin-left: 25px;"> {{parseFecha(diagnostico.fecha,'LLLL')}}</li>
              <li style="list-style: none;">
                <ul style="margin-left: 50px;">
                  <li>Descripcion: {{diagnostico.motivos}}</li>
                  <li v-if="diagnostico.medico != null">Medico tratante: {{diagnostico.medico}}</li>
                  <li v-if="diagnostico.asistente != null">Asistente tratante: {{diagnostico.asistente}}</li>
                  <li>Medicacion: {{diagnostico.medicacion}}</li>
                  <li>Riesgo: <span v-if="diagnostico.riesgo == 'ALTO' " class="item"
                                    style="color: red; font-weight: bold">
                Alto
              </span>
                    <span v-if="diagnostico.riesgo == 'BAJO' " class="item" style="color: green; font-weight: bold">
                Bajo
              </span>
                    <span v-if="diagnostico.riesgo == 'MEDIO' " class="item" style="color: orange; font-weight: bold">
                Medio
              </span>
                  </li>
                </ul>
              </li>
              <el-divider/>
            </ul>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
  import {convertirFecha} from "@/utils";
  import jsPDF from 'jspdf'
  import VemecServices from '@/api/vemecServices'

  export default {
    name: "DiagnosticosPdf",
    data() {
      return {
        ingreso: null,
        paciente: null,
        downloadLoading: false,
        diagnosticos: []
      }
    },
    methods: {
      download() {
        const doc = new jsPDF();
        const contentHtml = this.$refs.content.innerHTML;
        doc.fromHTML(contentHtml, 15, 15, {
          width: 170
        });
        doc.save("historia.pdf");
      },
      parseFecha(unix_timestamp, formato) {
        return convertirFecha(unix_timestamp, formato);
      },
    },
    beforeMount() {
      if (this.$route.params.ingreso) {
        this.ingreso = this.$route.params.ingreso
        this.paciente = this.$route.params.paciente

        VemecServices.services.getAllDiagnosticosByIngreso(this.ingreso.id)
          .then(res => this.diagnosticos = res.data.diagnosticos)
          .catch(err => console.log(err))
      } else {
        this.$router.push('/paciente')
      }
    }

  }
</script>

<style lang="scss" scoped>
  .title-healthy {

  }
</style>
