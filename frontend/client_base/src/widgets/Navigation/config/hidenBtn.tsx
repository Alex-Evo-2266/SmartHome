import { NavigationItem } from "@src/entites/navigation";
import { Addons } from "alex-evo-sh-ui-kit";

import { getModuleButtons } from "./getModuleButtons";

export function getHidenBtn(modules_btn_items: NavigationItem[]){
    const modules_btn = getModuleButtons(modules_btn_items)
    modules_btn.unshift({
        type: "link",
        text: "modules meneger",
        to: "/manager",
        icon: <Addons/>
    })
    return modules_btn
}