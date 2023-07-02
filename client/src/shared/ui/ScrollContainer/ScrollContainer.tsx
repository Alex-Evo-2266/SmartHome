import './ScrollContainer.scss'

interface ScrollContainerProps{
    className?: string
    children?: React.ReactNode
    height?: string
}

export const ScrollContainer = ({className, children, height}:ScrollContainerProps) => {

    return(
        <div className={`scroll-container ${className}`} style={{height}}>
            {children}
        </div>
    )
}