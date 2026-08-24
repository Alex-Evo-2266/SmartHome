import { ListContainer, ListItem, Search } from "alex-evo-sh-ui-kit"
import './widgetConfigDialog.scss'
import { useCallback, useMemo, useState } from "react"
import { LayoutStepDialogProps } from "./types"
import { useDashboardRuntimeData } from "@src/features/Dashboard"

export const LayoutChoiseDialog:React.FC<LayoutStepDialogProps> = ({setCondidat}) => {

    const {runtime} = useDashboardRuntimeData()
    const [selectLayout, setSelectLayout] = useState<string | null>(null)
    const [search, setSearch] = useState<string>("")

    const filterLayout = useMemo(() => {
        const all = runtime.layouts.all()
        if (!search.trim() || !all) return all;
        
        return all.filter(layout => 
            layout.type.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, runtime.layouts]);

    const selectHAndler = useCallback((type:string)=>{
        const cond = runtime.layouts.all().find(item=>item.type === type)
        if(!cond)return
        setCondidat(type)
        setSelectLayout(type)
    },[runtime.layouts])

    return(
        <>
            <Search onSearch={setSearch}/>
            <ListContainer scroll>
            {filterLayout?.map(item=>(
                <ListItem 
                onClick={()=>selectHAndler(item.type)} 
                active={selectLayout === item.type} 
                key={item.type} 
                header={item.type}/>
            ))}
            </ListContainer>
        </>
                    
    )
}