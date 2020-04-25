<template>
  <div class="block">
      <div class="block">
    <el-timeline v-if="paciente.ingresos">
      <el-timeline-item  v-for="(item,index) of paciente.ingresos" :timestamp="parseFecha(item.fechaIngreso,'LLLL')" :key="index" placement="top">
        <el-card>
          <p><strong> Causa: </strong>{{ item.causa }}</p>
          <strong>Estado: </strong><el-badge v-if="item.estado == 'ESTABLE' " :value="item.estado" class="item" type="primary">
          </el-badge>
          <el-badge v-if="item.estado == 'CRITICO' " :value="item.estado" class="item" type="danger">
          </el-badge>
          <el-badge v-if="item.estado == 'SANO' " :value="item.estado" class="item" type="success">
          </el-badge>
          <el-badge v-if="item.estado == 'INTERMEDIO' " :value="item.estado" class="item" type="warning">
          </el-badge>
          <el-badge v-if="item.estado == 'DIFUNTO' " :value="item.estado" class="item" type="info">
          </el-badge>
          <p><strong>Vemec: </strong>{{ item.vemec.id }}</p>
          <p v-if="salas[index]"><strong>Sala: </strong>{{salas[index].nombre}}</p>
          <p><strong>Fecha de alta: </strong><span v-if="item.fechaEgreso">{{parseFecha(item.fechaEgreso,'LLLL')}}</span><span v-else> Internado </span></p>
          <router-link :to="`/reporte/${item.id}`">
            <el-button type="info" plain>
             Reportes
            </el-button>
          </router-link>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
  </div>
</template>

<script>

import vemecServices from '@/api/vemecServices'
import {convertirFecha} from '@/utils/index'

export default {
  props: [
    'paciente',
    'salas'
  ],
  data(){
    return{
    }
  },
  created(){
    
  },
  methods: {
    parseFecha(unix_timestamp, formato){
      return convertirFecha(unix_timestamp, formato);
    }
  }
}
</script>
