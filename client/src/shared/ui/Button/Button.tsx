import "./button.scss"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const BorderButton= (props: ButtonProps) => Button({...props, className:(props.className ?? "") + " border"})

export const MinButton = (props: ButtonProps) => Button({...props, className:(props.className ?? "") + " min"})

export const Button = (props: ButtonProps) => {

    const click = (e:React.MouseEvent<HTMLButtonElement>) => {
        props.onClick && props.onClick(e)
        let overlay = document.createElement('span')
        overlay.classList.add("btn-overlay")
        let x = e.pageX - e.currentTarget.offsetLeft
        let y = e.pageY - e.currentTarget.offsetTop
        overlay.style.left = x + "px"
        overlay.style.top = y + "px"
        e.currentTarget.appendChild(overlay)

        setTimeout(()=>{
            overlay.remove()
        },500)
    }

    return(
    <button {...{...props, className:(props.className ?? "") + " btn", onClick: click}}>
    </button>
    )
}
