<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card v-if="paciente" :paciente="paciente" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Actividad" name="actividad">
                <activity v-if="paciente" :paciente="paciente" :salas="salas"/>
              </el-tab-pane>
              <el-tab-pane label="Ingresos" name="ingresos">
                <Ingresos v-if="paciente" :paciente="paciente" :salas="salas" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Ingresos from './components/TimeLine'
import Account from './components/Account'
import vemecServices from '@/api/vemecServices'

export default {
  components: { UserCard, Activity, Ingresos, Account },
  data() {
    return {
      user: {},
      activeTab: 'actividad',
      paciente: null,
      ingresos: [],
      salas: [],
      listQuery: {
          page: 1,
          limit: 10,
          paciente: null,
          nombre: '',
          apellido: '',
          edad: null
        }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
    this.listQuery.paciente = this.$route.params.id
    this.getPaciente();
  },
  methods: {
    async getPaciente() {
      this.listLoading = true
      await vemecServices.services.getPacienteByID(this.listQuery.paciente)
      .then(response => {
        this.paciente = response.data;
        this.ingresos = this.paciente.ingresos;
        this.getSalas();
      }).catch(err => console.log(err))
      this.listLoading = false
    },
    parseFecha(unix_timestamp, formato){
      return convertirFecha(unix_timestamp, formato);
    },
    getSalas(){
      this.listLoading = true;
      for(let index in this.ingresos){
        vemecServices.services.salaIngreso(this.ingresos[index].id)
        .then(response => {
          this.salas.push(response.data);
        })
        .catch(err => console.log(err))
          this.listLoading = false
      }
    }
  }
}
</script>
