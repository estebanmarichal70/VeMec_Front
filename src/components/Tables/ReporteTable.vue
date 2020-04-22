<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.causa" placeholder="" style="width: 280px;" class="filter-item"
                @input="handleFilter"/>

      <!--<el-select @change="handleFilter()" v-model="listQuery.codigo" placeholder="Codigo" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in codigos" :key="item.key" :label="item.key" :value="item.key"/>
      </el-select>-->
      
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
        width="75"
        :class-name="getSortClass('id')"
      >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Presión Máxima" align="center" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.presionMaxima + row.unidadPresion}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Presión Mínima" align="center" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.presionMinima + row.unidadPresion}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Volumen Gas" align="center" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.volGas + row.unidadVolumen}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Frecuencia Gas" align="center" min-width="95px">
        <template slot-scope="{row}">
          <span>{{ row.frecGas + row.unidadFrecuencia}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Mezcla" align="center" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.mezcla + row.unidadHumedad}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Humedad Aire" align="center" min-width="85px">
        <template slot-scope="{row}">
          <span>{{ row.humedadAire + row.unidadHumedad}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Temperatura Entrada" align="center" min-width="110px">
        <template slot-scope="{row}">
          <span>{{ row.tempEntrada + row.unidadTemp}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Temperatura Salida" align="center" min-width="110px">
        <template slot-scope="{row}">
          <span>{{ row.tempSalida + row.unidadTemp}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Presion Entrada" align="center" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.presionEntrada + row.unidadPresion}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Presion Salida" align="center" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.presionSalida + row.unidadPresion}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Fecha" align="center" min-width="85px">
        <template slot-scope="{row}">
          <span>{{ parseFecha(row.time,'lll')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Acciones" align="center" width="200px">
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

    <el-dialog :title="textMap[dialogStatus]" align="center" width="40%" :visible.sync="dialogFormVisible">
        
        <el-form
        ref="dataForm"
    
        :model="reporte"
        label-position="top"
        style="width: 80%; margin-left: 40px"
      >

        <el-form-item label="Presion Maxima" prop="pmax">
            <el-input-number v-model="reporte.presionMaxima" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="Presion Minima" prop="pmin">
            <el-input-number v-model="reporte.presionMinima" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="Presion Entrada" prop="pe">
            <el-input-number v-model="reporte.presionEntrada" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="Presion Salida" prop="ps">
            <el-input-number v-model="reporte.presionSalida" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="Volumen Gas" prop="vg">
            <el-input-number v-model="reporte.volGas" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="Frecuencia gas" prop="fg">
            <el-input-number v-model="reporte.frecGas" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="Mazcla" prop="m">
            <el-input-number v-model="reporte.mezcla" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="Humedad Aire" prop="ha">
            <el-input-number v-model="reporte.humedadAire" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="Temperatura Entrada" prop="te">
            <el-input-number v-model="reporte.tempEntrada" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="Temperatura Salida" prop="ts">
            <el-input-number v-model="reporte.tempSalida" :precision="2" :step="0.1"></el-input-number>
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
import {convertirFecha} from '@/utils/index'

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
      ingresoID: null,
      reporte: {
          presionMaxima:'',
          presionMinima:'',
          volGas:'',
          frecGas:'',
          mezcla:'',
          humedadAire:'',
          tempEntrada:'',
          tempSalida:'',
          presionEntrada:'',
          presionSalida:'',
          unidadTemp:'',
          unidadHumedad:'',
          unidadFrecuencia:'',
          unidadVolumen:'',
          unidadPresion:''
      },
      listQuery: {
        page: 1,
        limit: 10,
        causa: null,
        sort: '+id'
      },
      codigos,
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'Ascendente', key: '+id' }, { label: 'Descendente', key: '-id' }],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Editar un Reporte',
        create: 'Crear un nuevo reporte'
      },
      rules: {
        nombre: [{ required: true, message: 'Debe ingresar un nombre', trigger: 'blur' }],
        direccion: [{ required: true, message: 'Debe ingresar una direccion', trigger: 'blur' }],
        codigo: [{ required: true, message: 'Debe seleccionar un departamento', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  mounted() {
    this.handleFilter = debounce(this.handleFilter, 300);
    this.ingresoID = this.$route.params.id
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      await vemecServices.services.getReportes({
        page: this.listQuery.page,
        limit: this.listQuery.limit,
        id: parseInt(this.ingresoID)
      }).then(response => {
        this.list = response.data[2]
        console.log(this.list);
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
              message: 'Se creó el reporte correctamente',
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
      this.reporte.presionMaxima = row.presionMaxima;
      this.reporte.presionMinima = row.presionMinima;
      this.reporte.frecGas = row.frecGas;
      this.reporte.volGas = row.volGas;
      this.reporte.mezcla = row.mezcla;
      this.reporte.humedadAire = row.humedadAire;
      this.reporte.tempEntrada = row.tempEntrada;
      this.reporte.tempSalida = row.tempSalida;
      this.reporte.presionEntrada = row.presionEntrada;
      this.reporte.presionSalida = row.presionSalida;
      this.reporte.unidadTemp = row.unidadTemp;
      this.reporte.unidadHumedad = row.unidadHumedad;
      this.reporte.unidadFrecuencia = row.unidadFrecuencia;
      this.reporte.unidadVolumen = row.unidadVolumen;
      this.reporte.unidadPresion = row.unidadPresion;

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
                message: 'Se actualizó el reporte correctamente',
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
    },
     parseFecha(unix_timestamp, formato){
      return convertirFecha(unix_timestamp, formato);
    }
  }
}
</script>
