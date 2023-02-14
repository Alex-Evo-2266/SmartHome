import React from "react"

export const BaseModalWindow = ({visible, hide, children, zIndex=98}) =>{

	const close = ()=>{
		if (typeof(hide) == "function")
			hide()
	}
	
	if (!visible)
	return null
	
	return(
		<div className="modal_window_wrapper" style={{zIndex: 998}}>
			<div className="backGlass" onClick={close} style={{zIndex: zIndex}}></div>
			{children}
		</div>
	)
}