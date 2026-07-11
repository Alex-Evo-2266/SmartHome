import { ArrowRight, Chips, FullScreenTemplateDialog} from "alex-evo-sh-ui-kit"
import './widgetConfigDialog.scss'
import React, { useCallback, useMemo, useState } from "react"
import { useWidgetsStore } from "../../helpers/widgetsStore"
import { Dashboard, DashboardMainProvider, DashboardSchema, WidgetSchema } from "alex-evo-web-constructor"
import { createRuntime } from "../../helpers/dashboardRegistary"
import { DialogButtonType } from "alex-evo-sh-ui-kit/dist/lib/ui/Dialog/types"
import { WidgetStepDialogProps } from "./types"

interface WidgetConfigDialogProps{
    onHide: ()=>void
    steps:{
            title: string,
            component: React.FC<WidgetStepDialogProps>
        }[]
}

export const WidgetConfigDialog = ({onHide, steps}:WidgetConfigDialogProps) => {

    const [step, setStep] = useState<number>(0)
    const widgetsStore = useWidgetsStore()
    const runtime = useMemo(()=>widgetsStore ? createRuntime(widgetsStore):null,[widgetsStore]) 
    const [condidat, setCondidat] = useState<WidgetSchema | null>(null)
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


    const next = useCallback(() => {
        setStep(prev=>steps.length - 1 <= prev ? prev : prev + 1)
    },[steps])

    const renderButtons = useCallback(()=>{
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
        return btns
    },[steps, step, next])

    const curpage = steps[step]
    const Component = curpage.component

    return(
        <FullScreenTemplateDialog maxWidth="90%" onHide={onHide} btns={renderButtons()}>
            {
                steps.length > 0?
                <div className="widget-dialog_steps">
                    {
                        steps.map((item, i)=>(
                            <React.Fragment key={item.title}>
                            <Chips className={`widget-dialog_steps_step${step===i?"_active":""}`} text={item.title}/>
                            {
                                (steps.length - 1 !== i)?
                                <ArrowRight/>:null
                            }
                            </React.Fragment>
                        ))
                    }
                </div>
                :null
            }
            
            <div className="widget-dialog">
                <div className="widget-dialog_left-column">
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
                <div className="widget-dialog_right-column">
                    <Component condidat={condidat} setCondidat={setCondidat}/>
                </div>
            </div>
        </FullScreenTemplateDialog>
    )
}