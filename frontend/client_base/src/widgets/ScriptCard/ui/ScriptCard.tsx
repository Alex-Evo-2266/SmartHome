import { BaseActionCard, Button, Card, FilterGroup, ListContainer, SearchAndFilter, SelectedFilters } from "alex-evo-sh-ui-kit"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from 'react-router-dom';

import { ScriptItem } from "./ScriptItem"
import { Script, useScriptAPI } from "../../../entites/script"

function matchesFilterFromSelected(
  automation: Script,
  filters: SelectedFilters
): boolean {
  for (const key in filters) {
    const filterValues = filters[key];

    // Пропустить группу, если она пустая (ничего не выбрано)
    if (!filterValues || filterValues.length === 0) {
      continue;
    }

    const value = automation[key as keyof Script];

    if (value === undefined) return false;

    if (!filterValues.includes(String(value))) {
        return false;
    }
  }

  return true;
}



export const ScriptCard = () => {

    const {getScripts} = useScriptAPI()
    const [script, setScript] = useState<Script[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({})
    const navigate = useNavigate()

    const getData = useCallback(async()=>{
        const data = await getScripts()
        setScript(data.scripts)
    },[getScripts])

    const filteredAutomation = useMemo(()=>script
        .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(item => matchesFilterFromSelected(item, selectedFilters))
        .sort((a, b) => a.name.localeCompare(b.name)),
        [script, searchQuery, selectedFilters]
    ) 

    useEffect(()=>{
        getData()
    },[getData])

    const addScript = () => {
        navigate("/script/constructor")
    }

    const filters:FilterGroup[] = [{name: "is_enabled", options: ["true", "false"]}]

    return(
        <>
        <Card header="Script" className="automation-card">
            <SearchAndFilter border onSearch={setSearchQuery} onChangeFilter={setSelectedFilters} filters={filters} selectedFilters={selectedFilters}/>
            <ListContainer transparent>
            {
                filteredAutomation && filteredAutomation.map((item)=>(
                    <ScriptItem updateData={getData} script={item} key={`script-${item.id}`}/>
                ))
            }
            </ListContainer>
            
            <BaseActionCard>
                <Button onClick={addScript}>
                    add script
                </Button>
            </BaseActionCard>
        </Card>
        </>
    )
}