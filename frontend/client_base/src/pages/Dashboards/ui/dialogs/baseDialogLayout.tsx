import { ArrowRight, Chips, FullScreenTemplateDialog, ScreenSize, useScreenSize} from "alex-evo-sh-ui-kit"
import './widgetConfigDialog.scss'
import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { Dashboard, DashboardMainProvider, DashboardSchema, LayoutSchemaID, WidgetSchema } from "alex-evo-web-constructor"
import { IcreateRuntime } from "../../../../features/Dashboard/helpers/dashboardRegistary"
import { LayoutChoiseDialog } from "./LayoutChoiseDialog"

interface WidgetConfigDialogProps{
    onHide: ()=>void
    onSave: (data: LayoutSchemaID)=>void
    runtime: IcreateRuntime
    data?: LayoutSchemaID | null
}

export const LayoutConfigDialog = ({onHide, runtime, onSave, data = null}:WidgetConfigDialogProps) => {

    // const [step, setStep] = useState<number>(0)
    const {screen} = useScreenSize()
    const [condidat, setCondidat] = useState<LayoutSchemaID | null>(data)
    const schema = useMemo<DashboardSchema>(()=>{
        return {
            version: "0",
            blocks:{
                "1": {
                    id: "1",
                    type: "test"
                },
            },
            rootWidgets:["1", "1", "1", "1", "1", "1"],
            layout: condidat ?? "empty"
        }
    },[condidat])

    const saveHandler = useCallback(() => {
        if(condidat)
            onSave(condidat)
    },[condidat, onSave])

    const classSize = {
        [ScreenSize.MOBILE]: "mobile",
        [ScreenSize.STANDART]: "",
        [ScreenSize.BIG_SCREEN]: "big",
    }

    // const next = useCallback(() => {
    //     setStep(prev=>steps.length - 1 <= prev ? prev : prev + 1)
    // },[steps])

    // const setStepHandler = useCallback((step:number) => {
    //     if(step < 0)step = 0
    //     if(step > steps.length - 1)step = steps.length - 1
    //     setStep(step)
    // },[steps])

    // const renderButtons = useMemo(()=>{
    //     const btns:DialogButtonType[] = [{
    //         text: "cancel",
    //         hide: true
    //     }]
    //     if(steps.length - 1 > step)
    //     {
    //         btns.unshift({
    //             text: "next",
    //             onClick: next
    //         })
    //     }
    //     else{
    //         btns.push({
    //             text: "save",
    //             success: true
    //         })
    //     }
    //     return btns
    // },[steps, step, next])

    useEffect(()=>{
        runtime.layouts.register({
            type: "empty",
            component: Fragment
        })
        runtime.registry.register({
            type: "test",
            component: ()=><div style={{padding: "10px", borderRadius: "10px", background:"var(--Primary-color)"}}>test</div>
        })
    },[])

    // const curpage = steps[step]
    // const Component = curpage.component

    return(
        <FullScreenTemplateDialog maxWidth="calc(90% - 80px)" onHide={onHide} onSave={saveHandler}>
            {/* {
                steps.length > 1?
                <div className={`widget-dialog_steps`}>
                    {
                        steps.map((item, i)=>(
                            <Fragment key={item.title}>
                            <Chips 
                                className={`widget-dialog_steps_step${step===i?"_active":""}`} 
                                text={item.title}
                                onClick={step>i ? ()=>setStepHandler(i) : undefined}
                            />
                            {
                                (steps.length - 1 !== i)?
                                <ArrowRight/>:null
                            }
                            </Fragment>
                        ))
                    }
                </div>
                :null
            } */}
            
            <div className={`widget-dialog widget-dialog__${classSize[screen]}`}>
                <div className={`widget-dialog_left-column widget-dialog_left-column__${classSize[screen]}`}>
                    {
                        runtime && 
                        <DashboardMainProvider
                            runtime={runtime}
                            schema={schema}
                        >
                            <Dashboard
                                schema={schema}
                            />
                        </DashboardMainProvider>
                    }
                </div>
                <div className={`widget-dialog_right-column widget-dialog_right-column__${classSize[screen]}`}>
                    {/* <Component condidat={condidat} setCondidat={setCondidat}/> */}
                    <LayoutChoiseDialog condidat={condidat} setCondidat={setCondidat}/>
                </div>
            </div>
        </FullScreenTemplateDialog>
    )
}