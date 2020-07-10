<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>Información</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :height="'100px'" :width="'100px'" :hoverable="false">
          <div>Hola</div>
          <strong>{{ paciente.nombre }}</strong>
        </pan-thumb>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>Actualmente</span></div>
        <div class="user-bio-section-body" v-if="paciente.ingresos.length">
          <div class="text-muted" v-if="!paciente.ingresos[0].fechaEgreso">
            <el-badge v-if="paciente.ingresos[0].estado == 'ESTABLE' " :value="paciente.ingresos[0].estado" class="item" type="primary">
            </el-badge>
            <el-badge v-if="paciente.ingresos[0].estado == 'CRITICO' " :value="paciente.ingresos[0].estado" class="item" type="danger">
            </el-badge>
            <el-badge v-if="paciente.ingresos[0].estado == 'SANO' " :value="paciente.ingresos[0].estado" class="item" type="success">
            </el-badge>
            <el-badge v-if="paciente.ingresos[0].estado == 'INTERMEDIO' " :value="paciente.ingresos[0].estado" class="item" type="warning">
            </el-badge>
            <el-badge v-if="paciente.ingresos[0].estado == 'DIFUNTO' " :value="paciente.ingresos[0].estado" class="item" type="info">
            </el-badge>
          </div>
          <div class="text-muted" v-else>
              <el-badge value="Sin ingresar" class="item" type="primary"></el-badge>
          </div>
        </div>
        <div class="text-muted" v-else>
              <el-badge value="Sin ingresar" class="item" type="primary"></el-badge>
          </div>
      </div>

      <div class="user-skills user-bio-section" >
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>Patologías</span></div>
        <div class="user-bio-section-body" v-if="paciente.patologias">
          <div class="progress-item" >
            <ul>
              <li v-for="item in paciente.patologias.patologias" :key="item.key">
                {{ item.charAt(0).toUpperCase() + item.slice(1) }}
              </li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p>Sin patologias</p>
        </div>
      </div>
    </div>
  </el-card>
</template>


<script>
import PanThumb from '@/components/PanThumb'
export default {
  components: { PanThumb },
 props: [
    'paciente'
  ]
,
data(){
  return{
    dialogFormVisible: false,
    dialogStatus: '',
    textMap: {
        update: 'Editar una sala',
        create: 'Crear una nueva sala',
      },
      rules: {
        nombre: [{ required: true, message: 'Debe ingresar el nombre de la sala', trigger: 'blur' }],
        capacidad: [{ required: true, message: 'Debe ingresar una capacidad valida', trigger: 'blur' }]
      },
  }
},
metodhs:{
  handleCreate() {
      this.resetSala()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
}
}

</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
