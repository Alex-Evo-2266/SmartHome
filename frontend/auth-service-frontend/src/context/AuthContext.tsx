import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, logout as apiLogout, type LoginForm } from "../api/auth";

interface AuthData {
  userId: string;
  role: string;
  privileges: string[];
  token: string
  expires_at: Date
}

interface AuthContextType {
  user: AuthData | null;
  login: (data: LoginForm) => Promise<void>;
  logout: () => Promise<void>;
}

const SMARTHOME_USER_DATA = "sh_auth_serv_user"

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthData | null>(null);

    const login = async (data: LoginForm) => {
        const u = await apiLogin(data);
        localStorage.setItem(SMARTHOME_USER_DATA, JSON.stringify({
            userId: u.userId, role:u.role, token:u.token, expires_at: u.expires_at, privileges: u.privileges
        }))
        setUser(u);
    };

    const logout = async () => {
        setUser(null);
        await apiLogout();
    };

    const initState = ():AuthData => {
        let datauser = localStorage.getItem(SMARTHOME_USER_DATA)
        if (!datauser)
            datauser = '{}';
        const data = JSON.parse(datauser)
        let newdata: AuthData = {
            token: data?.token || '',
            userId: data?.id || undefined,
            role: data?.role || "",
            privileges: data?.privileges || [],
            expires_at: (data?.expires_at)?new Date(data?.expires_at):new Date(),
        }
        return newdata
    }

    useEffect(()=>{
        const data = initState()
        setUser(data)
    },[])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext not found");
  return ctx;
};

export const usePrivilege = (privilege: string) => {
  const {user} = useAuth()

  return{
    valid_privilege: !!(user && user.privileges.includes(privilege))
  }
};
