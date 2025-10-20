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
import { DashboardsPage } from "@src/pages/Dashboards/ui/Dashboards"
import { PreviewDashboardPage } from "@src/pages/Dashboards/ui/Preview"
import { ColorProvider, SizeProvider } from "alex-evo-sh-ui-kit"
import { ManagerPage } from "@src/pages/Manager/ui/Manager"
import { DockerModuleList, DockerExemplePage, DockerModule, CoreList } from "@src/pages/Manager"
import { CoreModuleList } from "@src/pages/Manager/ui/ModuleCore/ModuleCoreList"

interface RoutesComponentProps{
	isAuthenticated:boolean, 
	role?: string
}

export const RoutesComponent:React.FC<RoutesComponentProps> = ({isAuthenticated, role})=>{

	console.log("role: ", role)

	return (
		<ColorProvider>
          <SizeProvider>
			<Routes>
			{
				isAuthenticated?
				<>
				<Route path="/" element={<RootPage/>}>
					<Route path="home" element={<HomePage/>}/>
					<Route path="device" element={<DevicePage/>}/>
					<Route path="device/:systemName" element={<DetailDevice/>}/>
					<Route path="automation" element={<AutomationPage/>}/>
					<Route path="module_pages/:moduleName/:pageName" element={<ModulesPage/>}/>
					<Route path="manager" element={<ManagerPage/>}>
						<Route index element={<Navigate to="docker" replace />} />
						<Route path="docker" element={<DockerModuleList/>}/>
						<Route path="docker/:module_name" element={<DockerModule/>}/>
						<Route path="docker/:module_name/:module_exempl" element={<DockerExemplePage/>}/>
						<Route path="core-module" element={<CoreModuleList/>}/>
						<Route path="core" element={<CoreList/>}/>
						<Route path="*" element={<Navigate replace to="/manager/docker" />} />
					</Route>
					<Route path="settings" element={<SettingsPage/>}/>
					<Route path="room" element={<RoomsPage/>}/>
					<Route path="room/:name" element={<RoomPage/>}/>
					<Route path="script/constructor" element={<ScriptConstructor/>}/>
					<Route path="script/constructor/:id" element={<ScriptConstructor/>}/>
					<Route path="dashboard" element={<DashboardsPage/>}/>
					<Route path="dashboard/:id" element={<PreviewDashboardPage/>}/>
					
					<Route path="/*" element={<Navigate replace to="/home" />} />
				</Route>
				</>
				:<>
					<Route path="auth" element={<AuthPage/>}/>
					<Route path="/*" element={<Navigate replace to="/auth" />} />
				</>
			}
		</Routes>
		  </SizeProvider>
		  </ColorProvider>
			
		
	)
}