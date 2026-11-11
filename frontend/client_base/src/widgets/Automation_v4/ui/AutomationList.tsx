import { Automation, useAutomationAPI } from "@src/entites/automation_v4"
import { BaseActionCard, Button, Card, FilterGroup, ListContainer, SearchAndFilter, SelectedFilters } from "alex-evo-sh-ui-kit"
import { useCallback, useEffect, useMemo, useState } from "react"

import './style.scss'
import { AutomationItem } from "./AutomationItem"
import { AutomationEditor } from "./AutomationEditor"

function matchesFilterFromSelected(
  automation: Automation,
  filters: SelectedFilters
): boolean {
  for (const key in filters) {
    const filterValues = filters[key];

    // Пропустить группу, если она пустая (ничего не выбрано)
    if (!filterValues || filterValues.length === 0) {
      continue;
    }

    const value = automation[key as keyof Automation];

    if (value === undefined) return false;

    if (!filterValues.includes(String(value))) {
        return false;
    }
  }

  return true;
}

export const AutomationCard = () => {

    const {getAutomationAll} = useAutomationAPI()
    const [automation, setAutomation] = useState<Automation[]>([])
    const [selectAutomation, setSelectAutomation] = useState<Automation | null>(null)
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

    const filters:FilterGroup[] = [{name: "is_enabled", options: ["true", "false"]}]

    return(
        <>
        <Card header="Automation" className="automation-card">
            <SearchAndFilter border onSearch={setSearchQuery} onChangeFilter={setSelectedFilters} filters={filters} selectedFilters={selectedFilters}/>
            <ListContainer transparent>
            {
                filteredAutomation && filteredAutomation.map((item)=>(
                    <AutomationItem automation={item} key={`automation-${item.name}`}/>
                ))
            }
            </ListContainer>
            
            <BaseActionCard>
                <Button onClick={()=>{}}>
                    add automation
                </Button>
            </BaseActionCard>
        </Card>
        {
            selectAutomation !== null &&
            <AutomationEditor
                automation={selectAutomation}
                onChange={setSelectAutomation}
                onSave={()=>{}}
            />
        }
        </>
    )
}