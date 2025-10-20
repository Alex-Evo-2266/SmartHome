import { useErrorLogout } from '../context/AuthContext';
import type { CreateRole, EditPrivilegeRoleForm, Role, RoleList } from '../types';
import { api } from './axios';

export const useRoleAPI = () => {
    const logoutError = useErrorLogout()
    
    const getRoles = () => logoutError(api.get<RoleList>("/role/all"));
    const getRole = (id:string) => logoutError(api.get<Role>(`/role/${id}`));
    const addRole = (data:CreateRole) => logoutError(api.post("/role", data));
    const editRole = (data:EditPrivilegeRoleForm) => logoutError(api.put("/role/privilege", data));
    const deleteRole = (id: string) => logoutError(api.delete(`/role/${id}`));

    return {
        getRole, getRoles, addRole, editRole, deleteRole
    }
}

