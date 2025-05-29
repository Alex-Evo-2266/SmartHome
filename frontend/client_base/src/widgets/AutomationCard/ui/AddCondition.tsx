import { BaseActionCard, BasicTemplateDialog, Button, NumberField, SelectionDialog, TextField } from "alex-evo-sh-ui-kit"
import { DialogPortal, SelectField } from "../../../shared"
import { useCallback, useMemo, useState } from "react"
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import {ConditionItem, Operation} from '../../../entites/automation';
import { TypeDeviceField } from "../../../entites/devices";
import { splitEnum } from "../../../shared/lib/helpers/enumStrimg";

interface AddConditionProps {
  onHide: ()=>void
  onSave: (data: ConditionItem)=>void
}

export const AddCondition: React.FC<AddConditionProps> = ({onHide, onSave}) => {

    const [service1, setService1] = useState("device")
    const [object1, setObject1] = useState("")
    const [data1, setData1] = useState("")

    const [service2, setService2] = useState("value")
    const [object2, setObject2] = useState("")
    const [data2, setData2] = useState("")

    const [operation, setOperation] = useState<Operation>(Operation.EQUAL)

    const [objectSecrch, setObjectSecrch] = useState<null | 1 | 2>(null)
    const [dataSecrch, setDataSecrch] = useState<null | 1 | 2>(null)

    const {devicesData} = useAppSelector(state=>state.devices)

    const getFieldType1 = useMemo<{type:"any"|"binary"|"number"|"enum", option: string[]}>(()=>{
        if(service1 === 'value'){
            return {type: 'any', option:[]}
        }
        if(service1 === 'device'){
            const device = devicesData.find(item=>item.system_name === object1)
            if(device === undefined)
                return {type: 'any', option:[]}
            const field = device.fields?.find(item=>item.name === data1)
            if(field === undefined)
                return {type: 'any', option:[]}
            if(field.type === TypeDeviceField.BINARY)
                return {type: 'binary', option:[]}
            if(field.type === TypeDeviceField.NUMBER)
                return {type: 'number', option:[]}
            if(field.type === TypeDeviceField.ENUM)
                return {type: 'enum', option: splitEnum(field.enum_values ?? "")}
            return {type: 'any', option:[]}
        }
        return {type: 'any', option:[]}
    },[service1, object1, data1])

    const getFieldType2 = useMemo<{type:"any"|"binary"|"number"|"enum", option: string[]}>(()=>{
        if(service2 === 'value'){
            return {type: 'any', option:[]}
        }
        if(service2 === 'device'){
            const device = devicesData.find(item=>item.system_name === object2)
            if(device === undefined)
                return {type: 'any', option:[]}
            const field = device.fields?.find(item=>item.name === data2)
            if(field === undefined)
                return {type: 'any', option:[]}
            if(field.type === TypeDeviceField.BINARY)
                return {type: 'binary', option:[]}
            if(field.type === TypeDeviceField.NUMBER)
                return {type: 'number', option:[]}
            if(field.type === TypeDeviceField.ENUM)
                return {type: 'enum', option: splitEnum(field.enum_values ?? "")}
            return {type: 'any', option:[]}
        }
        return {type: 'any', option:[]}
    },[service2, object2, data2])

    const serviceHeandler = (value: string, argNumber: 1 | 2) => {
        if(argNumber === 1)
            setService1(prev=>{
                if(prev !== value){
                    setObject1("")
                }
                return value
            })
        if(argNumber === 2)
            setService2(prev=>{
                if(prev !== value){
                    setObject2("")
                }
                return value
            })
    }

    const objectHeandler = (value: string, argNumber: 1 | 2) => {
        if(argNumber === 1)
            setObject1(prev=>{
                if(prev !== value){
                    setData1("")
                }
                return value
            })
        if(argNumber === 2)
            setObject2(prev=>{
                if(prev !== value){
                    setData2("")
                }
                return value
            })
    }

    const dataHeandler = (value: string, argNumber: 1 | 2) => {
        if(argNumber === 1)
            setData1(value)
        if(argNumber === 2)
            setData2(value)
    }

    const operationHandler = useCallback((value: string) => {
        setOperation(prev =>{
            if(
                ((prev == Operation.EQUAL || prev == Operation.NOT_EQUAL) && (value != Operation.EQUAL && value != Operation.NOT_EQUAL)) 
                || ((value == Operation.EQUAL || value == Operation.NOT_EQUAL) && (prev != Operation.EQUAL && prev != Operation.NOT_EQUAL))
            ){
                setData1("")
                setData2("")
            }
            return value as Operation
        })
    },[service2 ,service1])

    const getObject = useCallback((argNumer: 1 | 2)=>{
        if(argNumer == 1 && service1 == "device"){
            return devicesData.map(item=>({title: item.name, data: item.system_name}))
        }
        if(argNumer == 2 && service2 == "device"){
            return devicesData.map(item=>({title: item.name, data: item.system_name}))
        }
        return []
    },[service1, devicesData])


    const getData = useCallback((argNumer: 1 | 2, is_number: boolean = false)=>{
        if(argNumer == 1 && service1 == "device"){
            const device = devicesData.find(item=>item.system_name === object1)
            if(!device)
                return []
            if(is_number)
                return device.fields?.filter(item=>item.type === TypeDeviceField.NUMBER).map(item2 => ({title: item2.name, data: item2.name})) ?? []
            return device.fields?.map(item2 => ({title: item2.name, data: item2.name})) ?? []
        }
        if(argNumer == 2 && service2 == "device"){
            const device = devicesData.find(item=>item.system_name === object2)
            if(!device)
                return []
            if(is_number)
                return device.fields?.filter(item=>item.type === TypeDeviceField.NUMBER).map(item2 => ({title: item2.name, data: item2.name})) ?? []
            return device.fields?.map(item2 => ({title: item2.name, data: item2.name})) ?? []
        }
        return []
    },[service1, object1, devicesData, service2, object2])

    const valid = (data: ConditionItem) => {
        let arg = [true, true]
        if(data.arg1_service === "value"){
            if(data.arg1_data === "")
                return false
        }
        else if(data.arg1_service === "device"){
            if(data.arg1_object === "")
                return false
            if(data.arg1_data === "")
                return false
        }
        else{
            arg[0] = service1 !== "" && object1 !== "" && data1 !== ""
        }
        if(data.arg2_service === "value"){
            if(data.arg2_data === "")
                return false
        }
        else if(data.arg2_service === "device"){
            if(data.arg2_object === "")
                return false
            if(data.arg2_data === "")
                return false
        }
        else{
            arg[1] = service2 !== "" && object2 !== "" && data2 !== ""
        }
        return arg[0] && arg[1]
    }

    const save = useCallback(()=>{
        if(valid({arg1_service: service1, arg1_object: object1, arg1_data: data1, operation, arg2_service: service2, arg2_object: object2, arg2_data: data2}))
            onSave({arg1_service: service1, arg1_object: object1, arg1_data: data1, arg2_service: service2, arg2_object: object2, arg2_data: data2, operation})
    },[service1, object1, data1, operation, service2, object2, data2, onSave])


    return(
        <>
        <BasicTemplateDialog 
        header="select condition" 
        onHide={onHide} 
        action={
            <BaseActionCard>
                <Button styleType="text" onClick={onHide}>cancel</Button>
                <Button styleType="text" onClick={save}>save</Button>
            </BaseActionCard>
        }
        >
            <div style={{padding: "10px"}}>
                <SelectField onChange={data=>serviceHeandler(data, 1)} value={service1} border items={["device", "value"]} placeholder="service"/>
                {
                    service1 !== "value"?
                    <TextField placeholder="object" border readOnly value={object1} onClick={()=>setObjectSecrch(1)}/>:
                    null
                }   
                {
                    object1 !== ""?
                        <TextField placeholder="field" border readOnly value={data1} onClick={()=>setDataSecrch(1)}/>:
                    service1 === "value"?
                        operation === Operation.EQUAL || operation === Operation.NOT_EQUAL?
                        getFieldType2.type === 'enum'?
                            <SelectField border items={getFieldType2.option} value={data2} onChange={(val)=>dataHeandler(val, 2)}/>:
                            <TextField placeholder="data" border value={data1} onChange={(e)=>dataHeandler(e.target.value, 1)}/>:
                            <NumberField placeholder="data" border value={Number(data1)} onChange={(value)=>dataHeandler(String(value), 1)}/>:
                    null
                }
            </div>
            <div style={{padding: "10px"}}>
                <SelectField border items={Object.values(Operation).map(item=>({title:item, value:item}))} onChange={operationHandler} value={operation}/>
            </div>
            <div style={{padding: "10px"}}>
                <SelectField onChange={data=>serviceHeandler(data, 2)} value={service2} border items={["device", "value"]} placeholder="service"/>
                {
                    service2 !== "value"?
                    <TextField placeholder="object" border readOnly value={object2} onClick={()=>setObjectSecrch(2)}/>:
                    null
                }   
                {
                    object2 !== ""?
                        <TextField placeholder="field" border readOnly value={data2} onClick={()=>setDataSecrch(2)}/>:
                    service2 === "value"?
                        operation === Operation.EQUAL || operation === Operation.NOT_EQUAL?
                            getFieldType1.type === 'enum'?
                            <SelectField border items={getFieldType1.option} value={data2} onChange={(val)=>dataHeandler(val, 2)}/>:
                            <TextField placeholder="data" border value={data2} onChange={(e)=>dataHeandler(e.target.value, 2)}/>:
                            <NumberField placeholder="data" border value={Number(data2)} onChange={(value)=>dataHeandler(String(value), 2)}/>:
                    null
                }
            </div>

        </BasicTemplateDialog>
        {
            objectSecrch &&
            <DialogPortal>
                <SelectionDialog header="get object" items={getObject(objectSecrch)} onHide={()=>setObjectSecrch(null)} onSuccess={data => objectHeandler(data, objectSecrch)}/>
            </DialogPortal>
        }
        {
            dataSecrch &&
            <DialogPortal>
                <SelectionDialog 
                header="get data" 
                items={getData(dataSecrch, ![Operation.EQUAL, Operation.NOT_EQUAL].includes(operation))} 
                onHide={()=>setDataSecrch(null)} 
                onSuccess={(data)=>dataHeandler(data, dataSecrch)}
                />
            </DialogPortal>
        }
        </>
        
    )
}