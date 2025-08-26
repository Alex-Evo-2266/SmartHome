import { Navigate, Route, Routes } from "react-router-dom"
import { AuthPage } from "../pages/Auth/AuthPage"
import { RootPage } from "../pages/Root"
import { HomePage } from "../pages/Home"
import { DevicePage } from "../pages/Device"
import { SettingsPage } from "../pages/Settings"
import { AutomationPage } from "../pages/Automations"
import { ModulesPage } from "../pages/modules"
import { DetailDevice } from "../pages/DeviceDetail/ui/DeviceDetail"
import { RoomPage, RoomsPage } from "../pages/Room"
import { ScriptConstructor } from "../pages/Scripts"



export const useRoutes = (isAuthenticated:boolean, role?: string)=>{

	console.log("role: ", role)

	return (
		<Routes>
			{
				isAuthenticated?
				<>
				<Route path="/home" element={<HomePage/>}/>
				<Route path="/" element={<RootPage/>}>
					<Route path="device" element={<DevicePage/>}/>
					<Route path="device/:systemName" element={<DetailDevice/>}/>
					<Route path="automation" element={<AutomationPage/>}/>
					<Route path="module_pages/:moduleName/:pageName" element={<ModulesPage/>}/>
					<Route path="settings" element={<SettingsPage/>}/>
					<Route path="room" element={<RoomsPage/>}/>
					<Route path="room/:name" element={<RoomPage/>}/>
					<Route path="script/constructor" element={<ScriptConstructor/>}/>
					<Route path="script/constructor/:id" element={<ScriptConstructor/>}/>
					
					<Route path="/*" element={<Navigate replace to="/home" />} />
				</Route>
				</>
				:<>
					<Route path="auth" element={<AuthPage/>}/>
					<Route path="/*" element={<Navigate replace to="/auth" />} />
				</>
			}
		</Routes>
	)
}