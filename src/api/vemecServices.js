const baseUrl = 'http://localhost:8080'
const basePath = '/api/v1'
const apiUrl = baseUrl + basePath

var axios = require("axios");

let addDefaultHeaders = () => {
  axios.defaults.headers.common['Authorization'] = "Bearer " + JSON.parse(localStorage.getItem('access_token'));
}

module.exports = {
  services: {
    login(data) {
      return axios.post(apiUrl + "/auth/sign_in", data);
    },
    getCentros({page, limit, codigo, nombre}) {
      addDefaultHeaders();
      return axios.get(apiUrl + `/centro?page=${page}&limit=${limit}&codigo=${codigo}&nombre=${nombre}`)
    },
    getCentroByID(id) {
      addDefaultHeaders();
      return axios.get(apiUrl + `/centro/${id}`)
    },
    createCentro(data) {
      addDefaultHeaders();
      return axios.post(apiUrl + `/centro`, data)
    },
    updateCentro(data, id) {
      addDefaultHeaders();
      return axios.put(apiUrl + `/centro/${id}`, data)
    },
    deleteCentro(id) {
      addDefaultHeaders();
      return axios.delete(apiUrl + `/centro/${id}`)
    },
    // Acciones Salas
    getSalaByID(id) {
      addDefaultHeaders();
      return axios.get(apiUrl + `/sala/${id}`)
    },
    getSalas({page, limit, nombre, centro}) {
      addDefaultHeaders();
      return axios.get(apiUrl + `/sala?page=${page}&limit=${limit}&nombre=${nombre}&centro=${centro}`)
    },
    createSala(data) {
      addDefaultHeaders();
      return axios.post(apiUrl + `/sala`, data)
    },
    updateSala(data, id) {
      addDefaultHeaders();
      return axios.put(apiUrl + `/sala/${id}`, data)
    },
    deleteSala(id) {
      addDefaultHeaders();
      return axios.delete(apiUrl + `/sala/${id}`)
    },
    // Acciones Vemec
    getVemecByID(id) {
      addDefaultHeaders();
      return axios.get(apiUrl + `/vemec/${id}`)
    },
    createVemec(data) {
      addDefaultHeaders();
      return axios.post(apiUrl + `/vemec`, data)
    },
    updateVemec(data, id) {
      addDefaultHeaders();
      return axios.put(apiUrl + `/vemec/${id}`, data)
    },
    deleteVemec(id) {
      addDefaultHeaders();
      return axios.delete(apiUrl + `/vemec/${id}`)
    },
    // Acciones Pacientes
    getPacientes({page, limit, nombre, apellido}) {
      addDefaultHeaders();
      return axios.get(apiUrl + `/paciente?page=${page}&limit=${limit}&nombre=${nombre}&apellido=${apellido}`)
    },
    getPacienteByID(id) {
      addDefaultHeaders();
      return axios.get(apiUrl + `/paciente/${id}`)
    },
    createPaciente(data) {
      addDefaultHeaders();
      return axios.post(apiUrl + `/paciente`, data)
    },
    updatePaciente(data, id) {
      addDefaultHeaders();
      return axios.put(apiUrl + `/paciente/${id}`, data)
    },
    deletePaciente(id) {
      addDefaultHeaders();
      return axios.delete(apiUrl + `/paciente/${id}`)
    },
    // ingresos
    salaIngreso(id) {
      addDefaultHeaders();
      return axios.get(apiUrl + `/ingreso/sala/${id}`)
    },
    createIngreso(data) {
      addDefaultHeaders();
      return axios.post(apiUrl + `/ingreso`, data);
    },
    finalizarIngreso(data, id) {
      addDefaultHeaders();
      return axios.put(apiUrl + `/ingreso/finalizar/${id}`, data)
    },
    PSVIngreso(id) {
      addDefaultHeaders();
      return axios.get(apiUrl + `/ingreso/ingPSV/${id}`)
    },
    updateIngreso(data, id) {
      addDefaultHeaders();
      return axios.put(apiUrl + `/ingreso/${id}`, data)
    },
    getIngresos({page, limit, causa, id}) {
      addDefaultHeaders();
      return axios.get(apiUrl + `/ingreso?page=${page}&limit=${limit}&causa=${causa}&id=${id}`)
    },
    getIngresoByID(id) {
      addDefaultHeaders();
      return axios.get(apiUrl + `/ingreso/${id}`)
    },
    getCountAllByEstado(){
      return axios.get(apiUrl + `/ingreso/cnt_by_estado`)
    },
    // reportes
    getReportes({page, limit, id}) {
      addDefaultHeaders();
      return axios.get(apiUrl + `/reporte?page=${page}&limit=${limit}&id=${id}`)
    },
    createReporte(data) {
      addDefaultHeaders();
      return axios.post(apiUrl + `/reporte`, data)
    },
    updateReporte(data, id) {
      addDefaultHeaders();
      return axios.put(apiUrl + `/reporte/${id}`, data)
    },
    deleteReporte(id) {
      addDefaultHeaders();
      return axios.delete(apiUrl + `/reporte/${id}`)
    },
    // data for charts
    contarPacientesPorSexo() {
      addDefaultHeaders();
      return axios.get(apiUrl + "/paciente/cnt_by_sexo");
    },
    contarPacientesPorEdad(){
      addDefaultHeaders();
      return axios.get(apiUrl + "/paciente/cnt_by_edad");
    },
    contarVemecs(){
      addDefaultHeaders();
      return axios.get(apiUrl + "/vemec/cnt_by_estado");
    },
    contarIngresosHoy(){
      addDefaultHeaders();
      return axios.get(apiUrl + "/ingreso/ingresos_hoy");
    }
  }
}
