import { TriggerActionData, TypeEntityAction } from '../../../entites/Trigger/models/TriggerData'
import { useAppDispatch } from '../../../shared/lib/hooks/redux'
import { hideDialog, showDialog } from '../../../shared/lib/reducers/dialogReducer'
import { BaseActionCard, Chips, FilledButton } from '../../../shared/ui'
import { useCallback, useState } from 'react'
import { SelectionDialog } from '../../../shared/ui/Dialog/BaseDialog/SelectionDialog'
import { TextDialog } from '../../../shared/ui/Dialog/BaseDialog/TextDialog'
import { useTriggerActionDevice } from '../lib/hooks/TriggerDeviceAction'

interface MoreTextProps{
    value: TriggerActionData[]
    onChange?: (value: TriggerActionData[]) => void
}

const dialogItems = [
    {title:"script", data: TypeEntityAction.SCRIPTS},
    {title:"device", data: TypeEntityAction.DEVICE},
    {title:"service", data: TypeEntityAction.SERVICE},
    {title:"delay", data: TypeEntityAction.DELAY},
]

export const TriggerActionField = ({value, onChange}:MoreTextProps) => {

    const [values, setValues] = useState<TriggerActionData[]>(value)
    const dispatch = useAppDispatch()
    const {triggerActionDeviceDialog} = useTriggerActionDevice()

    const setValueCascade = useCallback((type_entity: TypeEntityAction, entity:string, value:string) => {
        let newValue: TriggerActionData[] = [...values, {
            entity: entity,
            type_entity: type_entity,
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
                if(type_entity === TypeEntityAction.DELAY)
                    dispatch(showDialog(<TextDialog 
                        onHide={()=>dispatch(hideDialog())}
                        type='number'
                        min={0}
                        max={1000}
                        onSuccess={(value)=>{
                            setValueCascade(type_entity, "delay", value)
                            dispatch(hideDialog())
                        }}/>))
                if(type_entity === TypeEntityAction.DEVICE)
                    triggerActionDeviceDialog((data)=>{
                        setValueCascade(data.type_entity, data.entity, data.value)
                    })
            }}
        />))
    },[values, triggerActionDeviceDialog, setValueCascade])

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
                    <Chips key={index} text={`${item.entity} = ${item.value}`} onDelete={()=>deleteValue(index)}/>
                ))
            }
            </div>
            <BaseActionCard className='add value'>
                <FilledButton onClick={addValue}>+</FilledButton>
            </BaseActionCard>
        </div>
    )
}