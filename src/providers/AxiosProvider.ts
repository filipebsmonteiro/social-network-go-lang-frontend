import { toast } from 'react-toastify';
import axios, { AxiosError, type AxiosInstance, type AxiosInterceptorManager, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

type ApiError = {
  Error?: string;
  // message?: string;
  errors?: Record<string, unknown>[];
}

// Error Treatment
const onReject = (
  error: AxiosError<ApiError>
) => {
  //const originalRequest = error.config

  if (typeof error.response === 'undefined') {
    // Notify.create({ type: 'negative', message: `Verifique sua conexão! Ocorreu um erro de rede, possível falha CORS.` })
  }

  // 400 Bad Request
  if (error.response) {
    if (error.response.status === 400 && error.response.data.Error) {
      toast(error.response.data.Error, { type: 'error' });
      return Promise.reject(error)
    }

    // 401 Unauthorized
    if (error.response.status === 401) {
      if (error.response.data.Error == 'Token is expired') {
        localStorage.removeItem('token')
        window.location.href = '/signin'
        return Promise.reject(error)
      }

      toast('User has no permission to perform this transaction on API!', { type: 'error' });
      return Promise.reject(error)
    }

    // 404
    if (error.response.status === 404) {
      toast('Resource not found on API!', { type: 'error' });
      return Promise.reject(error)
    }

    // 422 Unprocessable Entity
    if (error.response.status === 422) {
      if (error.response.data.errors) {
        const errors: Record<string, any> = error.response.data.errors
        Object.keys(errors).map((field: string) => {
          if (Array.isArray(errors[field])) {
            errors[field].map(msg => {
              toast(msg, { type: 'error' });
            })
          } else {
            toast(errors[field], { type: 'error' });
          }
        })
      }

      if (error.response.data.Error) {
        toast(error.response.data.Error, { type: 'error' });
      }
    }

    // 500 Internal Server Error
    if (error.response.status === 500) {
      toast(`Server Internal Error, check the console.`, { type: 'error' });
      if (error.response.data?.Error) {
        toast(error.response.data.Error, { type: 'error' });
      }
      return Promise.reject(error)
    }
  }

  return Promise.reject(error)
}
// Attach Function Treatment
axios.interceptors.response.use((response) => response, onReject);

export type AxiosWithOptionalAuth =  AxiosInstance & {
  useBearerToken?: () => AxiosWithAuth;
  interceptors: {
    request: AxiosInterceptorManager<InternalAxiosRequestConfig> & { handlers?: Function[]; };
    response: AxiosInterceptorManager<AxiosResponse>;
  }
}
export type AxiosWithAuth =  AxiosInstance & { useBearerToken: () => AxiosWithAuth }

// API
const axiosWithAuth: AxiosWithOptionalAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Accept': '*/*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }
});
axiosWithAuth.interceptors.response.use((response) => response, onReject);
axiosWithAuth.useBearerToken = (): AxiosWithAuth => {
  const token = localStorage.getItem("token")
  if (
    axiosWithAuth.interceptors.request &&
    axiosWithAuth.interceptors.request.handlers?.length === 0 &&
    token
  ) {
    axiosWithAuth.interceptors.request.use(
      (config) => {
        config.headers['Authorization'] = `Bearer ${token}`
        return config
      },
      error => Promise.reject(error)
    );
  }
  return axiosWithAuth as AxiosWithAuth
}

export {
  axios,
  axiosWithAuth
}
