<template>
  <el-dialog title="Agregar nuevo diagnostico" center width="40%" :visible.sync="dialogOpened">
    <!--<el-form
      ref="dataFormNewDiagnostic"
      :rules="rules"
      :model="sala"
      label-position="top"
      style="width: 80%; margin-left: 40px"
    >
      <el-form-item label="Nombre" prop="nombre">
        <el-input v-model="sala.nombre" />
      </el-form-item>
      <el-form-item label="Capacidad" prop="capacidad">
        <el-input-number v-model="sala.capacidad" :min="1" :max="99"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">
        Cancelar
      </el-button>
      <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
        Confirmar
      </el-button>
    </div>-->
  </el-dialog>
</template>

<script>
  export default {
    name: "DialogDiagnostico",
    data() {
      return {
        dialogOpened: false
      }
    },
    props: ['dialogFormVisible'],
    watch: {
      dialogFormVisible(value) {
        this.dialogOpened = this.dialogFormVisible

      },
      dialogOpened(value) {
        this.$emit('update:dialogFormVisible', this.dialogOpened)
      }
    }
  }
</script>

<style scoped>

</style>
