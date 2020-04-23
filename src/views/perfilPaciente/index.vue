<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card v-if="paciente" :paciente="paciente" :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Actividad" name="activity">
                <activity v-if="paciente" :paciente="paciente" />
              </el-tab-pane>
              <el-tab-pane label="Ingresos" name="ingresos">
                <Ingresos v-if="paciente" :paciente="paciente" />
              </el-tab-pane>
              <el-tab-pane label="Cuenta" name="account">
                <account :user="user" />
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
  name: 'Profile',
  components: { UserCard, Activity, Ingresos, Account },
  data() {
    return {
      user: {},
      activeTab: 'activity',
      paciente: null,
      sizeIngreso:'',
      estado:'',
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
      'avatar',
      'roles'
    ])
  },
  created() {
    this.getUser()
    this.listQuery.paciente = this.$route.params.id
    this.getPaciente()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        email: 'admin@test.com',
        avatar: this.avatar
      }
    },
    async getPaciente() {
      this.listLoading = true
      await vemecServices.services.getPacienteByID(this.listQuery.paciente)
      .then(response => {
        this.paciente = response.data;
        this.sizeIngreso = parseInt(this.paciente.ingresos.length)-1;

        if(this.sizeIngreso >= 0){
          this.estado = this.paciente.ingresos[(this.sizeIngreso)].estado;
        }
      }).catch(err => console.log(err))
      this.listLoading = false
    }
  }
}
</script>
