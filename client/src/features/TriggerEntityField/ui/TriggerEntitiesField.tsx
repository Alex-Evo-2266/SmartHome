import { TriggerEntityData, TypeEntity } from '../../../entites/Trigger/models/TriggerData'
import { useAppDispatch } from '../../../shared/lib/hooks/redux'
import { hideDialog, hideFullScreenDialog, showDialog, showFullScreenDialog } from '../../../shared/lib/reducers/dialogReducer'
import { BaseActionCard, Chips, FilledButton, TimePicker } from '../../../shared/ui'
import { useCallback, useState } from 'react'
import { SelectionDialog } from '../../../shared/ui/Dialog/BaseDialog/SelectionDialog'
import { TriggerEntitiesDeviceDialog } from './TriggerEntitiesDevice'
import { TriggerEntitiesPeriodDialog } from './TriggerEntitiesPeriod'
import { getFormattedTime } from '../../../shared/lib/helpers/timeFormat'

interface MoreTextProps{
    value: TriggerEntityData[]
    onChange?: (value: TriggerEntityData[]) => void
}

const dialogItems = [
    {title:"time", data: TypeEntity.TIME},
    {title:"device", data: TypeEntity.DEVICE},
    {title:"period", data: TypeEntity.PERIOD},
    {title:"service", data: TypeEntity.SERVICE},
]

export const TriggerEntitiesField = ({value, onChange}:MoreTextProps) => {

    const [values, setValues] = useState<TriggerEntityData[]>(value)
    const dispatch = useAppDispatch()

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
                if(type_entity === TypeEntity.TIME)
                    dispatch(showDialog(<TimePicker 
                        onHide={()=>dispatch(hideDialog())}
                        hours={0}
                        minutes={0}
                        onChange={(hours, minutes)=>{
                            setValueCascade(type_entity, getFormattedTime(hours, minutes))
                            dispatch(hideDialog())
                        }}/>))
                else if(type_entity === TypeEntity.DEVICE)
                    dispatch(showFullScreenDialog(<TriggerEntitiesDeviceDialog onChange={(data)=>{
                        setValueCascade(type_entity, data)
                        dispatch(hideFullScreenDialog())
                    }}/>))
                else if(type_entity === TypeEntity.PERIOD)
                    dispatch(showFullScreenDialog(<TriggerEntitiesPeriodDialog onChange={(data)=>{
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