import { api, setAccessToken } from "./axios";

export interface LoginForm {
  name: string;
  password: string;
}

export const login = async (data: LoginForm) => {
  const resp = await api.post("/login", data);
  const token = resp.headers["authorization"]?.replace("Bearer ", "");
  const date = resp.headers['X-Token-Expires-At']
  const prev:string[] = resp.headers["x-user-privilege"]?.split(",") || []
  const d = {
    role: resp.headers["x-user-role"],
    userId: resp.headers["x-user-id"],
    privileges: prev.map(i=>i.trim()),
    expires_at: new Date(date),
    token
  };
  if (token) setAccessToken(d);
  return d;
};

export const logout = async () => {
  await api.get("/logout");
  setAccessToken(null);
};

export const checkAuth = async () => {
  const resp = await api.get("/check");
  return {
    role: resp.headers["x-user-role"],
    userId: resp.headers["x-user-id"],
    privileges: resp.headers["x-user-privilege"]?.split(",") || [],
    token: resp.headers["authorization"]?.replace("Bearer ", "")
  };
};
