import { GridLayout, GridLayoutItem, Panel, Typography } from "alex-evo-sh-ui-kit"
import { WIDTH_PANEL_CONTENT, WIDTH_PANEL_ITEM, WIDTH_PANEL_PADDING } from "../const"
import { DashboardCardGrid } from "../../../entites/dashboard/models/panel"
import { Controls } from "./controls"

const HEIGHT = WIDTH_PANEL_ITEM + WIDTH_PANEL_ITEM + 30 + 10

interface GridCardProps{
    cardData: DashboardCardGrid
}

export const GridCard:React.FC<GridCardProps> = ({cardData}) => {

    return(
        <Panel className="dashboard-card" style={{height: `${HEIGHT}px`, width:`${WIDTH_PANEL_CONTENT}px`, padding: `${WIDTH_PANEL_PADDING}px`}}>
            <Typography type="title-2">{cardData.title}</Typography>
            <GridLayout itemWith={`${WIDTH_PANEL_ITEM}px`}>
            {
                cardData.items.map((item, index)=>(
                    <GridLayoutItem key={index} colSpan={item.width}>
                        <Controls data={item}/>
                    </GridLayoutItem>
                ))
            }
            </GridLayout>
        </Panel>
    )
}