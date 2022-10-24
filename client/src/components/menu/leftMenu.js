import React from 'react'
import { useAuth } from '../../hooks/auth.hook'
import { CastomLink } from './castomLink'


export const LeftMenu = ({visible, hide, insluedField, otherField})=>{
	const {logout} = useAuth()

	const close = ()=>{
		if (typeof(hide) == "function")
			hide()
	}

	return(
		<>
		{
			(visible)?
			<div className="backGlass" onClick={close} style={{zIndex:96}}></div>
			:null
		}
		<div onClick={close} className={`navigationRail ${(visible)?"active":""}`}>
			<ul className="baseMenu">
				<li>
					<CastomLink to = "/home">
						<i className="fas fa-home"></i>
						<span>Home</span>
					</CastomLink>
				</li>
				<li>
					<CastomLink to = "/devices">
						<i className="fas fa-plug"></i>
						<span>Devices</span>
					</CastomLink>
				</li>
				<li>
					<CastomLink to = "/settings">
						<i className="fas fa-cogs"></i>
						<span>Options</span>
					</CastomLink>
				</li>
				{
					(insluedField)?
					insluedField.map((item,index)=>(
						<li key={index}>
							<CastomLink to={item.url}>
								<i className={item.iconClass}></i>
								<span>{item.title}</span>
							</CastomLink>
						</li>
					)):null
	  			}
			</ul>
			{
				(visible)?
				<>
				
				<div className="dividers"></div>
				<ul className="otherMenu">
				{
					(otherField)?
					otherField.map((item,index)=>(
						<li key={index}>
							<CastomLink to={item.url}>
								<i className={item.iconClass}></i>
								<span>{item.title}</span>
							</CastomLink>
						</li>
					)):null
				}
				</ul>
					<div className="dividers"></div>
					<ul className="otherMenu">
						<li>
		  					<button className="menu-btn" onClick={()=>logout()}>
								<i className="fas fa-sign-out-alt"></i>
								<span>logout</span>
		  					</button>
						</li>
	  				</ul>
				</>:null
			}
		</div>
		</>
	)
}