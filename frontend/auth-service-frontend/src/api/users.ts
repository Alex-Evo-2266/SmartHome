import { useErrorLogout } from '../context/AuthContext';
import type { UserForm, UserSchema, UserEditSchema, UserEditLevelSchema, UserEditPasswordSchema, UsersDataSchema } from '../types';
import { api } from './axios';

export const useUserAPI = () => {

    const logoutError = useErrorLogout()

    const getCurrentUser = () => logoutError(api.get<UserSchema>("/users"));
    const getAllUsers = () => logoutError(api.get<UsersDataSchema>("/users/all"));
    const addUser = (data:UserForm) => logoutError(api.post("/users", data));
    const editUser = (id:string, data:UserEditSchema) => logoutError(api.put(`/users/${id}`, data));
    const deleteUser = (id: string) => logoutError(api.delete(`/users/${id}`));
    const changeRole = (data:UserEditLevelSchema) => logoutError(api.patch("/users/role", data));
    const changePassword = (data:UserEditPasswordSchema) => logoutError(api.patch("/users/password", data));

    return{
        getAllUsers, getCurrentUser, addUser, editUser, deleteUser, changePassword, changeRole
    }
}


