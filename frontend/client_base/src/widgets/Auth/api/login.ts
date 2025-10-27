
import { login } from "@src/shared/api/login";
import { useAppDispatch } from "@src/shared/lib/hooks/redux";
import { LoginRequestData } from "@src/shared/lib/model/authData";
import { login as saweAuthData } from "@src/shared/lib/reducers/userAuthDataReducer";
import { useCallback } from "react";


export const useUserLogin = () => {

	const dispatch = useAppDispatch()

	const userLogin = useCallback(async (form: LoginRequestData) => {
		try {
			const data = await login(form)
			dispatch(saweAuthData(data.token, data.id, data.role, new Date(data.expires_at)))
			return data.token
		} catch (e) {
			console.error(e);
		}
	},[dispatch])

	return{userLogin}
}

