import { useCallback, useEffect } from "react";
import { LoginData } from "../../../entites/User";
import { useHttp } from "../../../features/RequestWithAuthentication";
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook";
import { ILoginForm } from "../models/LoginForm";
import { TypeRequest } from "../../../shared/api/type";

export const useUserLogin = () => {

	const {request, error, clearError} = useHttp()
	const {showSnackbar} = useSnackbar()

	const userLogin = useCallback(async (form: ILoginForm) => {
		try {
			const data: LoginData | undefined = await request('/api/auth/login', TypeRequest.POST, {...form})
			return data
		} catch (e) {
			console.error(e);
		}
	},[request])

	useEffect(()=>{
		if (error)
			showSnackbar(error, {}, 10000)
		return ()=>{
	 		clearError();
		}
	},[error, clearError, showSnackbar])

	return{userLogin}
}

