import { AutomationActionData, TypeEntityAction } from '../../../../entites/Automation/models/AutomationData'
import { BaseActionCard, Chips, FilledButton } from '../../../../shared/ui'
import { useCallback, useState } from 'react'
import { useAutomationAction } from '../lib/hooks/automationAction.hook'

interface MoreTextProps{
    value: AutomationActionData[]
    onChange?: (value: AutomationActionData[]) => void
}

export const AutomationActionField = ({value, onChange}:MoreTextProps) => {

    const [values, setValues] = useState<AutomationActionData[]>(value)
    const {addValue} = useAutomationAction()

    const setValueCascade = useCallback((type_entity: TypeEntityAction, entity:string, value:string) => {
        let newValue: AutomationActionData[] = [...values, {
            entity: entity,
            type_entity: type_entity,
            value: value
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
                    <Chips key={index} text={`${item.entity} = ${item.value}`} onDelete={()=>deleteValue(index)}/>
                ))
            }
            </div>
            <BaseActionCard className='add value'>
                <FilledButton onClick={()=>addValue(setValueCascade)}>+</FilledButton>
            </BaseActionCard>
        </div>
    )
}