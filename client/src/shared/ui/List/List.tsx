import "./List.scss"

interface ListContainerProps{
    children?: React.ReactNode
    className?: string
    maxHeight?: string
    scroll?: boolean
}

export const ListContainer = ({children, className, maxHeight, scroll}:ListContainerProps) => {
    return(
        <ul style={{maxHeight:maxHeight}} className={`list-container ${className} ${scroll?"scroll":""}`}>
            {children}
        </ul>
    )
}