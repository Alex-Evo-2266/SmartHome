import { Column, ICell, IDataItem, celData } from "../../model/table"

interface CellProps{
    column: Column
    data: IDataItem
    color?: string
    backgroundColor?: string
}

export const TableCell = ({data, column, color, backgroundColor}:CellProps) => {
    
    function getValue(colummnName: string, data: IDataItem){
        for(let key in data)
        {
            if(colummnName === key)
            {
                return data[key]
            }
        }
    }

    function getCell(data: celData):ICell{
        if(typeof(data) === "number" || typeof(data) === "string"){
            let cell: ICell = {content: data}
            return cell
        }
        return data
    }

    function getCellArr(data: celData | celData[] | undefined):ICell[]{
        if(!data)
            return[]
        if(Array.isArray(data))
        {
            return data.map(item=>getCell(item))
        }
        return [getCell(data)]
    }

    return(<td style={{backgroundColor: backgroundColor}}>
    {
        getCellArr(getValue(column.field, data)).map((item, index)=>(
            <p key={index} style={{color: item.color ?? color}} className={(item.onClick)?"no-click":""} onClick={item.onClick}>
                {(typeof(item.content) === "string" || typeof(item.content) === "number")?item.content:<item.content/>}
            </p>
        ))
    }
    </td>)
}