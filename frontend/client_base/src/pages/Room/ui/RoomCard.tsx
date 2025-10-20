import { Card, Typography } from "alex-evo-sh-ui-kit"
import { capitalizeFirst } from "../../../shared";
import { useNavigate } from 'react-router-dom';
import './RoomPage.scss'
import { Room } from "../../../entites/rooms";
import { useCallback } from "react";
import * as React from "react";
import { useBoolRoom, useNumberRoom } from "../../../features/Room";

export interface RoomCardProps{
    children?: React.ReactNode
    room: Room
}

export const RoomCard:React.FC<RoomCardProps> = ({children, room}) => {
    const navigate = useNavigate();
    const {click: clickLight, value: light_val} = useBoolRoom("LIGHT", "power", room)
    const {click: clickDecoLight, value: deco_light_val} = useBoolRoom("LIGHT_DECO", "power", room)
    const {value: lum} = useNumberRoom("ILLUMINANCE", "lum", room)
    const {value: temp} = useNumberRoom("CLIMATE", "temp", room)

    const clickLightHandler = useCallback((e:React.MouseEvent<HTMLDivElement>)=>{
        e.stopPropagation()
        clickLight()
    },[clickLight])

    const clickDecoLightHandler = useCallback((e:React.MouseEvent<HTMLDivElement>)=>{
        e.stopPropagation()
        clickDecoLight()
    },[clickDecoLight])

    return(
        <Card className="room-card">
            <div onClick={()=>navigate(`/room/${room.name_room}`)}>
                <Typography type="title-2">{capitalizeFirst(room.name_room)}</Typography>
                {
                    light_val !== undefined &&
                    <div className="room-card-bool-indicator-container">
                        <div onClick={clickLightHandler} className={`room-card-bool-indicator ${light_val? "active": ""}`}>
                            <Typography type="title-1">light</Typography>
                        </div>
                    </div>
                }
                {
                    deco_light_val !== undefined &&
                    <div className="room-card-bool-indicator-container">
                        <div onClick={clickDecoLightHandler} className={`room-card-bool-indicator ${deco_light_val? "active": ""}`}>
                            <Typography type="title-1">light deco</Typography>
                        </div>
                    </div>
                }
                {
                    lum !== undefined &&
                    <Typography type="title-1">lum: {lum}</Typography>
                }
                {
                    temp !== undefined &&
                    <Typography type="title-1">temp: {temp}</Typography>
                }
                {children}
            </div>
            
        </Card>
    )
}