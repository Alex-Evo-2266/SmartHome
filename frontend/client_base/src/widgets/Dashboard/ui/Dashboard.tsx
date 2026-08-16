import { Dashboard, DashboardPageContext } from "@src/entites/dashboard"
import { useRoom } from "@src/features/Room"


export interface PreviewDashboardProps{
    dashboard: Dashboard
}

export const PreviewDashboard:React.FC<PreviewDashboardProps> = () => {

    const {rooms} = useRoom()

    return(
        <DashboardPageContext.Provider value={{rooms}}>

        </DashboardPageContext.Provider>
        
    )
}