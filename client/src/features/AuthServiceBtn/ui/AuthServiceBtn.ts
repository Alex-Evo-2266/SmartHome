import { generateString } from "../../../shared/lib/helpers/generateString"
import { getCode } from "../helpers/getCode"
import { searchCode } from "../helpers/searchCode"

interface Options{
	width?: number
	height?: number
	text?: string
	host?: string
	client_id?: string
	onSaccess?: (data: string)=>void
}

export interface IAuthBtn{
	component: HTMLDivElement,
	destroy:()=>void
}

let option_def: Options = {
	width: 400,
	height: 50,
	text: "sign in with local auth service",
	host: "",
	client_id: "",
	onSaccess: undefined
}

export function AuthBtn(root: HTMLElement ,option: Options = {}):IAuthBtn | undefined
{
	let options = option_def
	if (!root)
	{
		console.error("authBtn: root component not found")
		return
	}
	options = {...options, ...option}
	let btn = document.createElement('div')
	btn.innerHTML = `
		<img alt="no-img" style="max-width: 45px; max-height: 45px;"></img>
		<p class="authBtn-text">${options.text}</p>
	`

	btn.style.width = options.width + "px"
	btn.style.height = options.height + "px"
	btn.style.display = "flex";
	btn.style.alignItems = "center";
	btn.style.justifyContent = "center";
	btn.classList.add("authBtn-content")
	btn.style.background = "#ddd"
	btn.style.borderRadius = "4px"
	btn.style.boxShadow = "0 0 10px #000"
	btn.style.margin = "5px"
	btn.style.cursor = "pointer"
	root.append(btn)
	let state = generateString(20)

	const click = () => {
		if (options.host && options.host !== "" && options.client_id && options.client_id !== "")
			getCode(options.host, options.client_id, state)
	}

	btn.onclick = click

	let codeAndStete = searchCode()
	if(codeAndStete.state && codeAndStete.state !== state)
		console.error("invalid state")
	if (codeAndStete.code && typeof(options.onSaccess) == "function")
		options.onSaccess(codeAndStete.code)

	return {
		component: btn,
		destroy(){
			root?.remove()
		}
	}
}