import axios from "axios";

export const API_URL = `http://localhost:3000/`

const $api = axios.create({
    withCredentials: true,     // Для автоматического добволение cookie
    baseURL: API_URL
})


// Перехатчик
$api.interceptors.request.use(( config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

export default  $api