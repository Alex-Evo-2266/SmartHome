import { useErrorLogout } from '../context/AuthContext';
import type { Session, SessionResp } from '../types';
import { api } from './axios';

export const useSessionsAPI = () => {

    const logoutError = useErrorLogout()

    const getSession = () => logoutError(api.get<Session>("/session"));
    const getSessions = () => logoutError(api.get<SessionResp>("/session/all"));
    const deleteSession = (id: string) => logoutError(api.delete(`/session/${id}`));

    return{
        getSession, deleteSession, getSessions
    }
}


