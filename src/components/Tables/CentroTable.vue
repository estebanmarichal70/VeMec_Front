<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.nombre" placeholder="Nombre de Centro" style="width: 250px;" class="filter-item"
                @input="handleFilter"/>

      <el-select @change="handleFilter()" v-model="listQuery.codigo" placeholder="Código" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in codigos" :key="item.key" :label="item.key" :value="item.key"/>
      </el-select>

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

      <el-table-column label="Código" align="center" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.codigo }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Nombre" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.nombre }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Dirección" align="center" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.direccion }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Salas" align="center" min-width="130px">
        <template slot-scope="{row}">
          <router-link :to="`/sala/${row.id}`">
            <el-button size="mini" type="success">
              Ver Salas
            </el-button>
          </router-link>
        </template>
      </el-table-column>

      <el-table-column label="Acciones" align="center" min-width="230px">
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
        :model="centro"
        label-position="top"
        style="width: 80%; margin-left: 40px"
      >

        <el-form-item label="Nombre" prop="nombre">
          <el-input v-model="centro.nombre" />
        </el-form-item>

        <el-form-item>
          <el-form-item label="Departamento" prop="codigo">
            <el-select v-model="centro.codigo" placeholder="Seleccionar">
              <el-option
                v-for="item in codigos"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </el-form-item>

        <el-form-item label="Dirección" prop="direccion">
          <el-input v-model="centro.direccion" />
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
      centro: {
        nombre: '',
        codigo: '',
        direccion: ''
      },
      listQuery: {
        page: 1,
        limit: 10,
        codigo: null,
        nombre: null,
        direccion: null,
        sort: '+id'
      },
      codigos,
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'Ascendente', key: '+id' }, { label: 'Descendente', key: '-id' }],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Editar un centro',
        create: 'Crear un nuevo centro'
      },
      rules: {
        nombre: [{ required: true, message: 'Debe ingresar un nombre', trigger: 'blur' }],
        direccion: [{ required: true, message: 'Debe ingresar una dirección', trigger: 'blur' }],
        codigo: [{ required: true, message: 'Debe seleccionar un departamento', trigger: 'blur' }]
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
      await vemecServices.services.getCentros({
        page: this.listQuery.page,
        limit: this.listQuery.limit,
        nombre: this.listQuery.nombre,
        codigo: this.listQuery.codigo
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
      this.resetCentro()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const centroNuevo = {
            nombre: this.centro.nombre,
            codigo: this.centro.codigo,
            direccion: this.centro.direccion
          }
          vemecServices.services.createCentro(centroNuevo).then(res => {
            this.list.push(res.data)
            this.dialogFormVisible = false
            this.total++
            this.$notify({
              title: 'Éxito',
              message: 'Se creó el centro correctamente',
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
      this.centro.codigo = row.codigo
      this.centro.direccion = row.direccion
      this.centro.nombre = row.nombre
      this.centro.id = row.id

      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          vemecServices.services.updateCentro(this.centro, this.centro.id)
            .then(response => {
              this.list.forEach((item, index) => {
                if (item.id == response.data.id) {
                  this.list[index].codigo = response.data.codigo
                  this.list[index].nombre = response.data.nombre
                  this.list[index].direccion = response.data.direccion
                }
              })
              this.$notify({
                title: 'Éxito',
                message: 'Se actualizó el centro correctamente',
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
      await vemecServices.services.deleteCentro(this.rowToDelete.id)
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
          const tHeader = ['Id', 'Codigo', 'Nombre', 'Direccion']
          const filterVal = ['id', 'codigo', 'nombre', 'direccion']
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'Centros'
          })
          this.downloadLoading = false
        })
    },
    resetCentro() {
      this.centro = {
        nombre: '',
        direccion: '',
        codigo: null
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
    }
  }
}
</script>
