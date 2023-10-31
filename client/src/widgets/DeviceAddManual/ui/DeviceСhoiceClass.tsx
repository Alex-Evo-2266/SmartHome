import { useEffect } from "react"
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import { Card, ListContainer, ListItem } from "../../../shared/ui"
import { DeviceOption } from "../../../features/DeviceOption"

interface DeviceAddChoiceSlassDialogProps{
    onClick: (data:DeviceOption)=>void
}

export const DeviceAddChoiceSlassDialog = (prop:DeviceAddChoiceSlassDialogProps) => {

	const {deviceOption} = useAppSelector(state=>state.deviceOptions)

	useEffect(()=>{
		console.log(deviceOption[0])
	},[deviceOption])

	return(
		<>
			<div className="device-add-container">
				<Card header='no date'></Card>
			</div>
			<ListContainer transparent>
				{
					deviceOption.map((item, index)=>(
						<ListItem icon={<img src={item.class_img_url}></img>} hovered key={index} header={item.class_name} onClick={()=>prop.onClick(item)}/>
					))
				}
			</ListContainer>
		</>
	)
}