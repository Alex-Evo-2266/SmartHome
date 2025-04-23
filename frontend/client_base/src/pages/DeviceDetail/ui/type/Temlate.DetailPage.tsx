import { MenuDeviceCard } from "../MenuDeviceCard"
import { Diagramm } from "../diagrams";
import { FieldHistory } from "../../../../entites/devices/models/history";
import { DeviceDetailProps } from "../../models/props";
import { useContext } from "react";
import { ArrowLeft, IconButton, ScreenSize, SizeContext, Typography } from "alex-evo-sh-ui-kit";
import { useNavigate } from 'react-router-dom';

import './DetailTemplate.scss'

const classNamePostfix = {
    [ScreenSize.MOBILE]: "min",
    [ScreenSize.STANDART]: "base",
    [ScreenSize.BIG_SCREEN]: "big"
}

export interface DetailDeviceTemplateProps extends DeviceDetailProps{
    diagrams?: FieldHistory[]
    children: React.ReactNode
    imageControl?: React.ReactNode
}

export const DetailDeviceTemplate:React.FC<DetailDeviceTemplateProps> = ({device, onEdit, diagrams=[], children, imageControl}) => {

    const {screen} = useContext(SizeContext)
    const navigate = useNavigate();

    return (
        <div className={`detail-page container-page detail-page--${classNamePostfix[screen]}`}>
            <div className="detail-content">
                {
                    diagrams.map((item, index)=>(
                        <Diagramm key={`diagram-${index}`} data={item}/>
                    ))
                }
            </div>
            <div className="mobile-content detail-content">
                <IconButton onClick={()=>navigate("/device")} className="detail-back" icon={<ArrowLeft/>} transparent/>
                <div className="header-container">
                    <div className="image-container">
                        {imageControl}
                                        
                    </div>
                </div>
                <Typography className="detail-name" type='heading'>{device.name}</Typography>
                <Typography className="detail-name" type='body'>{device.system_name}</Typography>
                {children}
            </div>
            <div className="detail-content">

            </div>
            <MenuDeviceCard status={device.status} system_name={device.system_name} name={device.name} onEdit={onEdit}/>
        </div>
    )
}
