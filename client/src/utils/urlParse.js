
export function parseURL(serch)
{
	serch = serch.slice(1,serch.length)
	let strs = serch.split('&')
	let obj = {}
	for (let item of strs)
	{
		let f = item.split('=')
		let name2 = f[0]
		f = f.slice(1,f.length)
		obj[name2] = f.join("")
	}
	return obj
}