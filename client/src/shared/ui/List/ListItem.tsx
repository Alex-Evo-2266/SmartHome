import "./List.scss"

interface ListItemContainerProps{
    icon?: React.ReactNode
    header?: string
    text?: string
    control?: React.ReactNode
    value?: string
}

export const ListItem = ({icon, control, text, header, value}:ListItemContainerProps) => {
    return(
        <li className="list-item-container">
            {
                (icon)?
                <div className="icon-container">
                {icon}
                </div>:
                (value)?
                <div className="icon-container">
                {value}
                </div>:null
            }
            {
                (text)?
                <div className="text-container">
                    <div className="header">{header}</div>
                    <div className="text">{text}</div>
                </div>:
                <div className="text-container">
                    <div className="header">{header}</div>
                </div>
            }
            {
                (control)?
                <div className="control-container">
                    {control}
                </div>:null
            }
        </li>
    )
}