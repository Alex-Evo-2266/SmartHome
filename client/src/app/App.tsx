import { BrowserRouter } from 'react-router-dom';
import InitModalComponents from './InitModalComponents';
import { useRoutes } from './routs';
import { useAppSelector } from '../shared/lib/hooks/redux';
import { useEffect } from 'react';
import { NavigationInit } from '../features/Navigation';
import { UserRole, useInitUser } from '../entites/User';
import { useSocket } from '../features/WebSocket';

function App() {

	const user = useAppSelector(state=>state.auth)
	const {init} = NavigationInit()
	const {userInit} = useInitUser()
	const {listenSocket, closeSocket} = useSocket()

	const route = useRoutes(user.isAuthenticated, user.role)

	useEffect(()=>{
		if(user.isAuthenticated && user.role !== UserRole.WITHOUT)
			init()
	},[user.isAuthenticated, init])

	useEffect(()=>{
		if(user.isAuthenticated && user.role !== UserRole.WITHOUT)
			userInit()
	},[user.isAuthenticated, userInit])

	useEffect(()=>{
		if (user.isAuthenticated)
		  listenSocket()
		return ()=>closeSocket()
	  },[listenSocket, closeSocket, user.isAuthenticated])

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
