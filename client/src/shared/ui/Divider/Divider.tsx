import "./Divider.scss"

interface DividerProps{
    short?: boolean
}

export const Divider = ({short}:DividerProps) => {
    return(
        <div className={`divider ${short?"short":""}`}></div>
    )
}