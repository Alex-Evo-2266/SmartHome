import './BaseActionCard.scss'

interface BaseActionCardProps{
    children: React.ReactNode
    className?: string
}

export const BaseActionCard = ({children, className}:BaseActionCardProps) => {

    return(
        <div className={`base-action-card ${className ?? ""}`}>
            {children}
        </div>
    )
}