import { Sign, TriggerConditionData, TypeEntityCondition } from '../../../entites/Trigger/models/TriggerData'
import { useAppDispatch } from '../../../shared/lib/hooks/redux'
import { hideDialog, showDialog } from '../../../shared/lib/reducers/dialogReducer'
import { BaseActionCard, Chips, FilledButton, TimePicker } from '../../../shared/ui'
import { useCallback, useState } from 'react'
import { SelectionDialog } from '../../../shared/ui/Dialog/BaseDialog/SelectionDialog'
import { getFormattedTime } from '../../../shared/lib/helpers/timeFormat'
import { useTriggerConditionDevice } from '../lib/hooks/TriggerDeviceCondition'

interface MoreTextProps{
    value: TriggerConditionData[]
    onChange?: (value: TriggerConditionData[]) => void
}

const dialogItems = [
    {title:"time", data: TypeEntityCondition.TIME},
    {title:"device", data: TypeEntityCondition.DEVICE},
    {title:"service", data: TypeEntityCondition.SERVICE},
]

function getSign(sign:Sign) {
    return sign === Sign.EQUALLY?"==":sign === Sign.LESS?"<":">"
}

export const TriggerConditionField = ({value, onChange}:MoreTextProps) => {

    const [values, setValues] = useState<TriggerConditionData[]>(value)
    const dispatch = useAppDispatch()
    const {triggerConditionDeviceDialog} = useTriggerConditionDevice()

    const setValueCascade = useCallback((type_entity: TypeEntityCondition, entity:string, value:string, sign: Sign = Sign.EQUALLY) => {
        let newValue = [...values, {
            entity: entity,
            type_entity: type_entity,
            sign: sign,
            value: value
        }]
        setValues(newValue)
        onChange && onChange(newValue)
    },[values])

    const addValue = useCallback(() => {
        dispatch(showDialog(<SelectionDialog
            noHide
            header='select type entity'
            items={dialogItems}
            onHide={()=>dispatch(hideDialog())}
            onSuccess={(type_entity)=>{
                dispatch(hideDialog())
                if(type_entity === TypeEntityCondition.TIME)
                    dispatch(showDialog(<TimePicker 
                        onHide={()=>dispatch(hideDialog())}
                        hours={0}
                        minutes={0}
                        onChange={(hours, minutes)=>{
                            setValueCascade(type_entity, "time", getFormattedTime(hours, minutes))
                            dispatch(hideDialog())
                        }}/>))
                if(type_entity === TypeEntityCondition.DEVICE)
                    triggerConditionDeviceDialog((data)=>{
                        setValueCascade(data.type_entity, data.entity, data.value, data.sign)
                    })
            }}
        />))
    },[values, triggerConditionDeviceDialog, setValueCascade])

    const deleteValue = useCallback((id: number) => {
        const data = values.filter((_, index)=>index !== id)
        onChange && onChange(data)
        setValues(data)
    },[values])

    return(
        <div className='more-text'>
            <div className='chips-container'>
            {
                values.map((item, index)=>(
                    <Chips key={index} text={`${item.entity} ${getSign(item.sign)} ${item.value}`} onDelete={()=>deleteValue(index)}/>
                ))
            }
            </div>
            <BaseActionCard className='add value'>
                <FilledButton onClick={addValue}>+</FilledButton>
            </BaseActionCard>
        </div>
    )
}