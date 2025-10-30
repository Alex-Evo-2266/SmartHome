import { Typography } from "alex-evo-sh-ui-kit"

import { SIZE1_ITEM_WIDTH, SIZE2_ITEM_WIDTH, SIZE3_ITEM_WIDTH, SIZE4_ITEM_WIDTH, SIZE_ITEM_HEIGHT } from "../../../../../entites/dashboard/const"
import './styleControl.scss'

interface ControlTemplateProps{
    className?: string
    size: 1 | 2 | 3 | 4
    onClick?: ()=>void
    title: string
    children: React.ReactNode
}

export const ControlTemplate:React.FC<ControlTemplateProps> = ({className, size, onClick, title, children}) => {

    return(
        <div className={`dashboard-control-template ${className ?? ""}`} style={
            {
                width: size === 1?SIZE1_ITEM_WIDTH:size === 2?SIZE2_ITEM_WIDTH:size === 3?SIZE3_ITEM_WIDTH:SIZE4_ITEM_WIDTH, 
                height: SIZE_ITEM_HEIGHT
            }
        } onClick={onClick}>
            <div className="dashboard-control-template-content">
                {children}
            </div>
            <Typography className="dashboard-control-template-title" type="small">{title}</Typography>
        </div>
    )
}