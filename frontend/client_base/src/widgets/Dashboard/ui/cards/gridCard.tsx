import { ColorContext, GridLayout, GridLayoutItem, IColorContext, Panel, Typography } from "alex-evo-sh-ui-kit"
import { WIDTH_PANEL_CONTENT, WIDTH_PANEL_ITEM, WIDTH_PANEL_PADDING } from "@src/entites/dashboard/const"
import { DashboardCardGrid } from "@src/entites/dashboard/models/panel"
import { Controls } from "./controls"
import { useContext, useState } from "react"
import { DialogPortal } from "@src/shared"
import { GridCardDialog } from "./dialogConfig/GridCardDialog"
import { useAppDispatch } from "@src/shared/lib/hooks/redux"
import { showBaseMenu } from "@src/shared/lib/reducers/menuReducer"

interface GridCardProps{
    cardData: DashboardCardGrid
    onClick?:(e?: React.MouseEvent<HTMLDivElement>) => void
    onSave?: (e: DashboardCardGrid)=>void
}

export const GridCard:React.FC<GridCardProps> = ({cardData, onClick, onSave}) => {

    const {colors} = useContext<IColorContext>(ColorContext)
    const [editVisibleCard, setEditVisibleCard] = useState(false)
    const dispatch = useAppDispatch()

    const glass = colors.Surface_container_color + "a0"

    const contextHandler = (e:React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        e.preventDefault()
        if(!onSave)
            return;
        dispatch(showBaseMenu(
            [
                {
                    title: "edit",
                    onClick: ()=>setEditVisibleCard(true)
                }
            ], 
            e.clientX, 
            e.clientY, 
            {autoHide: true}
        ))
    }

    const save = (data: DashboardCardGrid) => {
        onSave?.(data)
        setEditVisibleCard(false)
    }

    return(
        <Panel onClick={onClick} onContextMenu={contextHandler} className="dashboard-card" style={{width:`${WIDTH_PANEL_CONTENT}px`, padding: `${WIDTH_PANEL_PADDING}px`, backgroundColor:glass}}>
            <Typography className="dashboard-card-title" type="title-2">{cardData.title}</Typography>
            <GridLayout itemWith={`${WIDTH_PANEL_ITEM}px`}>
            {
                cardData.items.map((item, index)=>(
                    <GridLayoutItem key={index} colSpan={item.width}>
                        <Controls data={item}/>
                    </GridLayoutItem>
                ))
            }
            </GridLayout>
            {
                editVisibleCard &&
                <DialogPortal>
                    <GridCardDialog onHide={()=>setEditVisibleCard(false)} data={cardData} onSave={save}/>
                </DialogPortal>
            }
        </Panel>
    )
}