<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-paciente">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Pacientes
          </div>
          <count-to :start-val="0" :end-val="ingresosHoy" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-CoVid">
          <svg-icon icon-class="monitor-de-uci" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Vemecs Libres
          </div>
          <count-to v-if="vemecs.libres > 0" :start-val="0" :end-val="vemecs.libres" :duration="3000" class="card-panel-num" />
          <div v-if="vemecs.libres == 0" class="card-panel-num" >
            Ninguno libre
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-femenino">
          <svg-icon icon-class="femenino" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Femenino
          </div>
          <count-to :start-val="0" :end-val="cant_fem" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-masculino">
          <svg-icon icon-class="sexo"  class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            Masculino
          </div>
          <count-to :start-val="0" :end-val="cant_masc" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

import vemecServices from "../../../../api/vemecServices";

export default {
  components: {
    CountTo
  },
  data(){
    return{
      cant_fem: null,
      cant_masc: null,
      vemecs: {},
      pacientes: null,
      ingresosHoy: null
    }
  },
  methods: {
    async getData(){
      await vemecServices.services.contarPacientesPorSexo()
        .then(res => {
          this.cant_fem = res.data.cant_femenino;
          this.cant_masc = res.data.cant_masculino;
      }).catch(err => {
        this.$notify({
          title: 'Ooops...',
          message: 'Ah ocurrido un error inesperado.',
          type: 'error',
          duration: 3000
        })
      })

      await vemecServices.services.contarVemecs()
        .then(res => {
          this.vemecs = {...res.data};
        }).catch(err => {
          this.$notify({
            title: 'Ooops...',
            message: 'Ah ocurrido un error inesperado.',
            type: 'error',
            duration: 3000
          })
        })

      await vemecServices.services.contarPacientes()
        .then(res => {
          this.ingresosHoy = res.data;
        }).catch(err => {
          this.$notify({
            title: 'Ooops...',
            message: 'Ah ocurrido un error inesperado.',
            type: 'error',
            duration: 3000
          })
        })
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  },
  mounted() {
    this.getData();
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-paciente {
        background: #40c9c6;
      }

      .icon-CoVid {
        background: #36a3f7;
      }

      .icon-femenino {
        background: #f4516c;
      }

      .icon-masculino {
        background: #3a62d1
      }
    }

    .icon-paciente {
      color: #40c9c6;
    }

    .icon-CoVid {
      color: #36a3f7;
    }

    .icon-femenino {
      color: #f4516c;
    }

    .icon-masculino {
      color: #3a62d1
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
