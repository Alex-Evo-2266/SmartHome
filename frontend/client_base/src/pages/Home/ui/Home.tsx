import { GridLayout, GridLayoutItem } from "alex-evo-sh-ui-kit"
import { DashboardCard } from "../../../entites/dashboard"
import { WIDTH_PANEL } from "../const"
import { GridCard } from "./gridCard"
import { HomePageContext } from "../context"
import { useRoom } from "../../../features/Room"

const TEST_DASHBOARD:DashboardCard[] = [
    {
        title: "test",
        type: "grid",
        items:[
            {
                type: "bool",
                readonly: false,
                data: "device.lamp1.state",
                title: "lamp state",
                width: 1
            },
            {
                type: "bool",
                readonly: true,
                data: "room.спальня.LIGHT.power",
                title: "свет спальни",
                width: 1
            },
            {
                type: "number",
                readonly: false,
                data: "device.lamp1.brightness",
                title: "яркость",
                width: 2
            },
            {
                type: "number",
                readonly: false,
                data: "device.lamp1.temp",
                title: "temp",
                width: 2
            },
            {
                type: "number",
                readonly: true,
                data: "room.спальня.LIGHT.brightness",
                title: "яркость",
                width: 4
            },
            {
                type: "number",
                readonly: true,
                data: "fdb.спальня.LIGHT.brightness",
                title: "яркость",
                width: 3
            },
        ]
    }
]

export const HomePage = () => {

    const {rooms} = useRoom()

    return(
        <HomePageContext.Provider value={{rooms}}>
            <div className="home-page container-page">
                <GridLayout itemWith={`${WIDTH_PANEL}px`}>
                {
                    TEST_DASHBOARD.map((item, index)=>(
                        <GridLayoutItem key={index}>
                            <GridCard cardData={item}/>
                        </GridLayoutItem>
                    ))
                }
                </GridLayout>
            </div>
        </HomePageContext.Provider>
        
    )
}