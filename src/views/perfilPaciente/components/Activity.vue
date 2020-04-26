<template>
<div>
  <el-card class="box-card" shadow="hover">
  <div slot="header" class="clearfix">
    <span>Estado del paciente</span>
  </div>
  <div>
      <p v-if="addIng"><strong>{{paciente.nombre}}</strong> se encuentra actualmente sin ingresar en ningún centro</p>
      <p v-else><strong>{{paciente.nombre}}</strong> se encuentra ingresado en la sala <strong>{{salaInf}}</strong> y esta utilizando el VeMec Nro.<strong>{{vemecInf}}</strong></p>
      
      <el-button type="primary" v-if="addIng" @click="dialogIngreso = true, active = 0, clear(), centro = ''" round>Añadir Ingreso</el-button>
       <el-popconfirm v-if="!addIng"
            confirmButtonText='Si, eliminar'
            confirmButtonType='danger'
            cancelButtonText='No, cancelar'
            cancelButtonType='primary'
            icon="el-icon-info"
            iconColor="red"
            @onConfirm = finalizarIngreso()
            title="Estas seguro que quieres dar de baja?"
          >
            <el-button type="danger" slot="reference" round>Dar ingreso de baja</el-button>
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
                v-for="item in salasIng"
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
    'paciente',
    'salas'
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
      salaInf: '',
      vemecInf: '',
      addIng: true,
      active: 0,
      disable: true,
      disableV: true,
      disableC: true,
      centro: '',
      centros: [],
      salasIng: [],
      vemecs: [],
      listLoading: false,
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
  mounted(){
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
                paciente: this.paciente.id,
                sala: this.ingreso.sala,
                vemec: this.ingreso.vemec
              }
              vemecServices.services.createIngreso(ingreso).then(res => {
                this.paciente.ingresos.unshift(res.data)
                 vemecServices.services.salaIngreso(res.data.id)
                  .then(response => {
                    this.salaInf = response.data.nombre
                    this.vemecInf = response.data.vemec.id
                    this.salas.unshift(response.data);
                  })
                  .catch(err => console.log(err))
                this.dialogIngreso = false
                this.$notify({
                  title: 'Éxito',
                  message: 'Se creó el ingreso correctamente',
                  type: 'success',
                  duration: 3000
                })
                this.addIng = true;
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
      async finalizarIngreso(){
          let hoy = new Date();
          let fecha = (hoy.getFullYear() + '-' + (hoy.getMonth() +1) + '-' + hoy.getDate());
          let hora = hoy.getHours() + ':' + hoy.getMinutes() + ':' + hoy.getSeconds();

          const ingreso = {
              fechaEgreso: fecha +" "+ hora,             
          }
          vemecServices.services.finalizarIngreso(ingreso, this.paciente.ingresos[0].id)
            .then(res => {
              this.addIng = true;      
              this.paciente.ingresos[0].fechaEgreso = res.data.fechaEgreso;
              this.$notify({
                title: 'Éxito',
                message: 'Se dio de baja correctamente',
                type: 'success',
                duration: 3000
              })
            }).catch(err => {
              this.$notify({
                title: 'Error',
                message: 'Ocurrió un error al dar de baja',
                type: 'error',
                duration: 3000
              })
            })
      },
      async handleInfo(){
        this.listLoading = true;

        vemecServices.services.salaIngreso(this.paciente.ingresos[0].id)
        .then(response => {
          this.salaInf = response.data.nombre;
          this.vemecInf = this.paciente.ingresos[0].vemec.id;
        })
        .catch(err => console.log(err))

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
          this.salasIng = [];
          let temp = response.data[2];

          temp.forEach((item, index) =>{
            if(Object.keys(item.vemecs).length){
              let vemecsD = 0;
              item.vemecs.forEach(vem =>{
                if(!vem.estado){
                  vemecsD++;
                }
              })
              if(vemecsD != 0){
                this.salasIng.push(item);
              }
            }         
          })
          if(this.salasIng.length){
            this.disable = false;
          }else{
            this.disable = true;
            this.$notify({
              title: 'Error',
              message: 'Este centro no contiene VeMecs',
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
          let temp = response.data.vemecs;
          this.vemecs = [];
          temp.forEach(item =>{
              if(!item.estado){
                this.vemecs.push(item);
              }
          })
        }).catch(err => console.log(err))
        this.listLoading = false;
        this.disableV = false;
      },
      verificarIngreso(){
        this.paciente.ingresos.forEach((item)=>{
          if(!item.fechaEgreso){
              this.addIng = false;
          }
        })
      }
  }
}
</script>
