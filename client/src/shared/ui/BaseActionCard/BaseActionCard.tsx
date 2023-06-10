import './BaseActionCard.scss'

interface BaseActionCardProps{
    children: React.ReactNode
}

export const BaseActionCard = ({children}:BaseActionCardProps) => {

    return(
        <div className='base-action-card'>
            {children}
        </div>
    )
}