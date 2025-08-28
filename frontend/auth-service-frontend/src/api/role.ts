import type { CreateRole, EditPrivilegeRoleForm, Role, RoleList } from '../types';
import { api } from './axios';

export const getRoles = () => api.get<RoleList>("/role/all");
export const getRole = (id:string) => api.get<Role>(`/role/${id}`);
export const addRole = (data:CreateRole) => api.post("/role", data);
export const editRole = (data:EditPrivilegeRoleForm) => api.put("/role/privilege", data);
export const deleteRole = (id: string) => api.delete(`/role/${id}`);