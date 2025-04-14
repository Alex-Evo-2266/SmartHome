import { Navigate, Route, Routes } from "react-router-dom"
import { AuthPage } from "../pages/Auth/AuthPage"
import { RootPage } from "../pages/Root"
import { HomePage } from "../pages/Home"
import { DevicePage } from "../pages/Device"
import { SettingsPage } from "../pages/Settings"
import { AutomationPage } from "../pages/Automations"
import { ModulesPage } from "../pages/modules"
import { DetailDevice } from "../pages/DeviceDetail/ui/DeviceDetail"



export const useRoutes = (isAuthenticated:boolean, role?: string)=>{

	console.log("role: ", role)

	return (
		<Routes>
			{
				isAuthenticated?
				<Route path="/" element={<RootPage/>}>
					<Route path="home" element={<HomePage/>}/>
					<Route path="device" element={<DevicePage/>}/>
					<Route path="device/:systemName" element={<DetailDevice/>}/>
					<Route path="automation" element={<AutomationPage/>}/>
					<Route path="modules/:moduleName/:pageName" element={<ModulesPage/>}/>
					<Route path="settings" element={<SettingsPage/>}/>
					<Route path="/*" element={<Navigate replace to="/home" />} />
				</Route>
				:<>
					<Route path="auth" element={<AuthPage/>}/>
					<Route path="/*" element={<Navigate replace to="/auth" />} />
				</>
			}
		</Routes>
	)
}