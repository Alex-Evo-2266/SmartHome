import { Config } from "alex-evo-sh-auth";

const SMARTHOME_CLIENT_ID = import.meta.env["VITE_SMARTHOME_CLIENT_ID"]
const BASE_KEY_STORAGE = "sh_base"
export const API_AUTH = import.meta.env.VITE_API_AUTH ?? "https://localhost:1338/api-auth/oauth"

export const authConfig = new Config(
    API_AUTH, 
    SMARTHOME_CLIENT_ID, 
    window.location.origin + "/callback", 
    "/home", 
    BASE_KEY_STORAGE
)