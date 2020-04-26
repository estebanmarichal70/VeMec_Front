<template>
  <div class="app-container">
    <div class="filter-container">
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

      <el-button :disabled="grafica" class="filter-item" type="danger" @click="getListGrafica(), dialogGrafica = true" >
        Ver Grafica
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

      <el-table-column label="Presión Máxima" align="center" min-width="75px">
        <template slot-scope="{row}">
          <span>{{ row.presionMaxima + row.unidadPresion}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Presión Mínima" align="center" min-width="85px">
        <template slot-scope="{row}">
          <span>{{ row.presionMinima + row.unidadPresion}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Presión Entrada" align="center" min-width="85px">
        <template slot-scope="{row}">
          <span>{{ row.presionEntrada + row.unidadPresion}}</span>
        </template>
      </el-table-column>

      <el-table-column label="Presión Salida" align="center" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.presionSalida + row.unidadPresion}}</span>
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
        :rules="rules"
        :model="reporte"
        label-position="top"
        style="width: 80%; margin-left: 40px"
      >

        <el-form-item label="Presión Máxima/Mínima" prop="pmm">
            <el-input-number v-model="reporte.presionMaxima" :precision="2" :step="0.1"></el-input-number>
            <el-input-number v-model="reporte.presionMinima" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="Presión Entrada/Salida" prop="pe">
            <el-input-number v-model="reporte.presionEntrada" :precision="2" :step="0.1"></el-input-number>
            <el-input-number v-model="reporte.presionSalida" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="Temperatura Entrada/Salida" prop="te">
            <el-input-number v-model="reporte.tempEntrada" :precision="2" :step="0.1"></el-input-number>
            <el-input-number v-model="reporte.tempSalida" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="Volumen Gas" prop="vg">
            <el-input-number v-model="reporte.volGas" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="Frecuencia Gas" prop="fg">
            <el-input-number v-model="reporte.frecGas" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="Mezcla" prop="m">
            <el-input-number v-model="reporte.mezcla" :precision="2" :step="0.1"></el-input-number>
        </el-form-item>

        <el-form-item label="Humedad Aire" prop="ha">
            <el-input-number v-model="reporte.humedadAire" :precision="2" :step="0.1"></el-input-number>
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

     <el-dialog title="Grafica de los ultimos reportes" align="center" width="70%" :visible.sync="dialogGrafica">
        <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
          <line-chart :chart-data="lineChartData" />
        </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGrafica= false">
          Atras
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
import LineChart from './components/LineChart'

/*const lineChartData = {
  newVisitis: {
    expected: this.expected,
    actual: this.actual
  }
}*/

export default {
  name: 'ComplexTable',
  components: { Pagination , LineChart },
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
      lineChartData: {
        presionSalida:[],
        presionEntrada:[],
        fechas:[]
      },
      dialogGrafica: false,
      tableKey: 0,
      list: null,
      total: 0,
      grafica:true,
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
      listGrafica:'',
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'Ascendente', key: '+id' }, { label: 'Descendente', key: '-id' }],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Editar un Reporte',
        create: 'Crear un nuevo reporte'
      },
      rules: {
        pmax: [{ required: false, message: 'Debe ingresar una Presion Maxima', trigger: 'blur' }],
        pmin: [{ required: false, message: 'Debe ingresar una Presion Minima', trigger: 'blur' }],
        pe: [{ required: false, message: 'Debe seleccionar una Presion de Entrada', trigger: 'blur' }],
        ps: [{ required: false, message: 'Debe seleccionar una Presion de Salida', trigger: 'blur' }],
        vg: [{ required: false, message: 'Debe seleccionar una Volumen de Gas', trigger: 'blur' }],
        fg: [{ required: false, message: 'Debe seleccionar una Frecuncia de Gas', trigger: 'blur' }],
        m: [{ required: false, message: 'Debe seleccionar una Mezcla', trigger: 'blur' }],
        ha: [{ required: false, message: 'Debe seleccionar una Humedad Aire', trigger: 'blur' }],
        te: [{ required: false, message: 'Debe seleccionar una Temperatura Entrada', trigger: 'blur' }],
        ts: [{ required: false, message: 'Debe seleccionar una Temperatura Salida', trigger: 'blur' }]
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
     handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
     },
    async getList() {
      this.listLoading = true
      await vemecServices.services.getReportes({
        page: this.listQuery.page,
        limit: this.listQuery.limit,
        id: parseInt(this.ingresoID)
      }).then(response => {
        if(response.data[2].length >= 2){
          this.grafica = false;
        }
        else{
          this.grafica = true;
        }
        this.list = response.data[2]
        this.total = response.data[1]
      }).catch(err => console.log(err))
      this.listLoading = false
    },
    async getListGrafica() {
      this.listLoading = true
      this.lineChartData.fechas = [];
      this.lineChartData.presionSalida = [];
      this.lineChartData.presionEntrada = [];
      await vemecServices.services.getReportes({
        page: this.listQuery.page,
        limit: 50,
        id: parseInt(this.ingresoID)
      }).then(response => {
        this.listGrafica = response.data[2]
        this.listGrafica.forEach(item => {
         this.lineChartData.presionEntrada.push(item.presionEntrada);
         this.lineChartData.presionSalida.push(item.presionSalida);
         let fecha = this.parseFecha(item.time,'lll');
         this.lineChartData.fechas.push(fecha);
        })
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
      this.resetReporte()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let hoy = new Date();
          let fecha = (hoy.getFullYear() + '-' + (hoy.getMonth() +1) + '-' + hoy.getDate());
          let hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
          const reporteNuevo = {
              presionMaxima: parseFloat(this.reporte.presionMaxima.toFixed(2)),
              presionMinima: parseFloat(this.reporte.presionMinima.toFixed(2)),
              volGas: parseFloat(this.reporte.frecGas.toFixed(2)),
              frecGas: parseFloat(this.reporte.volGas.toFixed(2)),
              mezcla: parseFloat(this.reporte.mezcla.toFixed(2)),
              humedadAire: parseFloat(this.reporte.humedadAire.toFixed(2)),
              tempEntrada: parseFloat(this.reporte.tempEntrada.toFixed(2)),
              tempSalida: parseFloat(this.reporte.tempSalida.toFixed(2)),
              presionEntrada: parseFloat(this.reporte.presionEntrada.toFixed(2)),
              presionSalida: parseFloat(this.reporte.presionSalida.toFixed(2)),
              time: fecha +" "+ hora,
              ingreso: parseInt(this.ingresoID),
              alerta:''                 //FALTA VER TEMA DE ALERTA
          }
            
          vemecServices.services.createReporte(reporteNuevo).then(res => {
            this.list.push(res.data)
            this.dialogFormVisible = false
            this.total++
            if(this.total >= 2){
               this.grafica = false;
            }
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
      this.reporte.id = parseInt(row.id);
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
          let hoy = new Date();
          let fecha = (hoy.getDate() + '-' + (hoy.getMonth() +1) + '-' + hoy.getFullYear());
          let hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
          const reporteModificado = {
              presionMaxima: parseFloat(this.reporte.presionMaxima.toFixed(2)),
              presionMinima: parseFloat(this.reporte.presionMinima.toFixed(2)),
              volGas: parseFloat(this.reporte.frecGas.toFixed(2)),
              frecGas: parseFloat(this.reporte.volGas.toFixed(2)),
              mezcla: parseFloat(this.reporte.mezcla.toFixed(2)),
              humedadAire: parseFloat(this.reporte.humedadAire.toFixed(2)),
              tempEntrada: parseFloat(this.reporte.tempEntrada.toFixed(2)),
              tempSalida: parseFloat(this.reporte.tempSalida.toFixed(2)),
              presionEntrada: parseFloat(this.reporte.presionEntrada.toFixed(2)),
              presionSalida: parseFloat(this.reporte.presionSalida.toFixed(2)),
              time: fecha +" "+ hora,
              alerta:''               
          }
          vemecServices.services.updateReporte(reporteModificado, this.reporte.id )
            .then(response => {
              this.list.forEach((item, index) => {
                if (item.id == response.data.id) {
                  this.list[index].presionMaxima = response.data.presionMaxima
                  this.list[index].presionMinima = response.data.presionMinima
                  this.list[index].presionEntrada = response.data.presionEntrada
                  this.list[index].presionSalida = response.data.presionSalida
                  this.list[index].frecGas = response.data.frecGas
                  this.list[index].volGas = response.data.volGas
                  this.list[index].mezcla = response.data.mezcla
                  this.list[index].humedadAire = response.data.humedadAire
                  this.list[index].tempEntrada = response.data.presionEntrada
                  this.list[index].tempSalida = response.data.presionEntrada
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
      await vemecServices.services.deleteReporte(this.rowToDelete.id)
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
          const tHeader = ['Id', 'Presion Maxima', 'Presion Minima', 'Presion Entrada', 'Presion Salida', 'Temperatura Entrada', 'Temperatura Salida','Volumen Gas', 'Frecuencia Gas', 'Mezcla', 'Humedad Aire', 'Fecha']
          const filterVal = ['id', 'presionMaxima', 'presionMinima', 'presionEntrada', 'presionSalida', 'tempEntrada', 'tempSalida', 'volGas', 'frecGas', 'mezcla', 'humedadAire', 'time']
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'Reportes'
          })
          this.downloadLoading = false
        })
    },
    resetReporte() {
      this.reporte = {
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
  },
}
</script>
