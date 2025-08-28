import type { PrivilegeForm, PrivilegeSchemaList } from '../types';
import { api } from './axios';

export const getPrivileges = () => api.get<PrivilegeSchemaList>("/privilege");
export const addPrivilege = (data:PrivilegeForm) => api.post("/privilege", data);
export const deletePrivilege = (id: string) => api.delete(`/privilege/${id}`);