import { ArrowRight, Chips, FullScreenTemplateDialog, ScreenSize, useScreenSize} from "alex-evo-sh-ui-kit"
import './widgetConfigDialog.scss'
import { Fragment, useCallback, useMemo, useState } from "react"
import { Dashboard, DashboardMainProvider, DashboardSchema, WidgetSchema } from "alex-evo-web-constructor"
import { IcreateRuntime } from "../../helpers/dashboardRegistary"
import { DialogButtonType } from "alex-evo-sh-ui-kit/dist/lib/ui/Dialog/types"
import { WidgetStepDialogProps } from "./types"

interface WidgetConfigDialogProps{
    onHide: ()=>void
    onSave: (data: WidgetSchema)=>void
    runtime: IcreateRuntime
    steps:{
            title: string,
            component: React.FC<WidgetStepDialogProps>
        }[]
    data?: WidgetSchema | null
}

export const WidgetConfigDialog = ({onHide, steps, runtime, onSave, data = null}:WidgetConfigDialogProps) => {

    const [step, setStep] = useState<number>(0)
    const {screen} = useScreenSize()
    const [condidat, setCondidat] = useState<WidgetSchema | null>(data)
    const schema = useMemo<DashboardSchema>(()=>{
        return {
            version: "0",
            blocks:condidat?{
                "1": condidat,
            }:
            {"1":{
                type: "empty",
                id: "empty"
            }},
            rootWidgets:condidat?["1"]:[],
            layout: "flex"
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

    const next = useCallback(() => {
        setStep(prev=>steps.length - 1 <= prev ? prev : prev + 1)
    },[steps])

    const setStepHandler = useCallback((step:number) => {
        if(step < 0)step = 0
        if(step > steps.length - 1)step = steps.length - 1
        setStep(step)
    },[steps])

    const renderButtons = useMemo(()=>{
        const btns:DialogButtonType[] = [{
            text: "cancel",
            hide: true
        }]
        if(steps.length - 1 > step)
        {
            btns.unshift({
                text: "next",
                onClick: next
            })
        }
        else{
            btns.push({
                text: "save",
                success: true
            })
        }
        return btns
    },[steps, step, next])

    const curpage = steps[step]
    const Component = curpage.component

    return(
        <FullScreenTemplateDialog maxWidth="calc(90% - 80px)" onHide={onHide} btns={renderButtons} onSave={saveHandler}>
            {
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
            }
            
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
                    <Component condidat={condidat} setCondidat={setCondidat}/>
                </div>
            </div>
        </FullScreenTemplateDialog>
    )
}