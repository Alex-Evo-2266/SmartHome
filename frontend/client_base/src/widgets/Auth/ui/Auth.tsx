import { Button, Panel, TextField, Typography } from "alex-evo-sh-ui-kit"
import { useCallback, useState } from "react"
import { useUserLogin } from "../api/login"
import { LoginRequestData } from "../../../shared/lib/model/authData"

export const Auth = () => {

    const {userLogin} = useUserLogin()

    const [login, setLogin] = useState<LoginRequestData>({
        name: "",
        password: ""
    })

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLogin(prev=>({...prev, [event.target.name]: event.target.value}))
    }

    const onSubmite = useCallback(() => {
        userLogin(login)
    },[userLogin, login])

    return(
        <Panel>
            <Typography type='heading'>Authtorization</Typography>
            <div style={{display: 'flex', justifyContent:'center'}}>
                <div>
                    <TextField name="name" placeholder="login" border onChange={changeHandler}/>
                    <TextField name="password" placeholder="password" border onChange={changeHandler}/>
                    <Button onClick={onSubmite} style={{width:'100%'}}>login</Button>
                </div>
            </div>
        </Panel>
    )
}