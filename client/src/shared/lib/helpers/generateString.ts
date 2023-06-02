
const DEFAULT_ALPHABET = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM-"

function generateString(length: number, alphabet:string = DEFAULT_ALPHABET) {
	let str = ""
	let random = alphabet[Math.floor(Math.random() * alphabet.length)];
	while (str.length < length) {
		random = alphabet[Math.floor(Math.random() * alphabet.length)];
		str += random
	}
	return str
}

export {generateString}