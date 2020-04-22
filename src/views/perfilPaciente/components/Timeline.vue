<template>
  <div class="block">
      <div class="block">
    <el-timeline>
      <el-timeline-item v-for="(item,index) of ingresos " :timestamp="convertirFecha(item.fechaIngreso)" :key="index" placement="top">
        <el-card>
          <p><strong> Causa: </strong>{{ item.causa }}</p>
          <strong>Estado: </strong><el-badge v-if="item.estado == 'ESTABLE' " :value="item.estado" class="item" type="primary">
          </el-badge>
          <el-badge v-if="item.estado == 'CRITICO' " :value="item.estado" class="item" type="warning">
          </el-badge>
          <p><strong>Vemec: </strong>{{ item.vemec.id }}</p>
          <p><strong>Sala: </strong>Falta Buscar la sala</p>
          <p><strong>Fecha de alta: </strong><p v-if="item.fechaEgreso">{{ item.fechaEgreso }}</p><p v-else> Internado </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
  </div>
</template>

<script>

import moment from 'moment'

export default {
  props: [
    'paciente'
  ],
  data(){
    return{
      ingresos: null
    }
  },
  mounted(){
    this.ingresos = this.paciente.ingresos;
  },
  methods: {
    convertirFecha(unix_timestamp){
      moment.locale('es'); 
      return moment(unix_timestamp).format('LLLL');
    }
  }
}
</script>