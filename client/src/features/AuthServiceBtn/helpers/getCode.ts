import { getHost } from "./getHost"

export const getCode = (host: string, client_id: string, state: string) =>{
	window.location.replace(`${host}/authorize?response_type=code&client_id=${client_id}&redirect_uri=${getHost()}&state=${state}&scope=profile`)
}