import { FAB, GridLayout, GridLayoutItem, ToolsIcon } from "alex-evo-sh-ui-kit"
import { Dashboard, DashboardCard, DashboardPageContext, useDashboardAPI, WIDTH_PANEL } from "@src/entites/dashboard"
import { DialogPortal } from "@src/shared"
import { useCallback, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@src/shared/lib/hooks/redux"
import { hideMenu, showBaseMenu } from "@src/shared/lib/reducers/menuReducer"
import { useParams } from 'react-router-dom';
import { useRoom } from "@src/features/Room"
import { GridCard } from "@src/widgets/DashboardCards"
import { CardDialog } from "./CreateCardDialog"

export const PreviewDashboardPage = () => {

    const { id } = useParams<{id: string}>();
    const {rooms} = useRoom()
    const dispatch = useAppDispatch()
    const {visible} = useAppSelector(state=>state.menu)
    const {getDashboard, updateDashboard} = useDashboardAPI()
    const [dashboard, setDashboard] = useState<Dashboard | null>(null)

    const [visibleCreateCard, setVisibleCreateCard] = useState(false)

    const loadDashboard = useCallback(async()=>{
        if(id)
        {
            const data = await getDashboard(id)
            setDashboard(data)
        }
    },[getDashboard, id])

    const changeCard = useCallback((data: DashboardCard, index: number)=>{
        setDashboard(prev=>{
            if(prev === null)
                return null
            const cards = prev.cards.slice()
            cards[index] = data
            return {...prev, cards:[...cards]}
        })
    },[])

    const addCard = async (data: DashboardCard) => {
        setDashboard(prev=>{
            if(prev === null)
                return null
            return{...prev, cards: [...(prev?.cards ?? []), data]}})
    }
    
    const save = useCallback(() => {
        if(dashboard !== null && id !== undefined)
            updateDashboard(id, dashboard)
    },[updateDashboard, id, dashboard])

    const showTool = useCallback((e?:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
        if(visible)
            dispatch(hideMenu())
        else
        {
            const poz = {x: e?.clientX ?? 0, y: e?.clientY ?? 0}
            dispatch(showBaseMenu([
                {
                    title: "add card",
                    onClick: ()=>setVisibleCreateCard(true)
                },
                {
                    title: "save",
                    onClick: save
                }
            ], poz.x + 60, poz.y, {autoHide: true}))
        }
            
    },[dispatch, visible, save])

    useEffect(()=>{
        loadDashboard()
    },[loadDashboard])

    return(
        <DashboardPageContext.Provider value={{rooms}}>
            <div className="home-page container-page">
                <GridLayout itemWith={`${WIDTH_PANEL}px`}>
                {
                    dashboard?.cards.map((item, index)=>(
                        <GridLayoutItem key={index}>
                            <GridCard cardData={item} onSave={(data)=>changeCard(data, index)}/>
                        </GridLayoutItem>
                    ))
                }
                </GridLayout>
            </div>
            <FAB icon={<ToolsIcon/>} onClick={showTool}/>
            {
                visibleCreateCard && 
                <DialogPortal>
                    <CardDialog onSave={addCard} onHide={()=>setVisibleCreateCard(false)}/>
                </DialogPortal>
            }
            
        </DashboardPageContext.Provider>
        
    )
}