import axios from "axios";

export const API_URL = `http://localhost:7128/api`

const $api = axios.create({
    withCredentials: true,     // Для автоматического добволение cookie
    baseURL: API_URL
})


$api.interceptors.request.use(( config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`    
    return config
})

export default  $api