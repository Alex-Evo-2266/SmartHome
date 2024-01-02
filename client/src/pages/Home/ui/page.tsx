import { TextField } from "../../../shared/ui"

export const HomePage = () => {

    return(
        <div>
            HomePage
            <TextField type="color" border onChange={data=>console.log(data.target.value)}/>
        </div>
    )
}