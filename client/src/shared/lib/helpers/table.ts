import { Column, IDataItem } from "../../model/table";

function getColumnsName(rows: IDataItem[]) {
    let cols: Column[] = []
    if(rows.length > 0)
    for(let row of rows)
    {
        for(let key in row)
        {
            let flag = false
            for(let col of cols)
            {
                if(col.field === key)
                    flag = true
            }
            if(!flag)
                cols.push({
                    title: key,
                    field: key,
                })
        }
    }
    
    return cols
}


export {getColumnsName}