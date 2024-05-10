import { TextField } from "alex-evo-sh-ui-kit"

export const HomePage = () => {

    return(
        <div>
            HomePage
            <TextField type="color" border onChange={data=>console.log(data.target.value)}/>
        </div>
    )
}