import { Navigate, Route, Routes } from "react-router-dom"
import { AuthPage } from "../pages/Auth"
import { HomePage } from "../pages/Home"
import { SettingsPage } from "../pages/Settings"
import { RootPage } from "../pages/RootPage"


export const useRoutes = (isAuthenticated:boolean)=>{
	return (
    <Routes>
        {
          (isAuthenticated)?
          <Route path="/" element={<RootPage/>}>
            <Route path="home" element={<HomePage/>}/>
            <Route path="settings" element={<SettingsPage/>}/>
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