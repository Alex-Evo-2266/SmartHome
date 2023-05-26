import React from "react"
import { useAppSelector } from "../../lib/hooks/redux"
import { MenuBlock } from "./MenuBlock"
import { Divider } from "../Divider/Divider"

export const SmallWindowMenu = () => {

    const menu = useAppSelector(state=>state.menu)

    return(
        <div className="bottom-sheets-menu-container">
            {
			menu.blocks.map((item, index)=>(
				<React.Fragment key={index}>
				{
					(index !== 0)?
					<Divider/>:
					null
				}
				<MenuBlock block={item} smallDisplay={true}/>
				</React.Fragment>
			))
		    }
        </div>
    )
}