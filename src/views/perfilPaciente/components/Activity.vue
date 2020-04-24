<template>
<div>

  <el-card class="box-card" shadow="hover">
  <div slot="header" class="clearfix">
    <span>Estado del paciente</span>
  </div>
  <div>
      <el-button type="primary" v-if="addIng" @click="dialogIngreso = true, active = 0, clear(), centro = ''" round>Añadir Ingreso</el-button>
       <el-popconfirm
            confirmButtonText='Si, eliminar'
            confirmButtonType='danger'
            cancelButtonText='No, cancelar'
            cancelButtonType='primary'
            icon="el-icon-info"
            iconColor="red"
            @onConfirm = updateIngreso()
            title="Estas seguro que quieres dar de baja?"
          >
            <el-button type="danger" v-if="!addIng" slot="reference" round>Dar ingreso de baja</el-button>
          </el-popconfirm>
  </div>
  </el-card>

  <el-dialog title="Añadir Ingreso" width="40%" :visible.sync="dialogIngreso">
          <el-form
            ref="dataForm"
            :rules="rules"
            :model="ingreso"
            label-position="top"
            
          >
    <el-steps :active="active" finish-status="success" style="margin-bottom: 15px;">
      <el-step title="Paso 1"></el-step>
      <el-step title="Paso 2"></el-step>
      <el-step title="Paso 3"></el-step>
    </el-steps>
        <el-form-item v-if="active===0">
          <el-form-item label="Centros" prop="centros">
            <el-select v-model="centro" placeholder="Seleccionar" @change="handleChangeSala()">
              <el-option
                v-for="item in centros"
                :key="item.id"
                :label="item.nombre"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form-item>

        <el-form-item v-if="active===1">
          <el-form-item label="Salas" prop="salas">
            <el-select v-model="ingreso.sala" placeholder="Seleccionar" @change="handleChangeVemecs()">
              <el-option
                v-for="item in salas"
                :key="item.id"
                :label="item.nombre"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form-item>

      <div v-if="active===2">
        <el-form-item >
          <el-form-item label="VeMecs" prop="vemec">
            <el-select v-model="ingreso.vemec" placeholder="Seleccionar">
              <el-option
                v-for="item in vemecs"
                :key="item.id"
                :label="item.nombre"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form-item>

        <el-form-item label="Causa" prop="causa">
          <el-input v-model="ingreso.causa" />
        </el-form-item>
        
        <el-form-item label="Fecha y Hora">
          <el-date-picker
            v-model="ingreso.fechaIngreso"
            type="datetime"
            placeholder="Seleccionar">
          </el-date-picker>
        </el-form-item>

        <el-form-item >
          <el-form-item label="Estado" prop="estado">
            <el-select v-model="ingreso.estado" placeholder="Seleccionar">
              <el-option
                v-for="item in estados"
                :key="item.id"
                :label="item.nombre"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form-item>
      </div>
      <div align="center">
        <el-button type="primary" style="margin-top: 12px;" @click="back" round>Atras</el-button>
        <el-button type="primary" style="margin-top: 12px;" @click="next" round :disabled="disable" v-if="active===0">Siguiente</el-button>
        <el-button type="primary" style="margin-top: 12px;" @click="next" round :disabled="disableV" v-if="active===1">Siguiente</el-button>
      </div>
      </el-form>  
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="crearIngreso()" :disabled="disableC">
          Confirmar
        </el-button>
      </div>
  </el-dialog>
</div>
</template>

<script>
const avatarPrefix = '?imageView2/1/w/80/h/80'
const carouselPrefix = '?imageView2/2/h/440'

import vemecServices from '@/api/vemecServices'

export default {
  props: [
    'paciente'
  ],
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
  data(){
    return{
      ingresoUpdate: null,
      addIng: true,
      active: 0,
      disable: true,
      disableV: true,
      disableC: true,
      centro: '',
      centros: [],
      salas: [],
      vemecs: [],
      listLoading: false,
      ingresos: [],
      ingreso: {
        causa: '',
        estado: '',
        fechaEgreso: '',
        fechaIngreso: '',
        paciente: '',
        sala: '',
        vemec: ''
      },
      dialogIngreso: false,
      rules: {
        vemec: [{ required: true, message: 'Debe ingresar un VeMec', trigger: 'blur' }],
        causa: [{ required: true, message: 'Debe ingresar una causa', trigger: 'blur' }],
        estado: [{ required: true, message: 'Debe ingresar un estado', trigger: 'blur' }]
      },
      estados: [{
          id: 'CRITICO',
          nombre: 'Critico'
        },{
          id: "INTERMEDIO",
          nombre: 'Intermedio'
        },{
          id: "ESTABLE",
          nombre: 'Estable'
        },{
          id: "SANO",
          nombre: 'Sano'
      }]
    }
  },
  created(){
    this.ingresos = this.paciente.ingresos;
    this.ingreso.paciente = this.paciente.id;
    this.handleInfo();
    this.verificarIngreso();
  },
  methods: {
      next() {
        if(this.active === 0){
          this.disableV = true;
        }
        if(this.active === 1){
          this.disableC = false;
        }
        if (this.active <= 1){
            this.active++;
        }
      },
      back() {
        if(this.active === 1){
          this.ingreso.sala = '';
        }
        if(this.active === 2){
          this.clear();
          this.disableV = true;
          this.disableC = true;
        }
        if (this.active >= 1)
          this.active--;
      },
      clear(){
        this.ingreso.causa = '';
        this.ingreso.estado = '';
        this.ingreso.fechaEgreso = '';
        this.ingreso.fechaIngreso = '';
        this.ingreso.sala = '';
        this.ingreso.vemec = '';
        this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      },
      crearIngreso(){
          this.$refs['dataForm'].validate((valid) => {
            if (valid) { 
              let fecha = this.ingreso.fechaIngreso.toJSON().slice(0, 19).replace('T', ' ');
              const ingreso = {
                causa: this.ingreso.causa,
                estado: this.ingreso.estado,
                fechaEgreso: null,
                fechaIngreso: fecha,
                paciente: this.ingreso.paciente,
                sala: this.ingreso.sala,
                vemec: this.ingreso.vemec
              }
              vemecServices.services.createIngreso(ingreso).then(res => {
                this.dialogIngreso = false
                this.$notify({
                  title: 'Éxito',
                  message: 'Se creó el ingreso correctamente',
                  type: 'success',
                  duration: 3000
                })
                this.addIng = false;
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
      async updateIngreso(){
          let hoy = new Date();
          let fecha = (hoy.getFullYear() + '-' + (hoy.getMonth() +1) + '-' + hoy.getDate());
          let hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();
          
          let fechaIng = new Date(this.ingresoUpdate.fechaIngreso).toISOString().slice(0, 19).replace('T', ' ');
        
          await vemecServices.services.PSVIngreso(this.ingresoUpdate.id)
            .then(response => {
              let PSV = response.data;
              const ingreso = {
                  causa: this.ingresoUpdate.causa,
                  estado: this.ingresoUpdate.estado,
                  fechaEgreso: fecha +" "+ hora,
                  fechaIngreso: fechaIng,
                  paciente: PSV[0].id,
                  sala: PSV[1].id,
                  vemec: PSV[2].id
                }
              console.log(ingreso)
              vemecServices.services.updateIngreso(ingreso, this.ingresoUpdate.id)
                .then(res => {
                  this.$notify({
                    title: 'Éxito',
                    message: 'Se actualizó el centro correctamente',
                    type: 'success',
                    duration: 3000
                  })
                  this.addIng = true;
                }).catch(err => {
                  this.$notify({
                    title: 'Error',
                    message: 'Ocurrió un error al actualizar',
                    type: 'error',
                    duration: 3000
                  })
                })
            }).catch(err => console.log(err))


      },
      async handleInfo(){
        this.listLoading = true;
        await vemecServices.services.getCentros({
          page: 1,
          limit: 99999999,
          nombre: null,
          codigo: null
        }).then(response => {
          let temp = response.data[2];
          temp.forEach((item, index) =>{
            if(Object.keys(item.salas).length){
              this.centros.push(item);
            }
          })
        }).catch(err => console.log(err))
        this.listLoading = false;
      },
      async handleChangeSala() {
        this.listLoading = true
        await vemecServices.services.getSalas({
          page: 1,
          limit: 99999999,
          nombre: null,
          centro: parseInt(this.centro)
        }).then(response => {
          this.salas = [];
          let temp = response.data[2];
          temp.forEach((item, index) =>{
            if(Object.keys(item.vemecs).length){
              this.salas.push(item);
            }
          })
          if(this.salas.length){
            this.disable = false;
          }else{
            this.disable = true;
            this.$notify({
              title: 'Error',
              message: 'Este centro no contiene VeMecs disponibles',
              type: 'error',
              duration: 3000
            })
          }
        }).catch(err => console.log(err))
        this.listLoading = false
      },
      async handleChangeVemecs() {
        this.disableV = false;
        this.listLoading = true;
        await vemecServices.services.getSalaByID(parseInt(this.ingreso.sala))
        .then(response => {
          this.vemecs = response.data.vemecs;
        }).catch(err => console.log(err))
        this.listLoading = false;
        this.disableV = false;
    },
    verificarIngreso(){
      this.ingresos.forEach((item)=>{
        if(!item.fechaEgreso){
            this.ingresoUpdate = item;
            this.addIng = false;
        }
      })
    }
  }
}
</script>
