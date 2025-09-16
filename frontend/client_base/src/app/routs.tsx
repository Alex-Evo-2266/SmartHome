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
import { ColorContext, ColorProvider, IColorContext, SizeProvider, Switch } from "alex-evo-sh-ui-kit"
import { useContext, useEffect } from "react"
import { ColorField } from "@src/shared"

interface RoutesComponentProps{
	isAuthenticated:boolean, 
	role?: string
}

export const RoutesComponent:React.FC<RoutesComponentProps> = ({isAuthenticated, role})=>{

	console.log("role: ", role)
	const {updateThemeColor, colors, activeTheme, setActiveTheme} = useContext<IColorContext>(ColorContext)

	useEffect(()=>{
		console.log("colors", colors)
	},[colors])

	return (
		<ColorProvider>
          <SizeProvider>
			<div style={{marginInlineStart: "80px"}}>
				<Switch checked={activeTheme === "dark"} showLabel labelOff="light" labelOn="dark" onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{setActiveTheme(!e.target.checked?"light":"dark")}}/>
				<ColorField value={colors.Primary_color} onChange={c=>updateThemeColor(activeTheme, "Primary_color", c)}/>
			</div>
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