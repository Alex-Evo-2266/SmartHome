import { useCallback, useState } from "react"
import { useAppDispatch } from "../../../shared/lib/hooks/redux"
import { hideFullScreenDialog } from "../../../shared/lib/reducers/dialogReducer"
import { FieldContainer, FullScrinTemplateDialog, SelectField, TextField } from "../../../shared/ui"
import { FieldDevice } from "../../../entites/Device"
import { Sign } from "../../../entites/Automation"

interface AutomationConditionNumberProps{
	onChange: (sign: Sign, value: string)=>void
    field: FieldDevice
}

export const AutomationConditionNumber = ({onChange, field}:AutomationConditionNumberProps) => {

    const dispatch = useAppDispatch()
    const [sign, setSign] = useState<Sign>(Sign.EQUALLY)
    const [value, setValue] = useState<string>(String(field.low))

    const hide = () => {
		dispatch(hideFullScreenDialog())
	}

    const changeSign = useCallback((value: string)=>{
        if(Sign.EQUALLY === value || Sign.LESS === value || Sign.MORE === value)
            setSign(value)
    },[])

    const changeValue = useCallback((value: string)=>{
        if(Number(value) < Number(field.low))
            value = field.low
        if(Number(value) > Number(field.high))
            value = field.high
        setValue(value)
    },[field])

    const save = useCallback(() => {
        onChange(sign, value)
	},[sign, value])

    return(
        <FullScrinTemplateDialog onHide={hide} onSave={save} header={"Trigger"}>
            <FieldContainer header="sign">
                <SelectField border items={[{title:"==", value: Sign.EQUALLY},{title:"<", value: Sign.LESS},{title:">", value: Sign.MORE}]} onChange={changeSign} value={sign}/>
            </FieldContainer>
            <FieldContainer header="value">
                <TextField min={Number(field.low) || 0} max={Number(field.high) || 100} type="number" border onChange={(e)=>changeValue(e.target.value)} value={value}/>
            </FieldContainer>
        </FullScrinTemplateDialog>
    )
}
