import axios from "axios";
const PREFIX = '/api-auth'; // замените если у вас другой ROUTE_PREFIX

export const api = axios.create({
  baseURL: PREFIX, // свой адрес
  withCredentials: true, // чтобы cookie smart_home шли автоматически
});
const SMARTHOME_USER_DATA = "auth-user-data-sh"
// let accessToken: string | null = null;

// Устанавливаем токен после логина
export const setAccessToken = (data: {    
    role: string,
    userId: string,
    privileges: string[],
    token: string
} | null) => {
    if(data === null)
    {
        localStorage.removeItem(SMARTHOME_USER_DATA)
    }
    else
    {
        localStorage.setItem(SMARTHOME_USER_DATA, JSON.stringify({
            id: data.userId, role:data.role, token:data.token
        }))
    }
};

// Интерцептор добавляет Authorization
api.interceptors.request.use((config) => {
    const data = localStorage.getItem(SMARTHOME_USER_DATA)
    if(!data)
        return config
    const obj = JSON.parse(data)
    console.log(obj.token, config)
  if (obj.token) {
    config.headers.Authorization = `Bearer ${obj.token}`;
  }
  return config;
});

// Если 401 — пробуем refresh
api.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const resp = await api.get("/refresh");
        const newToken = resp.headers["authorization"]?.replace("Bearer ", "");
        if (newToken) {
          setAccessToken(newToken);
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return api.request(error.config); // повторяем запрос
        }
      } catch (e) {
        console.error("Refresh error", e);
      }
    }
    return Promise.reject(error);
  }
);
