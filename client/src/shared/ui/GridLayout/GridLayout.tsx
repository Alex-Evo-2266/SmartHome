import "./GridLayout.scss"

import { useCallback, useEffect, useRef, useState } from 'react'

interface IAdaptivGridItemProps{
	children?:React.ReactNode
}

const GridLayoutItem = ({children}:IAdaptivGridItemProps)=>{
	return(
		<div className={`adaptiv-grid-item`}>
			<div className="adaptiv-grid-item-container">
				{children}
			</div>
		</div>
	)
}

interface IAdaptivGridProps{
	children?:React.ReactNode
	className?: string
	gridRowGap?: string
	gridColumnGap?: string
	itemMinWith?: string
	itemMaxWith?: string
	itemWith?: string
}

const GridLayout = ({children, className, gridRowGap = "10px", gridColumnGap = "5px", itemMinWith, itemMaxWith, itemWith="400px"}:IAdaptivGridProps)=>{
	const root = useRef<HTMLDivElement>(null)
	const [items, setItems] = useState<HTMLDivElement[]>([])

	const bindStyles = useCallback(()=>{
		if (!root.current) return;
		root.current.style.display = 'grid';
		root.current.style.gridRowGap = gridRowGap;
		root.current.style.gridColumnGap = gridColumnGap;
		let itemMinWith2: string = itemMinWith ?? itemWith
		let itemMaxWith2: string = itemMaxWith ?? itemWith
		root.current.style.gridTemplateColumns = 'repeat(auto-fill, minmax(' + itemMinWith2 + ', ' + itemMaxWith2 + '))';
		root.current.style.gridAutoRows = '0';
		items.forEach(item => {
		  item.style.gridAutoRows = '0';
		  item.style.gridAutoColumns = '0';
		});
	  },[root.current])

	const resizeItems = useCallback(()=>{
		if(!root.current)
			return
		let rowGap    = parseInt(window.getComputedStyle(root.current).getPropertyValue('grid-row-gap')),
			rowHeight = parseInt(window.getComputedStyle(root.current).getPropertyValue('grid-auto-rows'));
		items.forEach(item => {
			let rowSpan = 0;
			let itemContent = item.querySelector(".adaptiv-grid-item-container");
			if(itemContent)
				rowSpan = Math.ceil((itemContent.getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
			item.style.gridRowEnd = 'span ' + rowSpan;
		});
	  },[items, root.current])

	const findItems = useCallback(()=>{
		if(root.current)
		{
			let child = root.current.querySelectorAll(".adaptiv-grid-item")
			setItems(Array.prototype.slice.call(child, 0))
		}
	},[root.current, children])

	useEffect(()=>{
		findItems()
	},[findItems])

	useEffect(()=>{
		bindStyles()
	},[bindStyles])

	useEffect(()=>{
		resizeItems()
	},[resizeItems, children])

	useEffect(()=>{
		window.addEventListener('resize', resizeItems)
		return ()=>{
			window.addEventListener('resize', resizeItems)
		}
	},[resizeItems])


	return(
	<div ref={root} className = {`adaptiv-grid-layout ${className}`}>
	  {children}
	</div>
	)
}


export default GridLayout

export {GridLayoutItem}