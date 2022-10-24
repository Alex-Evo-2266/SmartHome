import React from 'react'

export const Table = ({col, items})=>{

	// col=[{
	// 	title: "",
	// 	type: "",
	//  name: ""
	// }]

	// items=[{
	// 	data:{},
	// 	action: bool,
	// 	onClick: ()=>{}
	// }]

	if (!Array.isArray(col) || !col[0].title || !col[0].name || !Array.isArray(items))
		throw new Error("table: invalid input data")

	if (items.length === 0)
		return null

	console.log(items, col)
	
	const headList = ()=>{
		const arr = col.slice()
		if (typeof(items[0].onClick)==="function")
			arr.unshift("__check")
		return (arr)
	}

	

	return(
		<div className = {`table-box`}>
			<table>
				<thead>
					<tr>
					{
						headList().map((item, index)=>{
							if (index === 0 && item === "__check")
								return(<th key={index} className="__check"></th>)
							if (typeof(item)==="object")
								return(<th key={index}>{item.title}</th>)
							return(<th key={index}>{item}</th>)
						})
					}
					</tr>
				</thead>
				<tbody>
				{
					items.map((item, index)=>(
						<tr key={index} className={`${(item.action)?"active":""}`} onClick={(typeof(item.onClick)==="function")?()=>item.onClick(item.data):null}>
							{
								(typeof(item.onClick)==="function")?
								<td className="__check">
								{
									(item.action)?
									<i className="fas fa-check-circle"></i>:
									<i className="fas fa-times-circle"></i>
								}
								</td>:null
							}
							{
								col.map((item2, index2)=>{
									if (item2.type === "icon")
										return(
											<td key={index2}>
												<i className={item.data[item2.name]}></i>
											</td>
										)
									return(
										<td key={index2}>
											{item.data[item2.name]}
										</td>
									)	
								})
							}
						</tr>
					))
				}
				</tbody>
			</table>
		</div>
	)
}
