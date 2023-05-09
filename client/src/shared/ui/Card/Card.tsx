import "./Card.scss"

interface CardProps{
	className?: string
	action?: React.ReactNode
	imgSrc?: string
	alt?: string
	header?: string
	subhead?: string
	text?: string
	children?: React.ReactNode
	iconButtonCell?: React.ReactNode
	onClick?: (e:React.MouseEvent<HTMLDivElement>)=>void
}

export const Card = ({className, action, imgSrc, alt, header, subhead, text, children, iconButtonCell, onClick}:CardProps) => {
	
	const isCard = (e:React.MouseEvent<HTMLDivElement>):boolean=>{
		if((e.target as Element).className === "action-container" || (e.target as Element).closest(".action-container"))
			return false
		if((e.target as Element).className === "icon-button-container" || (e.target as Element).closest(".icon-button-container"))
			return false
		return true
	}

	const click = (e:React.MouseEvent<HTMLDivElement>) => {
        onClick && onClick(e)
		if(!isCard(e))
			return
        let overlay = document.createElement('span')
		let rootContainer = e.currentTarget.closest(".card-container")
		let clickContainer = rootContainer?.querySelector(".blick-container")
		if(!clickContainer)
			return
        overlay.classList.add("btn-overlay")
        let x = e.pageX - e.currentTarget.offsetLeft
        let y = e.pageY - e.currentTarget.offsetTop
        overlay.style.left = x + "px"
        overlay.style.top = y + "px"
			clickContainer.appendChild(overlay)

        setTimeout(()=>{
            overlay.remove()
        },500)
    }

	return(
		<div className={`card-container ${className}`} onClick={click}>
			<div className="blick-container"></div>
			{
				(imgSrc)?
				<div className="card-img-container">
					<img src={imgSrc} alt={alt}/>
				</div>:null
			}
			<div className="card-content-container">
				<div className="card-Headline-container mb-1 font-bold">
					<div className="headline">
						<h2 className="text-3xl">{header}</h2>
					</div>
					{
						(iconButtonCell)?
						<div className="icon-button-container">
						{iconButtonCell}
						</div>:null
					}
				</div>
				{
					(subhead)?
					<div className="card-subhead-container mb-1">
						<div className="subhead">
							<h3 className="text-xl">{subhead}</h3>
						</div>
					</div>:null
				}
				{
					(text)?
					<div className="card-text-container mb-1">
						<div className="text">
							<p className="text-sm">{text}</p>
						</div>
					</div>:null
				}
				{
					(children)?
					<div className="card-child-container mb-2">
					{children}
					</div>:null
				}
				<div className="action-container">{action}</div>
			</div>
		</div>
	)
}