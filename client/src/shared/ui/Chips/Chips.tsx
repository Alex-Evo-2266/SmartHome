import { X } from 'lucide-react'
import './Chips.scss'

interface ChipsProps{
    text: string
    onClick?: ()=>void
    onDelete?: ()=>void
}

export const Chips = ({text, onDelete}:ChipsProps) => {

    return(
        <div className='chips'>
            <p>{text}</p>
            <div className='chips-btn' onClick={onDelete}><X size={20}/></div>
        </div>
    )
}