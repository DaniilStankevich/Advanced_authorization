import axios from "axios"
import { AuthResponse } from "../models/response/AuthResponse"

export const API_URL = `http://localhost:7128/api`
const $api = axios.create({
  withCredentials: true, // Для автоматического добавление cookie
  baseURL: API_URL,
})

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
  return config
})

$api.interceptors.response.use(
  (config) => {
    return config
  },
  async (error) => {
    const originalRequest = error.config // все данные для запроса
    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true
      try {
        const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {
          withCredentials: true,
        })
        localStorage.setItem("token", response.data.accessToken)
        return $api.request(originalRequest) // повторный запрос
      } catch (e) {
        console.log("НЕ АВТОРИЗОВАН")
      }
    }

    throw error
  }
)

export default $api
