import { useErrorLogout } from '../context/AuthContext';
import type { PrivilegeForm, PrivilegeSchemaList } from '../types';
import { api } from './axios';

export const usePrivilegesAPI = () => {
    const logoutError = useErrorLogout()
    
    const getPrivileges = () => logoutError(api.get<PrivilegeSchemaList>("/privilege"));
    const addPrivilege = (data:PrivilegeForm) => logoutError(api.post("/privilege", data));
    const deletePrivilege = (id: string) => logoutError(api.delete(`/privilege/${id}`));

    return {
        getPrivileges, addPrivilege, deletePrivilege
    }
}

