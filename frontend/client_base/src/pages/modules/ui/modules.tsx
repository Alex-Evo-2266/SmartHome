
import { useParams } from 'react-router-dom';
import { useModulePageAPI } from '../../../entites/modulePages';
import { useCallback, useEffect, useState } from 'react';
import { Loading } from '../../../shared/ui/Loading';
import { WebConstructor } from 'alex-evo-web-constructor';
import { PageData } from '../../../entites/modulePages/models/page';
import { MENU_ROOT_ID, MODAL_ROOT_ID } from '../../../const';

export const ModulesPage = () => {

    const { moduleName, pageName } = useParams<{ moduleName: string, pageName:string }>();
    const {getPage, loading} = useModulePageAPI()
    const [pageData, setPageData] = useState<null | PageData>(null)

    if(!moduleName || !pageName)
        throw new Error("error page url")

    const loadPage = useCallback(async()=>{
        const data = await getPage(moduleName, pageName)
        setPageData(data)
    },[getPage, moduleName, pageName])

    useEffect(()=>{
        loadPage()
    },[loadPage])

    if(loading)
    {
        return (<Loading/>)
    }

    if(!pageData)
    {
        return (
            <div>
                error loading page
            </div>
        )
    }

    console.log("p60", pageData)

    return (
        <div>
            <WebConstructor 
            containerMenu={document.getElementById(MENU_ROOT_ID)} 
            containerModal={document.getElementById(MODAL_ROOT_ID)}
            data={pageData.page.page} 
            dialogs={pageData.dialogs} 
            menu={pageData.menu}
            />
        </div>
    )
}