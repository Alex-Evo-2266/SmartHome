import type { UserForm, UserSchema, UserEditSchema, UserEditLevelSchema, UserEditPasswordSchema, UsersDataSchema } from '../types';
import { api } from './axios';

export const getCurrentUser = () => api.get<UserSchema>("/users");
export const getAllUsers = () => api.get<UsersDataSchema>("/users/all");
export const addUser = (data:UserForm) => api.post("/users", data);
export const editUser = (data:UserEditSchema) => api.put("/users", data);
export const deleteUser = (id: string) => api.delete(`/users/${id}`);
export const changeRole = (data:UserEditLevelSchema) => api.patch("/users/role", data);
export const changePassword = (data:UserEditPasswordSchema) => api.patch("/users/password", data);
