import { BrowserRouter } from 'react-router-dom';
import InitModalComponents from './InitModalComponents';
import { useRoutes } from './routs';
import { useAppSelector } from '../shared/lib/hooks/redux';
import { useEffect } from 'react';
import { NavigationInit } from '../features/Navigation';
import { UserRole, useInitUser } from '../entites/User';

function App() {

	const user = useAppSelector(state=>state.auth)
	const {init} = NavigationInit()
	const {userInit} = useInitUser()

	const route = useRoutes(user.isAuthenticated, user.role)

	useEffect(()=>{
		if(user.isAuthenticated && user.role !== UserRole.WITHOUT)
			init()
	},[user.isAuthenticated, init])

	useEffect(()=>{
		if(user.isAuthenticated && user.role !== UserRole.WITHOUT)
			userInit()
	},[user.isAuthenticated, userInit])

	return (
		<div className="App">
			<InitModalComponents/>
			<BrowserRouter>
				{route}
			</BrowserRouter>
		</div>
	)
}

export default App
