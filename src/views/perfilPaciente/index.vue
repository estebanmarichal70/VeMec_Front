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
                <activity v-if="pase" :salas="salas" :paciente="paciente"/>
              </el-tab-pane>
              <el-tab-pane label="Ingresos" name="ingresos">
                <Ingresos v-if="pase" :paciente="paciente" :salas="salas" />
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
      pase: false,
      activeTab: 'actividad',
      paciente: null,
      salas: [],
      listQuery: {
          page: 1,
          limit: 10,
          paciente: null
        }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  mounted() {
    this.listQuery.paciente = this.$route.params.id
    this.getPaciente();
  },
  methods: {
    async getPaciente() {
      this.listLoading = true
      vemecServices.services.getPacienteByID(this.listQuery.paciente)
      .then(response => {
        this.paciente = response.data;
          vemecServices.services.getIngresos({
            page: 1,
            limit: 99999999,
            id: '',
            idP: parseInt(this.paciente.id)
          }).then(res => {
            this.paciente.ingresos = res.data[2];
            this.getSalas();
          }).catch(err => console.log(err))
      }).catch(err => console.log(err))
      this.listLoading = false
    },
    parseFecha(unix_timestamp, formato){
      return convertirFecha(unix_timestamp, formato);
    },
    async getSalas(){
      this.pase = true;
      this.listLoading = true;
      for(let index in this.paciente.ingresos){
        await vemecServices.services.salaIngreso(this.paciente.ingresos[index].id)
        .then(response => {
          this.salas.push(response.data);
        })
        .catch(err => console.log(err))
      }
      this.listLoading = false
    }
  }
}
</script>
