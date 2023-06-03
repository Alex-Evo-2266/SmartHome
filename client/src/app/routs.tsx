import { Navigate, Route, Routes } from "react-router-dom"
import { AuthPage } from "../pages/Auth"


export const useRoutes = (isAuthenticated:boolean)=>{
	return (
    <Routes>
        {
          (isAuthenticated)?
          <Route path="/" element={null}>
            <Route path="/*" element={<Navigate replace to="/home" />} />
          </Route>:
          <>
           <Route path="/" element={<AuthPage/>}/>
           <Route path="/*" element={<Navigate replace to="/" />} />
          </>
        }
      </Routes>
	)
}