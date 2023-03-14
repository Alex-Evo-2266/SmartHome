import React from 'react'

export const TableCell = ({col, item})=>{

	if (typeof(item.data[col.name]) !== "object" && col.type === "icon")
		return(
			<td>
				<i className={item.data[col.name]}></i>
			</td>
		)
	if (typeof(item.data[col.name]) !== "object")
		return(
			<td>
				{item.data[col.name]}
			</td>
		)

	if (col.type === "icon")
		return(
			<td style={{color:item.data[col.name]?.color ?? "white"}}>
				<i className={item.data[col.name]?.title ?? ""}></i>
			</td>
			)
	if (col.type === "btn")
		return(
			<td style={{color:item.data[col.name]?.color ?? "white"}}>
				{
					(!item.data[col.name].onClick)?
					item.data[col.name].title:
					<button className='btn' onClick={item.data[col.name].onClick}>{item.data[col.name].title}</button>
				}	
			</td>
			)
	if (col.type === "btn-icon")
		return(
			<td style={{color:item.data[col.name]?.color ?? "white", cursor: "pointer"}}>
				{
					(!item.data[col.name].onClick)?
					item.data[col.name].title:
					<i className={item.data[col.name].title} onClick={item.data[col.name].onClick}></i>
				}	
			</td>
			)
	return(
		<td style={{color:item.data[col.name]?.color ?? "white"}}>
			{item.data[col.name].title}
		</td>
	)
}
