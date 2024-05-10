import { useEffect } from "react"
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import { Card, ListContainer, ListItem } from "alex-evo-sh-ui-kit"
import { DeviceOption } from "../../../features/DeviceOption"

interface DeviceTypeDialogProps{
    option: DeviceOption
    onNext: (type: string)=>void
    onPrev: ()=>void
}

export const DeviceTypeDialog = (prop:DeviceTypeDialogProps) => {
console.log(prop.option.types)
	return(
		<>
			<ListContainer transparent>
				{
					prop.option.types.map((item, index)=>(
						<ListItem hovered key={index} header={item.name} onClick={()=>prop.onNext(item.name)}/>
					))
				}
			</ListContainer>
		</>
	)
}