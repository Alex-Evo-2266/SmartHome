import { useCallback, useState } from 'react'
import { useAutomationCondition } from '../lib/hooks/automationCondition.hook'
import { AutomationConditionData, Sign } from '../../../../entites/Automation'
import { TypeEntityCondition } from '../../../../entites/Automation/models/AutomationData'
import { BaseActionCard, Chips, FilledButton } from 'alex-evo-sh-ui-kit'

interface MoreTextProps{
    value: AutomationConditionData[]
    onChange?: (value: AutomationConditionData[]) => void
}

function getSign(sign:Sign) {
    return sign === Sign.EQUALLY?"==":sign === Sign.LESS?"<":">"
}

export const AutomationConditionField = ({value, onChange}:MoreTextProps) => {

    const [values, setValues] = useState<AutomationConditionData[]>(value)
    const {addValue} = useAutomationCondition()

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
                <FilledButton onClick={()=>addValue(setValueCascade)}>+</FilledButton>
            </BaseActionCard>
        </div>
    )
}