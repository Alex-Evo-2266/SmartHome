import { Navigate, Route, Routes } from "react-router-dom"
import { AuthPage } from "../pages/Auth/AuthPage"



export const useRoutes = (isAuthenticated:boolean, role?: string)=>{

	return (
		<Routes>
			{
				isAuthenticated?
				<>
				</>:
				<>
					<Route path="auth" element={<AuthPage/>}/>
					<Route path="/*" element={<Navigate replace to="/auth" />} />
				</>
			}
			
			{/* <Route path="/home" element={<HomePage/>}/>
			<Route path="/" element={<HomePage/>}/>
			<Route path="page/constructor/:index" element={<ConstructorPage/>}/>
			<Route path="/" element={<RootPage/>}>
				<Route path="page" element={<PagesPage/>}/>
				<Route path="dialog/constructor/:index" element={<ConstructorDialog/>}/>
				<Route path="dialog" element={<DialogsPage/>}/>
				<Route path="menu/constructor/:index" element={<ConstructorMenu/>}/>
				<Route path="menu" element={<MenuPage/>}/>
				<Route path="devices" element={<DevicesPage/>}/>
				<Route path="apiPage" element={<URLPage/>}/>
				<Route path="function" element={<FunctionPage/>}/>
				<Route path="/*" element={<Navigate replace to="/home" />} />
			</Route> */}
		</Routes>
	)
}