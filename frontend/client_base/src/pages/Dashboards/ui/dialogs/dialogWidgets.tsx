import { ListContainer, ListItem, Search } from "alex-evo-sh-ui-kit"
import './widgetConfigDialog.scss'
import { useCallback, useMemo, useState } from "react"
import { useWidgets } from "../../../../features/Dashboard/helpers/widgetsStore"
import { WidgetStepDialogProps } from "./types"
import { DataNode, WidgetSchema } from "alex-evo-web-constructor"
import { v4 as uuidv4 } from 'uuid';

export const WidgetChoiseDialog:React.FC<WidgetStepDialogProps> = ({setCondidat}) => {

    const widgets = useWidgets()
    const [selectWidget, setSelectWidget] = useState<string | null>(null)
    const [search, setSearch] = useState<string>("")

    const filterWidget = useMemo(() => {
        if (!search.trim() || !widgets) return widgets;
        
        return widgets.filter(widget => 
            widget.name.toLowerCase().includes(search.toLowerCase()) ||
            widget.description?.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, widgets]);

    const selectHAndler = useCallback((id:string)=>{
        console.log(id)
        const cond = widgets?.find(item=>item.id === id)
        console.log(cond)
        if(!cond)return
        const widget:WidgetSchema = {
            id: uuidv4(),
            type: cond.id
        }
        const data:Record<string, DataNode> = {}
        cond.settings?.forEach(item=>{
            data[item.data_name] = item.default ?? ""
        })
        widget.data = data
        setCondidat(()=>widget)
        setSelectWidget(id)
    },[widgets])

    return(
        <>
            <Search onSearch={setSearch}/>
            <ListContainer scroll>
            {filterWidget?.map(item=>(
                <ListItem 
                onClick={()=>selectHAndler(item.id)} 
                text={item.description} 
                active={selectWidget === item.id} 
                icon={item.icon} 
                key={item.id} 
                header={item.name}/>
            ))}
            </ListContainer>
        </>
                    
    )
}