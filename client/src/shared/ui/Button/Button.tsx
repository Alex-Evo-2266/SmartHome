import "./button.scss"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const OutlineButton= (props: ButtonProps) => Button({...props, className:(props.className ?? "") + " outline-button"})

export const TextButton = (props: ButtonProps) => Button({...props, className:(props.className ?? "") + " text-button"})

export const FilledTotalButton = (props: ButtonProps) => Button({...props, className:(props.className ?? "") + " total-button"})

export const FilledButton = (props: ButtonProps) => Button({...props, className:(props.className ?? "") + " filled-button"})

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
        <span>{props.children}</span>
    </button>
    )
}
