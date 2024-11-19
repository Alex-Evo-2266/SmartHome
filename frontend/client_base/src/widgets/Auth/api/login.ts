import { useCallback } from "react";
import { baseAPI } from "../../../shared/api/baseAPI";
import { loginData } from "../lib/models/login";
import { useAppDispatch } from "../../../shared/lib/hooks/redux";
import { login as saweAuthData } from "../../../shared/lib/reducers/userAuthDataReducer";
import { login } from "../../../shared/api/login";

export const useUserLogin = () => {

	const dispatch = useAppDispatch()

	const userLogin = useCallback(async (form: loginData) => {
		try {
			const data = await login(form)
			dispatch(saweAuthData(data.token, data.id, data.role, new Date(data.expires_at)))
			return data.token
		} catch (e) {
			console.error(e);
		}
	},[baseAPI])

	return{userLogin}
}

