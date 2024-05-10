import './authForm.scss'
import { useCallback, useState } from 'react'
import { AuthServiceBtn } from '../../../features/AuthServiceBtn'
import { Button, Divider, TextField } from "alex-evo-sh-ui-kit"
import { ILoginForm } from '../models/LoginForm'
import { useUserLogin } from '../api/login'
import { useAppDispatch } from '../../../shared/lib/hooks/redux'
import { login } from '../../../entites/User'

export const AuthForm = () => {

	const {userLogin} = useUserLogin()
	const dispatch = useAppDispatch()
	const [form, setForm] = useState<ILoginForm>({
		name: '', password: ''
	});

	const loginHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		setForm(prev=>({...prev, [event.target.name]: event.target.value}))
	}	

	const out = useCallback(async () => {
		let data = await userLogin(form)
		if(!data)
			return;
		dispatch(login(data.token, data.id, data.role, new Date(data.expires_at)))
	},[userLogin, form])

	return(
		<div className='auth-form-container'>
			<div className='auth-form-header'>
				<h1 className=''>Auth</h1>
			</div>
			<div className='auth-btn-container'>
				<AuthServiceBtn/>
			</div>
			<Divider text='or' short/>
			<div>
				<TextField placeholder='login' name='name' value={form.name} border onChange={loginHandler}/>
				<br/>
				<TextField placeholder='password' name='password' value={form.password} password border onChange={loginHandler}/>
				<br/>
				<div className='auth-form-buttom'>
					<Button onClick={out}>login</Button>
				</div>
				<br/>
			</div>
		</div>
	)
}