import { GridLayout, GridLayoutItem, Search } from "alex-evo-sh-ui-kit"

export const DevicePage = () => {

    return(
        <div className="device-page">
            <Search onSearch={data=>console.log(data)}/>
            <GridLayout>
               
            </GridLayout>
        </div>
    )
}