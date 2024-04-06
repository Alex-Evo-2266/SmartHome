import { AutomationEntityData, TypeEntity } from '../../../../entites/Automation/models/AutomationData'
import { BaseActionCard, Chips, FilledButton } from '../../../../shared/ui'
import { useCallback, useState } from 'react'
import { useAutomationTrigger } from '../lib/hooks/automationCondition.hook'

interface MoreTextProps{
    value: AutomationEntityData[]
    onChange?: (value: AutomationEntityData[]) => void
}

export const AutomationEntitiesField = ({value, onChange}:MoreTextProps) => {

    const [values, setValues] = useState<AutomationEntityData[]>(value)
    const {addValue} = useAutomationTrigger()

    const setValueCascade = useCallback((type_entity: TypeEntity, data:string) => {
        let newValue = [...values, {
            entity: data,
            type_entity: type_entity
        }]
        setValues(newValue)
        onChange && onChange(newValue)
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
                <FilledButton onClick={()=>addValue(setValueCascade)}>+</FilledButton>
            </BaseActionCard>
        </div>
    )
}