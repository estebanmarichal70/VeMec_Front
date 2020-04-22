const baseUrl = 'http://localhost:8080'
const basePath = '/api/v1'
const apiUrl = baseUrl + basePath

import axios from 'axios'

let addDefaultHeaders = () => {
  axios.defaults.headers.common['Authorization'] = JSON.parse(localStorage.getItem('access-token'));
}

export default {
  services: {
    getCentros({ page, limit, codigo, nombre }) {
      return axios.get(apiUrl + `/centro?page=${page}&limit=${limit}&codigo=${codigo}&nombre=${nombre}`)
    },
    getCentroByID(id) {
      return axios.get(apiUrl + `/centro/${id}`)
    },
    createCentro(data) {
      return axios.post(apiUrl + `/centro`, data)
    },
    updateCentro(data, id) {
      return axios.put(apiUrl + `/centro/${id}`, data)
    },
    deleteCentro(id) {
      return axios.delete(apiUrl + `/centro/${id}`)
    },
    // Acciones Salas
    getSalaByID(id) {
      return axios.get(apiUrl + `/sala/${id}`)
    },
    getSalas({ page, limit, nombre, centro }) {
      return axios.get(apiUrl + `/sala?page=${page}&limit=${limit}&nombre=${nombre}&centro=${centro}`)
    },
    createSala(data) {
      return axios.post(apiUrl + `/sala`, data)
    },
    updateSala(data, id) {
      return axios.put(apiUrl + `/sala/${id}`, data)
    },
    deleteSala(id) {
      return axios.delete(apiUrl + `/sala/${id}`)
    },
    // Acciones Vemec
    getVemecByID(id) {
      return axios.get(apiUrl + `/vemec/${id}`)
    },
    createVemec(data) {
      return axios.post(apiUrl + `/vemec`, data)
    },
    updateVemec(data, id) {
      return axios.put(apiUrl + `/vemec/${id}`, data)
    },
    deleteVemec(id) {
      return axios.delete(apiUrl + `/vemec/${id}`)
    },
    // Acciones Pacientes
    getPacientes({ page, limit, nombre, apellido }) {
      return axios.get(apiUrl + `/paciente?page=${page}&limit=${limit}&nombre=${nombre}&apellido=${apellido}`)
    },
    getPacienteByID(id) {
      return axios.get(apiUrl + `/paciente/${id}`)
    },
    createPaciente(data) {
      return axios.post(apiUrl + `/paciente`, data)
    },
    updatePaciente(data, id) {
      return axios.put(apiUrl + `/paciente/${id}`, data)
    },
    deletePaciente(id) {
      return axios.delete(apiUrl + `/paciente/${id}`)
    },
    // ingresos
    salaIngreso(id){
      return axios.get(apiUrl + `/ingreso/sala/${id}`)
    },
    getIngresos({ page, limit, causa, id }) {
      return axios.get(apiUrl + `/ingreso?page=${page}&limit=${limit}&causa=${causa}&id=${id}`)
    }
  }
}
