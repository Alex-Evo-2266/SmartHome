import React, { useCallback, useEffect, useRef, useState } from 'react'

export const AdaptivGridItem = ({children, className=""})=>{
	return(
		<div className={`adaptiv-grid-item ${className}`}>
			{children}
		</div>
	)
}

export const AdaptivGrid = ({children,className, itemClass, gridRowGap = "10px", gridColumnGap = "5px", itemMinWith="100px", itemMaxWith="400px"})=>{
	const root = useRef(null)
	const [items, setItems] = useState([])

	const bindStyles = useCallback(()=>{
		if (!root.current) return;
		root.current.style.display = 'grid';
		root.current.style.gridRowGap = gridRowGap;
		root.current.style.gridColumnGap = gridColumnGap;
		root.current.style.gridTemplateColumns = 'repeat(auto-fill, minmax(' + itemMinWith + ', ' + itemMaxWith + '))';
		root.current.style.gridAutoRows = '0';
		items.forEach(item => {
		  item.style.gridAutoRows = '0';
		  item.style.gridAutoColumns = '0';
		});
	  },[root.current])

	const resizeItems = useCallback(()=>{
		let rowGap    = parseInt(window.getComputedStyle(root.current).getPropertyValue('grid-row-gap')),
			rowHeight = parseInt(window.getComputedStyle(root.current).getPropertyValue('grid-auto-rows'));
		items.forEach(item => {
		  let rowSpan = 0;
		  let itemContent = item.querySelector(itemClass);
		  rowSpan = Math.ceil((itemContent.getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
		  item.style.gridRowEnd = 'span ' + rowSpan;
		});
	  },[items, root.current])

	const findItems = useCallback(()=>{
		if(root.current)
			setItems(root.current.querySelectorAll(".adaptiv-grid-item"))
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
		['resize'].map(event => window.addEventListener(event, resizeItems));
		return ()=>{
			['resize'].map(event => window.removeEventListener(event, resizeItems));
		}
	},[resizeItems])


	return(
    <div ref={root} className = {`adaptiv-grid ${className}`}>
      {children}
    </div>
	)
}
