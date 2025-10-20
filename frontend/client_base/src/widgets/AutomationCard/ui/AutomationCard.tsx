import { BaseActionCard, Button, Card, FilterGroup, ListContainer, SearchAndFilter, SelectedFilters } from "alex-evo-sh-ui-kit"
import { Automation, ConditionType, useAutomationAPI } from "../../../entites/automation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { AutomationEditor } from "./EditAutomation"
import { DialogPortal } from "../../../shared"
import './style.scss'
import { AutomationItem } from "./AutomationItem"

function matchesFilterFromSelected(
  automation: Automation,
  filters: SelectedFilters
): boolean {
    console.log("ds2", filters, automation)
  for (const key in filters) {
    const filterValues = filters[key];

    // Пропустить группу, если она пустая (ничего не выбрано)
    if (!filterValues || filterValues.length === 0) {
      continue;
    }

    const value = automation[key as keyof Automation];

    if (value === undefined) return false;

    console.log("ds", filterValues, String(value))
    if (!filterValues.includes(String(value))) {
        return false;
    }
  }

  return true;
}



export const AutomationCard = () => {

    const {getAutomationAll, addAutomation} = useAutomationAPI()
    const [automation, setAutomation] = useState<Automation[]>([])
    const [addAutomationItem, setAddAutomationItem] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({})

    const getData = useCallback(async()=>{
        const data = await getAutomationAll()
        setAutomation(data)
    },[getAutomationAll])

    const filteredAutomation = useMemo(()=>automation
        .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(item => matchesFilterFromSelected(item, selectedFilters))
        .sort((a, b) => a.name.localeCompare(b.name)),[automation, searchQuery, selectedFilters]) 

    useEffect(()=>{
        getData()
    },[getData])

    const addAutomationHandler =  useCallback(async(data: Automation)=>{
        if (addAutomationItem){
            await addAutomation(data)
            await getData()
        }
    },[addAutomationItem])

    const filters:FilterGroup[] = [{name: "is_enabled", options: ["true", "false"]}]

    return(
        <>
        <Card header="Automation" className="automation-card">
            <SearchAndFilter border onSearch={setSearchQuery} onChangeFilter={setSelectedFilters} filters={filters} selectedFilters={selectedFilters}/>
            <ListContainer transparent>
            {
                filteredAutomation && filteredAutomation.map((item)=>(
                    <AutomationItem updateData={getData} automation={item} key={`automation-${item.name}`}/>
                ))
            }
            </ListContainer>
            
            <BaseActionCard>
                <Button onClick={()=>setAddAutomationItem(true)}>
                    add automation
                </Button>
            </BaseActionCard>
        </Card>
        {
            addAutomationItem &&
            <DialogPortal>
                <AutomationEditor 
                    onHide={()=>setAddAutomationItem(false)} 
                    automation={{condition:[], trigger: [], then: [], else_branch:[], name:"", condition_type:ConditionType.AND}} 
                    onSave={addAutomationHandler}
                />
            </DialogPortal>
        }
        </>
    )
}