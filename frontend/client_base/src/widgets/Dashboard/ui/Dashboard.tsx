import { GridLayout, GridLayoutItem } from "alex-evo-sh-ui-kit"
import { Dashboard, DashboardPageContext, WIDTH_PANEL } from "@src/entites/dashboard"
import { useRoom } from "@src/features/Room"
import { GridCard } from "./cards/gridCard"

export interface PreviewDashboardProps{
    dashboard: Dashboard
}

export const PreviewDashboard:React.FC<PreviewDashboardProps> = ({dashboard}) => {

    const {rooms} = useRoom()

    return(
        <DashboardPageContext.Provider value={{rooms}}>
            <div className="home-page container-page">
                <GridLayout itemWith={`${WIDTH_PANEL}px`}>
                {
                    dashboard?.cards.map((item, index)=>(
                        <GridLayoutItem key={index}>
                            <GridCard cardData={item}/>
                        </GridLayoutItem>
                    ))
                }
                </GridLayout>
            </div>
            
        </DashboardPageContext.Provider>
        
    )
}