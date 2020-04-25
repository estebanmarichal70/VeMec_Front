<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import vemecServices from '@/api/vemecServices'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      lista: null,
      chart: null
    }
  },
  mounted() {
    this.getData();
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    async getData(){
      await vemecServices.services.getCountAllByEstado()
      .then(response =>{
        this.lista = response.data;
        this.initChart(this.lista);
      })
      .catch(err => {
        this.$notify({
          title: 'Error',
          message: 'Ocurrió un error',
          type: 'error',
          duration: 3000
        })
      })
    },

    initChart(lista) {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: "Estado de los pacientes"
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Estable', 'Sano', 'Intermedio', 'Critico', 'Difunto']
        },
        color:[// sano , estable , intermedio , critico , difunto
          '#34CD59','#0b9ae7','#DADF34','#fbb90a','#D32803',
        ],
        series: [
          {
            name: 'Estados de los contagiados',
            type: 'pie',
            roseType: 'radius',
            radius: [35, 85],
            center: ['50%', '38%'],
            data: [
              { value: this.lista.cant_sano, name: 'Sano' },
              { value: this.lista.cant_estable ? this.lista.cant_estable : null, name: 'Estable' },
              { value: this.lista.cant_intermedio ? this.lista.cant_intermedio : null, name: 'Intermedio' },
              { value: this.lista.cant_critico ? this.lista.cant_critico : null, name: 'Critico' },
              { value: this.lista.cant_difunto ? this.lista.cant_difunto : null, name: 'Difunto' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
