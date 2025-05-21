import type { AxiosRequestConfig } from 'axios'
import { axiosWithAuth, type AxiosWithAuth } from '../../providers/AxiosProvider'

export class Repository<T = unknown> {
  endpoint: string | null = null
  $axios: AxiosWithAuth

  constructor ($axios: AxiosWithAuth = axiosWithAuth as AxiosWithAuth) {
    this.$axios = $axios
  }

  fetchAll (params?: AxiosRequestConfig['params']) {
    return this.$axios.useBearerToken().get<T[]>(`${this.endpoint}`, { params })
  }

  fetch (id: string) {
    return this.$axios.useBearerToken().get<T>(`${this.endpoint}/${id}`)
  }

  create (data: Partial<T>) {
    return this.$axios.useBearerToken().post<T>(`${this.endpoint}`, { data })
  }

  update (id: string, data: Partial<T>) {
    return this.$axios.useBearerToken().put<T>(`${this.endpoint}/${id}`, { data })
  }

  delete (id: string) {
    return this.$axios.useBearerToken().delete<T>(`${this.endpoint}/${id}`)
  }
}
