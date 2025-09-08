import { GridLayout, GridLayoutItem, TextDialog, ToolsIcon } from "alex-evo-sh-ui-kit"
import { DashboardCard, DashboardPageContext, useDashboardAPI, WIDTH_PANEL } from "@src/entites/dashboard"
import { useRoom } from "@src/features/Room"
import { DialogPortal, Menu } from "@src/shared"
import { useCallback, useState } from "react"
import { getModuleButtons, Navigation, useMainButtons } from "@src/widgets/Navigation"
import { useNavigationData } from "@src/entites/navigation"
import { getBarButtonsHomePage } from "@src/widgets/Navigation/config/barButtons"
import { useAppDispatch, useAppSelector } from "@src/shared/lib/hooks/redux"
import { hideMenu, showBaseMenu } from "@src/shared/lib/reducers/menuReducer"
import { v4 as uuidv4 } from 'uuid';
import { GridCard } from "@src/widgets/DashboardCards"
import './Home.scss'


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
            {
                type: "number",
                readonly: false,
                data: "device.lamp2.brightness",
                title: "яркость",
                width: 4
            },
            {
                type: "bool",
                readonly: false,
                data: "device.lamp1.state",
                title: "lamp state",
                width: 1
            },
            
        ]
    }
]

export const HomePage = () => {

    const {rooms} = useRoom()
    const dispatch = useAppDispatch()
    const {navigation} = useNavigationData()
    const {visible} = useAppSelector(state=>state.menu)
    const mainBtn = useMainButtons()
    const {createDashboard} = useDashboardAPI()

    const [visibleCreateDashboard, setVisibleCreateDashboard] = useState(false)

    const addDashboard = useCallback(async(name: string) => {
        await createDashboard({
            title: name,
            id: uuidv4(),
            cards:[],
            private: false
        })
    },[createDashboard])

    const addCard = () => {

    }

    const showTool = useCallback((e?:React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
        if(visible)
            dispatch(hideMenu())
        else
        {
            const poz = {x: e?.clientX ?? 0, y: e?.clientY ?? 0}
            dispatch(showBaseMenu([
                {
                    title: "add dashboard",
                    onClick: ()=>setVisibleCreateDashboard(true)
                },
                {
                    title: "add card",
                    onClick: addCard
                }
            ], poz.x + 60, poz.y, {autoHide: true}))
        }
            
    },[dispatch, visible])

    return(
        <DashboardPageContext.Provider value={{rooms}}>
            <Menu/>
            <Navigation mainBtn={mainBtn} otherBtn={getModuleButtons(navigation)} barBtn={getBarButtonsHomePage()} first_btn={{
                text: "tools",
                type:"button",
                onClick:showTool,
                icon: <ToolsIcon/>
              }}/>
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
            {
                visibleCreateDashboard && 
                <DialogPortal>
                    <TextDialog header="create dashboard" onHide={()=>setVisibleCreateDashboard(false)} onSuccess={addDashboard}/>
                </DialogPortal>
            }
            
        </DashboardPageContext.Provider>
        
    )
}