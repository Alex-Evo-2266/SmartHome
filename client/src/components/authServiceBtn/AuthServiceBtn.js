const STATE = "sdrtfyujkllhmgfdsfgncfghcfgfnb"

const getHost = ()=>{
	console.log(window.location.host)
	let host = window.location.host
	host = "http://" + host
	return host
}

const	getCode = (host, client_id) =>{
	window.location.replace(`${host}/authorize?response_type=code&client_id=${client_id}&redirect_uri=${getHost()}&state=${STATE}&scope=profile`)
}

const searchCode = ()=>{
	let params = (new URL(document.location)).searchParams;
	return params.get("code")
}

let option_def = {
	width: 400,
	height: 50,
	text: "sign in with local auth service",
	host: "",
	client_id: "",
	onSaccess: null
}

export function AuthBtn(root,option = {})
{
	let options = option_def
	if (!root)
	{
		console.error("authBtn: root component not found")
		return
	}
	for (let key in option)
	{
		options[key] = option[key]
	}
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
	btn.classList = "authBtn-content"
	btn.style.background = "#ddd"
	btn.style.borderRadius = "4px"
	btn.style.boxShadow = "0 0 10px #000"
	btn.style.margin = "5px"
	btn.style.cursor = "pointer"
	root.append(btn)

	const click = () => {
		if (options.host && options.host !== "" && options.client_id && options.client_id !== "")
			getCode(options.host, options.client_id)
	}

	btn.onclick = click

	let code = searchCode()
	if (code && typeof(options.onSaccess) == "function")
		options.onSaccess(code)

	return {
		component: btn,
		destroy(){
			root.pop()
		}
	}
}