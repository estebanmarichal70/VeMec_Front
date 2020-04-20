<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nombre" placeholder="Nombre de Sala" style="width: 200px;" class="filter-item"
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
      <el-table-column
        label="ID"
        prop="id"
        sortable="custom"
        align="center"
        width="80"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Nombre" align="center" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.nombre }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Capacidad" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.capacidad }}</span>
        </template>
      </el-table-column>
      <el-table-column label="VeMecs" align="center">
        <template slot-scope="{row}">
          <el-button slot="reference" type="success" @click="getVemecs(row), dialogMainVemec = true" >Lista de VeMecs</el-button>
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList()" />

    <el-dialog title="Lista de VeMecs" align="center" width="70%" :visible.sync="dialogMainVemec">
        <el-button class="filter-item" type="primary" icon="el-icon-edit" style="margin-bottom: 10px" @click="handleCreateVemec">
          Añadir
        </el-button>
        <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownloadV"
      >
        Exportar a Excel
      </el-button>
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="listV"
          border
          fit
          highlight-current-row
          style="width: 100%;"
        >
        <el-table-column
          label="ID"
          prop="id"
          sortable="custom"
          align="center"
          width="80"
        >
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Nombre" align="center" min-width="120px">
          <template slot-scope="{row}">
            <span>{{ row.marca }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Modelo" align="center" min-width="120px">
          <template slot-scope="{row}">
            <span>{{ row.modelo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Estado" align="center" min-width="100px">
          <template slot-scope="{row}">
            <span v-if="row.estado">Ocupado</span>
            <span v-if="!row.estado">Desocupado</span>
          </template>
        </el-table-column>
        <el-table-column label="Acciones" align="center" width="230px">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdateVemec(row)">
              Actualizar
            </el-button>
            <el-popconfirm
              confirmButtonText='Si, eliminar'
              confirmButtonType='danger'
              cancelButtonText='No, cancelar'
              cancelButtonType='success'
              icon="el-icon-info"
              iconColor="red"
              @onConfirm = deleteDataVemec(row,$index)
              title="Estas seguro que quieres eliminar?"
            >
              <el-button size="mini" type="danger" slot="reference">Eliminar</el-button>
            </el-popconfirm>
          </template>
      </el-table-column>
    </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMainVemec = false">
          Atras
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" center width="40%" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
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
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" center  width="40%" :visible.sync="dialogVemec">
      <el-form
        ref="dataForm"
        :rules="rulesV"
        :model="vemec"
        label-position="top"
        style="width: 80%; margin-left: 40px"
      >
        <el-form-item label="Marca" prop="marca">
          <el-input v-model="vemec.marca" />
        </el-form-item>
        <el-form-item label="Modelo" prop="modelo">
          <el-input v-model="vemec.modelo" />
        </el-form-item>
        <el-form-item label="Estado" prop="estado">
          <el-select v-model="vemec.estado" placeholder="Seleccione el estado">
            <el-option
              v-for="item in opciones"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>   
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVemec = false">
          Cancelar
        </el-button>

        <el-button type="primary" @click="dialogStatus==='createV'?createDataVemec():updateDataVemec()">
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
      dialogVemec: false,
      dialogMainVemec: false,
      tempName: '',
      tableKey: 0,
      list: null,
      listV: null,
      salaId: '',
      salas: null,
      total: 0,
      listLoading: true,
      rowToDelete: null,
      indexToDelete: null,
      centroDefecto: null,
      sala: {
        nombre: '',
        capacidad: '',
        centro: ''
      },
      vemec: {
        sala: '',
        marca: '',
        modelo: '',
        estado: false,
      },
      opciones: [{
          value: false,
          label: 'Desocupado'
        }, {
          value: true,
          label: 'Ocupado'
        }],
      value: false,
      listQuery: {
        page: 1,
        limit: 10,
        centro: null,
        nombre: null,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],

      sortOptions: [{ label: 'Ascendente', key: '+id' }, { label: 'Descendente', key: '-id' }],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Editar una sala',
        create: 'Crear una nueva sala',
        updateV: 'Editar un VeMec',
        createV: 'Crear una nuevo VeMec'
      },
      rules: {
        nombre: [{ required: true, message: 'Debe ingresar el nombre de la sala', trigger: 'blur' }],
        capacidad: [{ required: true, message: 'Debe ingresar una capacidad valida', trigger: 'blur' }]
      },
      rulesV: {
        marca: [{ required: true, message: 'Debe ingresar una marca', trigger: 'blur' }],
        modelo: [{ required: true, message: 'Debe ingresar un modelo', trigger: 'blur' }],
        estado: [{ required: true, message: 'Debe ingresar un estado', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {

  },
  mounted(){
    this.handleFilter = debounce(this.handleFilter, 300);
  },
  beforeMount: function() {
    this.listQuery.centro = this.$route.params.id
    this.getList()
  },
  methods: {
    async getVemecs(row) {
      this.salaId = row.id
      this.listLoading = true
      await vemecServices.services.getSalaByID(row.id)
      .then(response => {
        this.salas = response.data
        this.listV = this.salas.vemecs
      }).catch(err => console.log(err))
      this.listLoading = false
    },
    async getList() {
      this.listLoading = true
      console.log(this.listQuery.nombre)
      console.log(this.listQuery.centro)
      await vemecServices.services.getSalas({
        page: this.listQuery.page,
        limit: this.listQuery.limit,
        nombre: this.listQuery.nombre,
        centro: this.listQuery.centro
      }).then(response => {
        console.log(response.data)
        this.list = response.data[2]
        this.total = response.data[1]
      }).catch(err => console.log(err))
      this.listLoading = false
    },
    async handleFilter() {
      this.listQuery.page = 1;
      this.getList()
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
      this.resetSala()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreateVemec() {
      this.resetVemec()
      this.vemec.sala = this.salaId;
      this.dialogStatus = 'createV'
      this.dialogVemec = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const salaNueva = {
            nombre: this.sala.nombre,
            capacidad: parseInt(this.sala.capacidad),
            centro: parseInt(this.centroDefecto.id)
          }
          vemecServices.services.createSala(salaNueva).then(res => {
            this.list.push(res.data)
            this.dialogFormVisible = false
            this.total++
            this.$notify({
              title: 'Éxito',
              message: 'Se creó la sala correctamente',
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
    createDataVemec() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const vemecNuevo = {
            sala: parseInt(this.vemec.sala),
            marca: this.vemec.marca,
            modelo: this.vemec.modelo,
            estado: this.vemec.estado
          }
          vemecServices.services.createVemec(vemecNuevo).then(res => {
            this.listV.push(res.data)
            this.dialogVemec = false
            this.$notify({
              title: 'Éxito',
              message: 'Se creo el VeMec correctamente',
              type: 'success',
              duration: 3000
            })
          }).catch(err => {
            this.$notify({
              title: 'Error',
              message: 'Ocurrió un error al crear el vemec',
              type: 'error',
              duration: 3000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.sala.nombre = row.nombre
      this.sala.capacidad = parseInt(row.capacidad)
      this.sala.id = parseInt(row.id)

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdateVemec(row) {
      this.vemec.marca = row.marca
      this.vemec.modelo = row.modelo
      this.vemec.id = parseInt(row.id)
      this.vemec.estado = row.estado

      this.dialogStatus = 'updateV'
      this.dialogVemec = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const salaModificada = {
            nombre: this.sala.nombre,
            capacidad: parseInt(this.sala.capacidad),
            centro: parseInt(this.centroDefecto.id)
          }
          vemecServices.services.updateSala(salaModificada, this.sala.id)
            .then(response => {
              this.list.forEach((item, index) => {
                if (item.id == response.data.id) {
                  this.list[index].nombre = response.data.nombre
                  this.list[index].capacidad = response.data.capacidad
                }
              })
              this.$notify({
                title: 'Éxito',
                message: 'Se actualizó la sala correctamente',
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
            }
            )
        }
      })
    },
    updateDataVemec() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const vemecModificado = {
            marca: this.vemec.marca,
            modelo: this.vemec.modelo,
            estado: this.vemec.estado
          }
          vemecServices.services.updateVemec(vemecModificado, this.vemec.id)
            .then(response => {
              this.listV.forEach((item, index) => {
                if (item.id == response.data.id) {
                  this.listV[index].marca = response.data.marca
                  this.listV[index].modelo = response.data.modelo
                  this.listV[index].estadi = response.data.estado
                }
              })
              this.$notify({
                title: 'Éxito',
                message: 'Se actualizó el VeMec correctamente',
                type: 'success',
                duration: 3000
              })
              this.dialogVemec = false
            }).catch(err => {
              this.$notify({
                title: 'Error',
                message: 'Ocurrió un error al actualizar',
                type: 'error',
                duration: 3000
              })
              this.dialogVemec = false
            }
            )
        }
      })
    },
    async deleteData(row, index) {
      this.listLoading = true
      this.rowToDelete = row
      this.indexToDelete = index
      await vemecServices.services.deleteSala(this.rowToDelete.id)
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
        })
      this.listLoading = false
    },
    async deleteDataVemec(row, index) {
      this.rowToDelete = row
      this.indexToDelete = index
      this.listLoading = true
      await vemecServices.services.deleteVemec(this.rowToDelete.id)
        .then(response => {
          if (response.data.status === 'SUCCESS') {
            this.$notify({
              title: 'Éxito',
              message: 'Se eliminó correctamente',
              type: 'success',
              duration: 3000
            })
            this.listV.splice(this.indexToDelete, 1)
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
        })
      this.listLoading = false
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['Id', 'Nombre de Sala', 'Capacidad']
          const filterVal = ['id', 'nombre', 'capacidad']
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'Salas'
          })
          this.downloadLoading = false
        })
    },
    handleDownloadV() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['Id', 'Marca', 'Modelo', 'Estado']
          const filterVal = ['id', 'marca', 'modelo', 'estado']
          const data = this.formatJsonV(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'VeMecs'
          })
          this.downloadLoading = false
        })
    },
    resetSala() {
      this.sala = {
        nombre: '',
        capacidad: ''
      }
    },
    resetVemec() {
      this.vemec = {
        marca: '',
        modelo: '',
        estado: false
      }
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
          return v[j]
      }))
    },
    formatJsonV(filterVal) {
      return this.listV.map(v => filterVal.map(j => {
          return v[j]
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
