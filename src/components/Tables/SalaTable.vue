<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="Nombe de Sala"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-select v-model="listQuery.id" placeholder="Id" clearable class="filter-item" style="width: 130px">
        <el-option
          v-for="item in list"
          :key="item.id"
          :label="item.id"
          :value="item.id"
          @click="handleFilter(item.id)"
        />
      </el-select>

      <!--<el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>-->

      <!--<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        Buscar
      </el-button>-->

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
      <el-table-column label="Nombre" align="center" width="80px">
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
        <template>
          <el-button size="mini" type="success">
            <a href="" />VeMecs
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="Acciones" align="center" width="230px">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Actualizar
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Borrar
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form
        ref="dataForm"
        :rules="rules"
        :model="sala"
        label-position="left"
        style="width: 400px; margin-left:50px;"
      >

        <el-form-item label="Nombre" prop="nombre">
          <el-input v-model="sala.nombre" />
        </el-form-item>

        <el-form-item label="Capacidad" prop="nombre">
          <el-input v-model="sala.capacidad" />
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

    <el-dialog title="Estas seguro de que deseas eliminar la sala?" :visible.sync="dialogDeleteVisible">

      <el-form
        ref="deleteForm"
        :rules="deleteRules"
        :model="deleteConfirmation"
        label-position="left"
        style="width: 400px; margin-left:50px;"
      >

        <el-form-item label="Nombre" prop="nombre">
          <el-input v-model="tempName" />
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">

        <el-button @click="dialogDeleteVisible = false">
          Cancelar
        </el-button>

        <el-button type="primary" @click="deleteData()">
          Confirmar
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchPv, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
    var validateNombre = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again'))
      } else if (value !== this.rowToDelete.nombre) {
        callback(new Error('Debe coincidir con el nombre de la sala'))
      } else {
        callback()
      }
    }
    return {
      dialogDeleteVisible: false,
      tempName: '',
      tableKey: 0,
      list: null,
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
      deleteConfirmation: {
        nombre: ''
      },
      listQuery: {
        page: 1,
        limit: 10,
        id: null,
        nombre: null,
        capacidad: null,
        sort: '+id'
      },
      codigos,
      importanceOptions: [1, 2, 3],

      sortOptions: [{ label: 'Ascendente', key: '+id' }, { label: 'Descendente', key: '-id' }],
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Editar una sala',
        create: 'Crear una nueva sala'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        nombre: [{ required: true, message: 'Debe ingresar un nombre', trigger: 'blur' }],
        capacidad: [{ required: true, message: 'Debe ingresar una capacidad', trigger: 'blur' }]
      },
      deleteRules: {
        nombre: [{
          validator: validateNombre,
          message: 'Debe ingresar un nombre', trigger: 'blur'
        }]
      },
      downloadLoading: false
    }
  },
  computed: {

  },
  beforeMount: function() {
    const centroId = this.$route.params.id
    this.getListbyId(centroId)
  },
  methods: {
    async getListbyId(centroId) {
      this.listLoading = true
      await vemecServices.services.getCentroByID(centroId
      ).then(response => {
        this.centroDefecto = response.data
        this.list = this.centroDefecto.salas
      }).catch(err => console.log(err))
      this.listLoading = false
    },
    /* handleFilter(codigo) {
        this.listQuery.page = 1;
        this.defaultList = this.list;
        this.list.forEach((item, index) => {
          //if(item.codigo == codigo)

        });

      },*/
    handleModifyStatus(row, status) {
      this.$message({
        message: 'Success',
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
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetSala()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
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
            this.$notify({
              title: 'Success',
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
                title: 'Success',
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
    handleDelete(row, index) {
      this.rowToDelete = row
      this.indexToDelete = index
      this.dialogDeleteVisible = true
      this.$nextTick(() => {
        this.$refs['deleteForm'].clearValidate()
      })
    },
    async deleteData() {
      await vemecServices.services.deleteSala(this.rowToDelete.id)
        .then(response => {
          console.log(response.data.status)
          if (response.data.status === 'SUCCESS') {
            this.$notify({
              title: 'Success',
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
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['id', 'nombre', 'capacidad']
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
    resetSala() {
      this.centro = {
        nombre: '',
        capacidad: ''
      }
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
