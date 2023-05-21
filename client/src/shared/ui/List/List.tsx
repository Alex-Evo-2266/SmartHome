import "./List.scss"

interface ListContainerProps{
    children?: React.ReactNode
}

export const ListContainer = ({children}:ListContainerProps) => {
    return(
        <ul className="list-container">
            {children}
        </ul>
    )
}