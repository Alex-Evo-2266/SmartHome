import React from "react"
import {NavLink} from 'react-router-dom'

export const CastomLink = ({to, children}) => {
	if (to?.indexOf("/") !== 0)
		return (
			<a href = {to}>
				{children}
			</a>
		)
	return (
		<NavLink to = {to}>
			{children}
		</NavLink>
	)
}