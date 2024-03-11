import { AutomationEntityData, TypeEntity } from '../../../entites/Automation/models/AutomationData'
import { useAppDispatch } from '../../../shared/lib/hooks/redux'
import { hideDialog, hideFullScreenDialog, showDialog, showFullScreenDialog } from '../../../shared/lib/reducers/dialogReducer'
import { BaseActionCard, Chips, FilledButton } from '../../../shared/ui'
import { useCallback, useState } from 'react'
import { SelectionDialog } from '../../../shared/ui/Dialog/BaseDialog/SelectionDialog'
import { AutomationEntitiesPeriodDialog } from './AutomationEntitiesPeriod'
import { useDeviceSelectionDevice } from '../../../entites/Device'

interface MoreTextProps{
    value: AutomationEntityData[]
    onChange?: (value: AutomationEntityData[]) => void
}

const dialogItems = [
    {title:"time", data: TypeEntity.TIME},
    {title:"device", data: TypeEntity.DEVICE},
    {title:"service", data: TypeEntity.SERVICE},
]

export const AutomationEntitiesField = ({value, onChange}:MoreTextProps) => {

    const [values, setValues] = useState<AutomationEntityData[]>(value)
    const dispatch = useAppDispatch()
    const {selectionDeviceDialog} = useDeviceSelectionDevice()

    const setValueCascade = useCallback((type_entity: TypeEntity, data:string) => {
        let newValue = [...values, {
            entity: data,
            type_entity: type_entity
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
                if(type_entity === TypeEntity.DEVICE)
                    selectionDeviceDialog((device, field)=>{
                        setValueCascade(type_entity, `device.${device.system_name}.${field.name}`)
                    })
                else if(type_entity === TypeEntity.TIME)
                    dispatch(showFullScreenDialog(<AutomationEntitiesPeriodDialog onChange={(data)=>{
                        setValueCascade(type_entity, data)
                        dispatch(hideFullScreenDialog())
                    }}/>))
            }}/>))
    },[values])

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
                    <Chips key={index} text={item.entity} onDelete={()=>deleteValue(index)} big/>
                ))
            }
            </div>
            <BaseActionCard className='add value'>
                <FilledButton onClick={addValue}>+</FilledButton>
            </BaseActionCard>
        </div>
    )
}