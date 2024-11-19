import { useRoutes } from "./routs"
import { BrowserRouter } from 'react-router-dom';
import '../shared/ui/index.scss'
import { useAppSelector } from "../shared/lib/hooks/redux";

function App() {

  const {isAuthenticated} = useAppSelector(state=>state.auth)
	const route = useRoutes(isAuthenticated)

  return (
    <>
      <BrowserRouter>
        {route}
      </BrowserRouter>
    </>
  )
}

export default App
