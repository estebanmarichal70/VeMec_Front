<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nombre" placeholder="Nombre del Paciente" style="width: 250px;" class="filter-item"
                @input="handleFilter"/>
      
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
        Añadir
      </el-button>

      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >
        Exportar a Excel
      </el-button>

    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >

      <el-table-column label="Cedula" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Nombre" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span> {{ row.nombre }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Apellido" align="center">
        <template slot-scope="{row}">
          <span>{{ row.apellido }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Sexo" align="center"  width="70px">
        <template slot-scope="{row}">
          <span v-if="row.sexo == 'MASCULINO'">M</span>
          <span v-else>F</span>
        </template>
      </el-table-column>

      <el-table-column label="Edad" align="center">
        <template slot-scope="{row}">
          <span>{{ row.edad }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Informacion" align="center">
        <template slot-scope="{row}">
          <router-link :to="`/perfil/${row.id}`">
            <el-button size="mini" type="success">
              Ver Informacion
            </el-button>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="Acciones" align="center" width="230px">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Actualizar
          </el-button>
          
          <el-popconfirm
            confirmButtonText='Si, eliminar'
            confirmButtonType='danger'
            cancelButtonText='No, cancelar'
            cancelButtonType='success'
            icon="el-icon-info"
            iconColor="red"
            @onConfirm = deleteData(row,$index)
            title="Estas seguro que quieres eliminar?"
          >
            <el-button size="mini" type="danger" slot="reference">Eliminar</el-button>
          </el-popconfirm>
          
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" center width="40%" :visible.sync="dialogFormVisible">

      <el-form
        ref="dataForm"
        :rules="rules"
        :model="paciente"
        label-position="top"
        style="width: 80%; margin-left: 40px"
      >

        <el-form-item label="Cedula" prop="id">
          <el-input v-model="paciente.id" />
        </el-form-item>

        <el-form-item label="Nombre" prop="nombre">
          <el-input v-model="paciente.nombre" />
        </el-form-item>

        <el-form-item label="Apellido" prop="apellido">
          <el-input v-model="paciente.apellido" />
        </el-form-item>

        <el-form-item>
          <el-form-item label="Sexo" prop="sexo">
            <el-select v-model="paciente.sexo" placeholder="Seleccionar">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>

        <el-form-item label="Edad" prop="edad">
          <el-input v-model="paciente.edad" />
        </el-form-item>

        <el-form-item label="Patologias">
            <el-tag
            :key="tag"
            v-for="tag in paciente.patologias"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
            {{tag}}
        </el-tag>
        <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="mini"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm">
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ Nueva patologia</el-button>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">

        <el-button @click="dialogFormVisible = false">
          Cancelar
        </el-button>

        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirmar
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import debounce from 'lodash.debounce'
import vemecServices from '@/api/vemecServices'
import codigos from '@/constants/codigos'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      rowToDelete: null,
      indexToDelete: null,
      paciente: {
        id: '',
        nombre: '',
        apellido: '',
        edad:'',
        sexo:'',
        patologias:[]
      },
      //datos para tags de patologias
      dynamicTags: [],
      options: [{
          value: 'option1',
          label: 'Masculino'
      },{
          value: 'Option2',
          label: 'Femenino'
      }],
      inputVisible: false,
      inputValue: '',
    //
      listQuery: {
        page: 1,
        limit: 10,
        id: null,
        nombre: null,
        apellido: null,
        edad: null,
        sexo: null,
        sort: '+id'
      },
      codigos,
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'Ascendente', key: '+id' }, { label: 'Descendente', key: '-id' }],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Editar un paciente',
        create: 'Crear un nuevo paciente'
      },
      rules: {
        id: [{ required: true, message: 'Debe ingresar una cedula', trigger: 'blur' }],
        nombre: [{ required: true, message: 'Debe ingresar un nombre', trigger: 'blur' }],
        apellido: [{ required: true, message: 'Debe ingresar un apellido', trigger: 'blur' }],
        edad: [{ required: true, message: 'Debe ingresar un edad', trigger: 'blur' }],
        sexo: [{ required: true, message: 'Debe ingresar un sexo', trigger: 'blur' }],
      },
      downloadLoading: false
    }
  },
  mounted() {
    this.handleFilter = debounce(this.handleFilter, 300);
  },
  computed: {

  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      await vemecServices.services.getPacientes({
        page: this.listQuery.page,
        limit: this.listQuery.limit,
        nombre: this.listQuery.nombre,
        apellido: this.listQuery.apellido,
        edad: this.listQuery.edad,
        sexo: this.listQuery.sexo
      }).then(response => {
        this.list = response.data[2]
        this.total = response.data[1]
      }).catch(err => console.log(err))
      this.listLoading = false
    },
    async handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: 'Éxito',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    handleCreate() {
      this.resetPaciente()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
            const pacienteNuevo = {
                id: parseInt(this.paciente.id),
                nombre: this.paciente.nombre,
                apellido: this.paciente.apellido,
                edad: parseInt(this.paciente.edad),
                patologias: this.paciente.patologias,
            }
          console.log(this.paciente.sexo + " SESO");
            if(this.paciente.sexo == "option1"){
              pacienteNuevo.sexo = "MASCULINO";
            }
            else{
              pacienteNuevo.sexo = "FEMENINO";
            }
          vemecServices.services.createPaciente(pacienteNuevo).then(res => {
            this.list.push(res.data)
            this.dialogFormVisible = false
            this.total++
            this.$notify({
              title: 'Éxito',
              message: 'Se creó el paciente correctamente',
              type: 'success',
              duration: 3000
            })
          }).catch(err => {
            this.$notify({
              title: 'Error',
              message: 'Ocurrió un error al crear',
              type: 'error',
              duration: 3000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.paciente.id = parseInt(row.id)
      this.paciente.nombre = row.nombre
      this.paciente.apellido = row.apellido
      this.paciente.edad = parseInt(row.edad)
      this.paciente.sexo = row.sexo

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
            const pacienteModificado = {
            id: parseInt(this.paciente.id),
            nombre: this.paciente.nombre,
            apellido: this.paciente.apellido,
            edad: parseInt(this.paciente.edad)
          }
          if(this.paciente.sexo == "option1"){
              pacienteModificado.sexo = "MASCULINO";
            }
            else{
              pacienteModificado.sexo = "FEMENINO";
            }
          vemecServices.services.updatePaciente(pacienteModificado, this.paciente.id)
            .then(response => {
              this.list.forEach((item, index) => {
                if (item.id == response.data.id) {
                  this.list[index].id = response.data.id
                  this.list[index].nombre = response.data.nombre
                  this.list[index].apellido = response.data.apellido
                  this.list[index].edad = response.data.edad
                  this.list[index].sexo = response.data.sexo
                }
              })
              this.$notify({
                title: 'Éxito',
                message: 'Se actualizó el paciente correctamente',
                type: 'success',
                duration: 3000
              })
              this.dialogFormVisible = false
            }).catch(err => {
              this.$notify({
                title: 'Error',
                message: 'Ocurrió un error al actualizar',
                type: 'error',
                duration: 3000
              })
              this.dialogFormVisible = false
            })
        }
      })
    },
    async deleteData(row, index) {
      this.listLoading = true
      this.rowToDelete = row
      this.indexToDelete = index
      await vemecServices.services.deletePaciente(this.rowToDelete.id)
        .then(response => {
          if (response.data.status === 'SUCCESS') {
            this.total--
            this.$notify({
              title: 'Éxito',
              message: 'Se eliminó correctamente',
              type: 'success',
              duration: 3000
            })
            this.list.splice(this.indexToDelete, 1)
            } else {
              this.$notify({
                title: 'Error',
                message: 'Ocurrió un error al eliminar',
                type: 'error',
                duration: 3000
              })
            }
          }).catch(err => {
            this.$notify({
              title: 'Error',
              message: 'Ocurrió un error al eliminar',
              type: 'error',
              duration: 3000
            })
            this.listLoading = false
          })
      this.listLoading = false
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['Cedula', 'Nombre', 'Apellido', 'Edad', 'Sexo']
          const filterVal = ['cedula', 'nombre', 'apellido', 'edad', 'sexo']
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'Pacientes'
          })
          this.downloadLoading = false
        })
    },
    resetPaciente() {
      this.paciente = {
        id: null,
        nombre: '',
        apellido: '',
        edad: null,
        sexo: null,
        patologias: []
      }
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
          return v[j]
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },

    handleClose(tag) {
        this.paciente.patologias.splice(this.paciente.patologias.indexOf(tag), 1);
    },
    showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.paciente.patologias.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
