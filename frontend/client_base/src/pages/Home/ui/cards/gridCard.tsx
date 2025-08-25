import { GridLayout, GridLayoutItem, Panel, Typography, useColor } from "alex-evo-sh-ui-kit"
import { WIDTH_PANEL_CONTENT, WIDTH_PANEL_ITEM, WIDTH_PANEL_PADDING } from "../../const"
import { DashboardCardGrid } from "../../../../entites/dashboard/models/panel"
import { Controls } from "./controls"

interface GridCardProps{
    cardData: DashboardCardGrid
}

export const GridCard:React.FC<GridCardProps> = ({cardData}) => {

    const {colors} = useColor()

    const glass = colors.Surface_container_color + "a0"

    return(
        <Panel className="dashboard-card" style={{width:`${WIDTH_PANEL_CONTENT}px`, padding: `${WIDTH_PANEL_PADDING}px`, backgroundColor:glass}}>
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
        </Panel>
    )
}