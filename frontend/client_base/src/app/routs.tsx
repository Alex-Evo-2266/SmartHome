import { DashboardsPage } from "@src/pages/Dashboards/ui/Dashboards"
import { PreviewDashboardPage } from "@src/pages/Dashboards/ui/Preview"
import { DockerModuleList, DockerExemplePage, DockerModule, CoreList } from "@src/pages/Manager"
import { ManagerPage } from "@src/pages/Manager/ui/Manager"
import { CoreModuleList } from "@src/pages/Manager/ui/ModuleCore/ModuleCoreList"
import { Navigate, Route, Routes } from "react-router-dom"

import { AutomationPage } from "../pages/Automations"
import { DevicePage } from "../pages/Device"
import { DetailDevice } from "../pages/DeviceDetail/ui/DeviceDetail"
import { HomePage } from "../pages/Home"
import { ModulesPage } from "../pages/modules"
import { RoomPage, RoomsPage } from "../pages/Room"
import { RootPage } from "../pages/Root"
import { ScriptConstructor } from "../pages/Scripts"
import { SettingsPage } from "../pages/Settings"
import { useSocket } from "@src/shared/lib/hooks/webSocket.hook"
import { useUpdateDeviceData } from "@src/entites/devices/hooks/update_device_data"
import { useEffect } from "react"
import { AuthGuard, useAuth } from "alex-evo-sh-auth"

export const RoutesComponent = ()=>{

	const { user, isAuthenticated, loading } = useAuth();

	const {updateDevicedata, patchDeviceState} = useUpdateDeviceData()
	const {listenSocket, closeSocket} = useSocket([
		{messageType: "device-send", callback: updateDevicedata as (arg: unknown)=>void},
		{messageType: "device-send-patch", callback: patchDeviceState as (arg: unknown)=>void},
	])

	useEffect(()=>{
		console.log(`auth data ${isAuthenticated} ${JSON.stringify(user)}`)
	},[isAuthenticated, user])

	useEffect(()=>{
		if (isAuthenticated)
		listenSocket()
		return ()=>closeSocket()
	},[listenSocket, closeSocket, isAuthenticated])

	if (loading) return <p>Загрузка...</p>;

	if (!isAuthenticated) return <p>Перенаправление на логин...</p>;

	return (
		<AuthGuard>
		<Routes>
			{
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
			}
		</Routes>
		</AuthGuard>

		
	)
}