import { BrowserRouter } from 'react-router-dom';
import InitModalComponents from './InitModalComponents';
import { useRoutes } from './routs';
import { useAppSelector } from '../shared/lib/hooks/redux';
import { useEffect } from 'react';
import { NavigationInit } from '../features/Navigation';

function App() {

	const user = useAppSelector(state=>state.auth)
	const {init} = NavigationInit()

	const route = useRoutes(user.isAuthenticated)

	useEffect(()=>{
		if(user.isAuthenticated)
			init()
	},[user.isAuthenticated, init])

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
