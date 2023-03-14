import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import {login as login_a, logout as logout_a} from "../store/reducers/authReducer"
import { useHttp } from "./http.hook"

export const useAuth = ()=>{
	const dispatch = useDispatch()
	const {request} = useHttp()
	const auth = useSelector(state => state.auth)

	const login = useCallback((id, token, expires_at, role) => {
		dispatch(login_a(token, id, role, expires_at))
	},[dispatch])

	const logout = useCallback(() => {
		request("/api/auth/logout", "GET", null, {Authorization: `Bearer ${auth.token}`})
		dispatch(logout_a())
	},[request, auth, dispatch])

	return {login, logout}
}
