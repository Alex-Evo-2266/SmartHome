import { Navigate, Route, Routes } from "react-router-dom"
import { AuthPage } from "../pages/Auth"
import { HomePage } from "../pages/Home"
import { SettingsPage } from "../pages/Settings"
import { RootPage } from "../pages/RootPage"
import { ProfilePage } from "../pages/Profile"
import { UserRole } from "../entites/User"
import { Page403 } from "../pages/403Page"
import { UsersPage } from "../pages/Users"


export const useRoutes = (isAuthenticated:boolean, role: UserRole)=>{

	return (
		<Routes>
				{
					(isAuthenticated && role === UserRole.WITHOUT)?
					<>
						<Route path="/" element={
							<Page403/>
						}/>
						<Route path="/*" element={<Navigate replace to="/" />} />
					</>:
					(isAuthenticated)?
					<Route path="/" element={<RootPage/>}>
						<Route path="home" element={<HomePage/>}/>
						<Route path="settings" element={<SettingsPage/>}/>
						<Route path="profile" element={<ProfilePage/>}/>
						<Route path="users" element={<UsersPage/>}/>
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