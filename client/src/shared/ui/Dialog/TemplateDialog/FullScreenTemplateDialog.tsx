import { useCallback, useEffect, useState } from "react"
import { X } from "lucide-react"
import { IconButton } from "../../IconButton/IconButton"
import "./Dialog.scss"
import { BasicTemplateDialog } from "./BasicTemplateDialog"
import { TextButton } from "../../Button/Button"

interface DialogProps{
	children: React.ReactNode
	header?: string
	onSave?: (data?:any)=>void
    onHide?: ()=>void
    className?: string
}

interface ButtonDialogProps{
	onSave?: (data?:any)=>void
    onHide?: ()=>void
}

const ButtonDialog = ({onHide, onSave}:ButtonDialogProps) => (
	<div className="dialog-button-container">
		<TextButton onClick={onHide}>cancel</TextButton>
		<TextButton onClick={onSave}>save</TextButton>
	</div>
)

export const FullScrinTemplateDialog = ({className, header, children, onSave, onHide}:DialogProps) => {

	const [fullScreenDisplay, setFullScreenDisplay] = useState<boolean>(false)

    const resize = useCallback(() => {
        if(window.innerWidth < 720)
            setFullScreenDisplay(true)
        else
            setFullScreenDisplay(false)
    },[window.innerWidth])

    useEffect(()=>{
        resize()
    },[resize])

    useEffect(()=>{
		window.addEventListener('resize', resize)
		return ()=>{
			window.removeEventListener('resize', resize)
		}
	},[resize])

	const hide = ()=>{
		onHide && onHide()
	}

	const save = () => {
		onSave && onSave()
	}

	if(!fullScreenDisplay)
		return(
			<BasicTemplateDialog className={className} onHide={hide} children={children} action={<ButtonDialog onHide={hide} onSave={save}/>}/>
		)

	return(
		<div className={`full-screen-dialog-container ${className}`}>
			<div className="full-screen-dialog-header">
				<div className="dialog-icon-container">
					<IconButton onClick={hide} icon={<X/>}/>
				</div>
				<div className="header">{header}</div>
				<div className="save-container"><TextButton onClick={save}>save</TextButton></div>
			</div>
			<div className="full-screen-dialog-content">
				{children}
			</div>
		</div>
	)
}