import { X } from 'lucide-react'
import './Chips.scss'

interface ChipsProps{
    text: string
    onClick?: ()=>void
    onDelete?: ()=>void
    big?: boolean
}

export const Chips = ({text, onDelete, big}:ChipsProps) => {

    return(
        <div className={`chips ${big?"big-chips":""}`}>
            <p>{text}</p>
            <div className='chips-btn' onClick={onDelete}><X size={20}/></div>
        </div>
    )
}