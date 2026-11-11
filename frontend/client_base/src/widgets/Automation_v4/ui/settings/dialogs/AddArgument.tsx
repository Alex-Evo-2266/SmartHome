import { DialogPortal } from "@src/shared"
import { BaseDialog, Form, FormRef } from "alex-evo-sh-ui-kit"
import { useCallback, useRef, useState } from "react"
import { Automation } from "@src/entites/automation_v4";

type Parameters = Automation["parameters"];
type Parameter = Parameters[string];
type Definition = Parameter["definition"];
type DefinitionType = Exclude<Definition["type"], "enum" | "for_path">

const DEFINITION_TYPES: {
  value: DefinitionType;
  title: string;
}[] = [
  { value: "string", title: "Строка" },
  { value: "number", title: "Число" },
  { value: "boolean", title: "Логическое значение" },
  { value: "time", title: "Время" },
  { value: "path", title: "Путь" },
];

export type FormDataAddArgument = {name: string, type:DefinitionType, discription: string}

export const AddArgument = ({onHide, onSuccess}:{onSuccess: (kind:FormDataAddArgument)=>void, onHide: ()=>void}) => {

    const formRef = useRef<FormRef<FormDataAddArgument>>(null)

    const [data, setData] = useState<FormDataAddArgument>({
        name: "",
        type: "string",
        discription: ""
    })

    const addArgument = useCallback((data: FormDataAddArgument)=>{
        console.log(data)
        setData(data)
        onSuccess(data)
    },[])

    return (
        <DialogPortal>
            <BaseDialog header="add argument" onSuccess={()=>formRef.current?.submit()} onHide={onHide} onCancel={onHide}>
                <Form ref={formRef} onFinish={addArgument} value={data}>
                    <Form.TextInput placeholder="name" border name="name"/>
                    <Form.TextInput placeholder="discription" border name="discription"/>
                    <Form.SelectInput placeholder="type" border name="type" items={DEFINITION_TYPES}/>
                </Form>
            </BaseDialog>
        </DialogPortal>
    )
}