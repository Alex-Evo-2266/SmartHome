import "./Divider.scss"

interface DividerProps{
    short?: boolean
    text?: string
}

export const Divider = ({short, text}:DividerProps) => {

    if(text)
        return(
            <div className={`divider-and-text ${short?"short":""}`}>
                <div className={`divider ${short?"short":""}`}></div>
                {text}
                <div className={`divider ${short?"short":""}`}></div>
            </div>
        )

    return(
        <div className={`divider ${short?"short":""}`}></div>
    )
}