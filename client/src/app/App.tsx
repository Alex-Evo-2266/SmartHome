import { BrowserRouter } from 'react-router-dom';
import InitModalComponents from './InitModalComponents';
import { useRoutes } from './routs';
import { useAppSelector } from '../shared/lib/hooks/redux';

function App() {

	const user = useAppSelector(state=>state.auth)

	const route = useRoutes(user.isAuthenticated)

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
