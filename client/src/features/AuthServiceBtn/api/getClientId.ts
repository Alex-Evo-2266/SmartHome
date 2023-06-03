import { baseAPI } from "../../../shared/api/baseAPI";

const AUTH_CLIENT_ID_PATH = '/api/auth/clientid'

interface GetClientId{
    clientId?: string
    authservice?: string | boolean
    host?: string
  }

export const getClientId = async () => {
    const response = await baseAPI(AUTH_CLIENT_ID_PATH)
    if(!response.ok)
      return;
    const data: GetClientId = await response.json()
    if (data?.clientId && data?.host)
        return data
  }