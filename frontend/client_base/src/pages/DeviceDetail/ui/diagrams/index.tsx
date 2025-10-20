import { TypeDeviceField } from "../../../../entites/devices";
import { BooleanTimelineChart } from "./BooleanDiagrams";
import { NumberDiagram } from "./NumberDiagrams";
import { DiagramProps } from "./props";
import Timeline from "./Text";


export const Diagramm:React.FC<DiagramProps> = (props) => {

	const Components = {
		[TypeDeviceField.NUMBER]: NumberDiagram,
		[TypeDeviceField.BASE]: Timeline,
		[TypeDeviceField.BINARY]: BooleanTimelineChart,
		[TypeDeviceField.COUNTER]: Timeline,
		[TypeDeviceField.ENUM]: Timeline,
		[TypeDeviceField.TEXT]: Timeline
	}

	if(props.data === null)
		return null

	const Component = Components[props.data.type]

	return <Component {...{...props}}/>
}