<template>
  <el-dialog title="Agregar nuevo diagnóstico" center width="40%" :visible.sync="dialogOpened">
    <el-form
      ref="dataFormNewDiagnostic"
      label-position="top"
      style="width: 80%; margin-left: 40px"
    >

      <div style="display: flex; justify-content: center">
        <el-radio-group v-model="cargo">
          <el-radio-button label="Médico"></el-radio-button>
          <el-radio-button label="Asistente"></el-radio-button>
        </el-radio-group>
      </div>

      <el-form-item style="margin-top: 22px" prop="nombre">
        <el-input :placeholder="`Nombre del ${cargo === 'Médico' ? 'Médico' : 'Asistente'}`" v-model="nombreTratante"/>
      </el-form-item>

      <el-form-item style="margin-top: 22px" prop="descripcion">
        <el-input type="textarea" placeholder="Descripción del diagnóstico"
                  v-model="descripcion"/>
      </el-form-item>

      <el-form-item style="margin-top: 22px" prop="riesgo">
        <el-select v-model="riesgo" placeholder="Nivel de riesgo">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="medicacion">
        <el-input placeholder="Medicación" v-model="medicacion"/>
      </el-form-item>

      <div class="block">
        <el-date-picker
          v-model="fecha"
          style="width: 250px"
          type="datetime"
          placeholder="Selecciona la fecha y hora">
        </el-date-picker>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogOpened = false">
        Cancelar
      </el-button>
      <el-button @click="createDiagnostic" type="primary">
        Confirmar
      </el-button>
    </div>
  </el-dialog>
</template>

<script>

  import VemecServices from "../../api/vemecServices";

  export default {
    name: "DialogDiagnostico",
    data() {
      return {
        cargo: 'Médico',
        fecha: '',
        nombreTratante: '',
        descripcion: '',
        dialogOpened: false,
        options: [{
          value: 'BAJO',
          label: 'Bajo'
        }, {
          value: 'MEDIO',
          label: 'Medio'
        }, {
          value: 'ALTO',
          label: 'Alto'
        }],
        riesgo: '',
        medicacion: ''
      }
    },
    props: ['dialogFormVisible', 'ingreso'],
    watch: {
      dialogFormVisible(value) {
        this.dialogOpened = this.dialogFormVisible
      },
      dialogOpened(value) {
        this.$emit('update:dialogFormVisible', this.dialogOpened)
      }
    },
    methods: {
      createDiagnostic() {

        let fecha = (this.fecha.getFullYear() + '-' + (this.fecha.getMonth() + 1) + '-' + this.fecha.getDate()) + " " + this.fecha.getHours() + ':' + this.fecha.getMinutes() + ':' + this.fecha.getSeconds();

        let data = {
          motivo: this.descripcion,
          fecha,
          medicacion: this.medicacion,
          riesgo: this.riesgo,
          ingreso: this.ingreso
        }


        if (this.cargo === "Médico") data['medico'] = this.nombreTratante
        else data['asistente'] = this.nombreTratante

        console.log(data)

        VemecServices.services.createNewDiagnostico(data)
          .then(res => {
          this.resetDiagnostic();
          this.$notify({
              title: 'Éxito',
              message: 'Se creó el diagnóstico correctamente',
              type: 'success',
              duration: 3000
            })
          })
          .catch(err => this.$notify({
              title: 'Error',
              message: 'Ocurrió un error al crear diagnóstico',
              type: 'error',
              duration: 3000
            }))
      },
      resetDiagnostic(){
        this.dialogOpened = false
        this.cargo = 'Médico'
        this.fecha = ''
        this.nombreTratante = ''
        this.descripcion = ''
        this.riesgo = ''
        this.medicacion = ''
      }
    }
  }
</script>

<style scoped>

</style>
