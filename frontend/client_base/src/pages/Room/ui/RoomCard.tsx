import { Card, Typography } from "alex-evo-sh-ui-kit"
import { capitalizeFirst } from "../../../shared";
import { useNavigate } from 'react-router-dom';
import './RoomPage.scss'

export interface RoomCardProps{
    children?: React.ReactNode
    name: string
}

export const RoomCard:React.FC<RoomCardProps> = ({children, name}) => {
    const navigate = useNavigate();

    return(
        <Card className="room-card" onClick={()=>navigate(`/room/${name}`)}>
            <Typography type="title-2">{capitalizeFirst(name)}</Typography>
            {children}
        </Card>
    )
}