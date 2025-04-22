import './Switch.scss'

export interface SwitchBtnProps{
    value: boolean
    onChange: (value: boolean)=>void
    name?: string
    id?: string
}

export interface SwitchProps{
    btns: SwitchBtnProps[]
    className?: string
    size?: 0|1|2|3|4|5|6|string; // Добавил string для кастомных размеров
}

export const Switch:React.FC<SwitchProps> = ({btns, className = "", size}) => {

    const sizeList = [
        "50px",
        "75px",
        "100px",
        "125px",
        "150px",
        "175px",
        "200px"
    ];

    const styleSVG = {
        "--size-switch": typeof size === 'number' ? sizeList[size] : size
    } as React.CSSProperties 

    if(btns.length < 1 || btns.length > 4)
        return null

    return(
        <div className={`switch-element ${className}`} style={styleSVG}>
            <div className='switch-btn-container' data-size={btns.length.toString()}>
            {btns.map((item, index)=>(
                <div className={`switch-btn ${item.value? "active": ""}`} key={index} onClick={()=>item.onChange(!item.value)}>
                </div>
            ))}
            </div>
        </div>
    )
}