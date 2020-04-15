const baseUrl = "http://192.168.1.102:8080";
const basePath = "/api/v1"
const apiUrl = baseUrl + basePath;

import axios from 'axios'

export default{
    services:{
        getCentros({page, limit, codigo, nombre}){
            return axios.get(apiUrl + `/centro?page=${page}&limit=${limit}&codigo=${codigo}&nombre=${nombre}`)
        },
        getCentroByID(id){
            return axios.get(apiUrl + `/centro/${id}`)
        },
        createCentro(data){
            return axios.post(apiUrl + `/centro`, data)
        },
        updateCentro(data, id){
            return axios.put(apiUrl + `/centro/${id}`, data)
        },
        deleteCentro(id){
            return axios.delete(apiUrl + `/centro/${id}`)
        }
    }
}
