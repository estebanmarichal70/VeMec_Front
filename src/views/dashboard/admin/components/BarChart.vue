<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
  import echarts from 'echarts'

  require('echarts/theme/macarons') // echarts theme
  import resize from './mixins/resize'

  import vemecServices from "@/api/vemecServices";
  const animationDuration = 6000;

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
        chart: null,
        porEdades: null
      }
    },
    beforeMount() {
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
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')

        this.chart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            top: 10,
            left: '2%',
            right: '2%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            data: ['0 a 9', '10 a 19', '20 a 29', '30 a 39', '40 a 49', '50 a 59', '60 a 69', '70 o más'],
            axisTick: {
              alignWithLabel: true
            }
          }],
          yAxis: [{
            type: 'value',
            axisTick: {
              show: false
            }
          }],
          series: [{
            name: 'Pacientes',
            type: 'bar',
            stack: 'vistors',
            barWidth: '60%',
            data: [
              this.porEdades.cero_a_nueve,
              this.porEdades.diez_a_diecinueve,
              this.porEdades.veinte_a_veintinueve,
              this.porEdades.treinta_a_treintainueve,
              this.porEdades.cuarenta_a_cuarentainueve,
              this.porEdades.cincuenta_a_cincuentainueve,
              this.porEdades.sesenta_a_sesentainueve,
              this.porEdades.mas_de_setenta,
            ],
            animationDuration
          }]
        })
      },
      async getData() {
        await vemecServices.services.contarPacientesPorEdad()
          .then(res => {
            this.porEdades = res.data;
            this.initChart();
          })
          .catch(err => {
            this.$notify({
              title: 'Ooops...',
              message: 'Ah ocurrido un error inesperado.',
              type: 'error',
              duration: 3000
            })
          })
      }
    }
  }
</script>
